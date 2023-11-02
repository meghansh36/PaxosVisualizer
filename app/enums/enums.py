from enum import Enum
import json

DEFAULT_NUM_NODES = 5


class MESSAGE_TYPE(Enum):
    PREPARE_REQUEST = 0
    ACCEPT_REQUEST = 1
    PREPARE_RESPONSE = 2
    ACCEPT_RESPONSE = 2


class MessageTypeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, MESSAGE_TYPE):
            return obj.name  # Serialize the Enum value by its name
        return super().default(obj)


class MESSAGE_STATUS(Enum):
    ACCEPTED = 1
    REJECTED = 2


# TODO: Confirm if this is all the phases
# Phases which a node could be in
class NODE_PHASE(Enum):
    NONE = 0
    PREPARE_PHASE = 1
    ACCEPT_PHASE = 2


class NodePhaseEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, NODE_PHASE):
            return obj.name  # Serialize the Enum value by its name
        return super().default(obj)


# TODO: Check any other state?
class NODE_STATE(Enum):
    DEAD = 0
    ALIVE = 1


class NodeStateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, NODE_STATE):
            return obj.name  # Serialize the Enum value by its name
        return super().default(obj)


class ACTION_REQUEST_TYPE(Enum):
    DELIVER = "deliver"
    DROP = "drop"
    KILL = "kill"
    REVIVE = "revive"
