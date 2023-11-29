const API_ROUTE = "http://127.0.0.1:8000";

const MESSAGE_TYPE_TO_LABEL = {
    0: "Prepare Request",
    1: "Accept Request",
    2: "Prepare Response",
    3: "Accept Response"
}

const ACTION_TYPES = {
    DELIVER: "deliver",
    DROP: "drop",
    KILL: "kill",
    REVIVE: "revive"
}

const NODE_PHASE = {
    0: "Idle",
    1: "Prepare",
    2: "Accept"
} 

const NUM_NODES = 5;

const USER_ID_SESSION_KEY = "userId";

const PREPARE_REQ = "/prepare";
const ACTION_REQ = "/action";

const FAULT_INJECTION_TYPES = {
    PREPARE_CHECK_STRING: "PREPARE_CHECK_STRING",
    ACCEPT_CHECK_STRING: "ACCEPT_CHECK_STRING",
    ASSIGN_ACCEPT_PROPOSAL: "ASSIGN_ACCEPT_PROPOSAL",
    ASSIGN_MINPROPOSAL: "ASSIGN_MINPROPOSAL",
    MAJORITY: "MAJORITY" 
} 

const OPERATORS = {
    LESS_THAN: "<",
    GREATER_THAN: ">",
    EQUAL: "==",
    LESS_THAN_EQUAL: "<=",
    GREATER_THAN_EQUAL: ">="
}

export {
    API_ROUTE,
    MESSAGE_TYPE_TO_LABEL,
    ACTION_TYPES,
    NODE_PHASE,
    NUM_NODES,
    USER_ID_SESSION_KEY,
    FAULT_INJECTION_TYPES,
    OPERATORS,
    PREPARE_REQ,
    ACTION_REQ
}