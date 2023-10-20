from enum import Enum

class MESSAGE_TYPE(Enum):
    ACCEPT = 1
    PROPOSE = 2

class MESSAGE_STATUS(Enum):
    ACCEPTED = 1
    REJECTED = 2