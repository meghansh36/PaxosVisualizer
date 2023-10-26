from pydantic import BaseModel
from ..enums.enums import ACTION_REQUEST_TYPE


class ActionRequest(BaseModel):
    node_id: int
    message_id: int
    action_type: ACTION_REQUEST_TYPE


class PrepareRequest(BaseModel):
    node_id: int
    proposal_value: int
