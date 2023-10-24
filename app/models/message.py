from pydantic import BaseModel
from ..enums.enums import MESSAGE_TYPE, MESSAGE_STATUS
import json

class Message(BaseModel):
    message_type: MESSAGE_TYPE
    source_node: int
    target_node: int
    # message_status: MESSAGE_STATUS
    message_id: str

    def __str__(self):
        # Convert the object to a JSON-serializable string
        return json.dumps({
            "message_type": self.message_type,
            "source_node": self.source_node,
            "target_node": self.target_node,
            "message_id": self.message_id
        })