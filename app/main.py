from fastapi import requests
from fastapi import Request, FastAPI, Header, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from .models.message import Message
from .paxos_runner import PaxosRunner
from .enums.enums import ACTION_REQUEST_TYPE, DEFAULT_NUM_NODES
from .models.requests import ActionRequest, PrepareRequest

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

paxos_runner = None


@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    return "success"


@app.get("/debug")
async def print_curr_state(request: Request):
    global paxos_runner
    if paxos_runner is None:
        print("Not Initialized Yet")
        return
    paxos_runner.print_current_state()


@app.get("/init/{num_nodes}")
async def init_visualizer(num_nodes: int):
    global paxos_runner
    paxos_runner = PaxosRunner(num_nodes=num_nodes)
    return paxos_runner.serialize_state()


@app.post("/action")
async def perform_action(action_req: ActionRequest):
    global paxos_runner
    if paxos_runner is None:
        print(f'Falling back to default number of nodes = {DEFAULT_NUM_NODES}')
        paxos_runner = PaxosRunner(num_nodes=DEFAULT_NUM_NODES)
    paxos_runner.perform_action(action_req)
    paxos_runner.print_current_state()  # remove if not debugging
    return paxos_runner.serialize_state()


@app.post("/prepare")
async def perform_prepare(prepare_req: PrepareRequest):
    global paxos_runner
    if paxos_runner is None:
        print(f'Falling back to default number of nodes = {DEFAULT_NUM_NODES}')
        paxos_runner = PaxosRunner(num_nodes=DEFAULT_NUM_NODES)
    paxos_runner.perform_prepare(node_id=prepare_req.node_id, proposal_value=prepare_req.proposal_value)
    paxos_runner.print_current_state()  # remove if not debugging
    return paxos_runner.serialize_state()
