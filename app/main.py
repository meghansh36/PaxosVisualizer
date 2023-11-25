from fastapi import requests
from fastapi import Request, FastAPI, Header, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .models.message import Message
from .paxos_runner import PaxosRunner
from .enums.enums import ACTION_REQUEST_TYPE, DEFAULT_NUM_NODES, SESSION_EXPIRATION_TIME_IN_SECONDS
from .models.requests import ActionHttpRequest, PrepareHttpRequest, InitHttpRequest
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import uuid
import time

app = FastAPI(
    title="Paxos Runner",
    version="v0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Declare user states
paxos_runners = {}
paxos_runners_access_times = {}

scheduler = BackgroundScheduler()


def on_startup():
    print("Initializing user dictionaries")
    global paxos_runners
    global paxos_runners_access_times
    paxos_runners = {}
    paxos_runners_access_times = {}
    scheduler.start()


def on_shutdown():
    scheduler.shutdown()


app.add_event_handler("startup", on_startup)
app.add_event_handler("shutdown", on_shutdown)


@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    return "success"


@app.get("/debug")
async def print_curr_state(user_id: str):
    global paxos_runners
    if paxos_runners[user_id] is None:
        print("Not Initialized Yet")
        return
    paxos_runners[user_id].print_current_state()
    return paxos_runners[user_id]


@app.post("/init")
async def init_visualizer(init_req: InitHttpRequest):
    global paxos_runners
    global paxos_runners_access_times

    user_id = None
    if init_req.user_id is None:
        # Create new user id and send new state
        user_id = str(uuid.uuid4())
    else:
        user_id = init_req.user_id

    # Whatever user ID client sends, we just init it
    # If client doesn't send, we create and return it
    paxos_runners_access_times[user_id] = time.time()
    paxos_runners[user_id] = PaxosRunner(num_nodes=init_req.num_nodes)
    response = {"user_id": user_id, "state": paxos_runners[user_id].serialize_state().body}
    return response


@app.post("/action")
async def perform_action(action_req: ActionHttpRequest):
    global paxos_runners
    global paxos_runners_access_times

    if action_req.user_id not in paxos_runners:
        return JSONResponse(status_code=400, content={"message": "User session has expired. Please Init again."})

    paxos_runners_access_times[action_req.user_id] = time.time()
    paxos_runners[action_req.user_id].perform_action(action_req)
    paxos_runners[action_req.user_id].print_current_state()  # remove if not debugging
    return paxos_runners[action_req.user_id].serialize_state()


@app.post("/prepare")
async def perform_prepare(prepare_req: PrepareHttpRequest):
    global paxos_runners
    global paxos_runners_access_times

    if prepare_req.user_id not in paxos_runners:
        return JSONResponse(status_code=400, content={"message": "User session has expired. Please Init again."})

    paxos_runners_access_times[prepare_req.user_id] = time.time()
    paxos_runners[prepare_req.user_id].perform_prepare(node_id=prepare_req.node_id,
                                                       proposal_value=prepare_req.proposal_value)
    paxos_runners[prepare_req.user_id].print_current_state()  # remove if not debugging
    return paxos_runners[prepare_req.user_id].serialize_state()


# Function to clean up memory for older sessions
def clean_up_older_sessions():
    global paxos_runners
    curr_time = time.time()
    for user_id in list(paxos_runners_access_times):
        # Sessions with more than 30 minuted of inactivity are removed
        if curr_time - paxos_runners_access_times[user_id] > SESSION_EXPIRATION_TIME_IN_SECONDS:
            paxos_runners.pop(user_id, None)
            paxos_runners_access_times.pop(user_id, None)


# Add the cron job to the scheduler
scheduler.add_job(clean_up_older_sessions, trigger=CronTrigger(minute='*/10'))  # Run every 10 minutes
