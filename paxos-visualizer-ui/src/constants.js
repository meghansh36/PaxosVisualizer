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

export {
    API_ROUTE,
    MESSAGE_TYPE_TO_LABEL,
    ACTION_TYPES
}