from pydantic import BaseModel
from ..enums.enums import MESSAGE_TYPE, MESSAGE_STATUS

class Message(BaseModel):

    message_type: MESSAGE_TYPE
    target_node: int
    source_node: int
    message_status: MESSAGE_STATUS
    message_id: str