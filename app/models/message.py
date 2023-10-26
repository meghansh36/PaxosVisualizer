from pydantic import BaseModel
from ..enums.enums import MESSAGE_TYPE, MessageTypeEncoder
import json


class Message(BaseModel):
    message_type: MESSAGE_TYPE
    source_node: int
    # message_status: MESSAGE_STATUS
    message_id: int
    proposal_number: int
    value: int


class MessageEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Message):
            # Convert the Message object to a dictionary
            return {
                "message_type": json.dumps(obj.message_type, cls=MessageTypeEncoder),
                "source_node": obj.source_node,
                "message_id": obj.message_id,
                "proposal_number": obj.proposal_number,
                "value": obj.value,
            }
        return super().default(obj)
