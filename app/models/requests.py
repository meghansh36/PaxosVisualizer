from pydantic import BaseModel
from ..enums.enums import ACTION_REQUEST_TYPE
from typing import Optional

class InitHttpRequest(BaseModel):
    num_nodes: int
    user_id: str = None

class ActionHttpRequest(BaseModel):
    user_id: str
    node_id: int
    message_id: int
    action_type: ACTION_REQUEST_TYPE

class PrepareHttpRequest(BaseModel):
    user_id: str
    node_id: int
    proposal_value: str

class FaultHttpRequest(BaseModel):
    user_id: str
    fault_type: str
    fault_string: str
