from pydantic import BaseModel
from .message import Message
from ..enums.enums import NODE_PHASE, NODE_STATE, NodePhaseEncoder, NodeStateEncoder
import json

class Node(BaseModel):
    proposal_number: int
    proposal_value: int
    id: int
    accepted_proposal: int
    accepted_value: int
    prep_response_count: int
    accept_response_count: int
    current_phase: NODE_PHASE
    current_state: NODE_STATE

    message_queue: list[Message] = []
    delivered_messages: list[Message] = []

# Define a custom JSON encoder
class NodeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Node):
            # Convert the Person object to a dictionary
            return {
                "proposal_number": obj.proposal_number,
                "proposal_value": obj.proposal_value,
                "id": obj.id,
                "accepted_proposal": obj.accepted_proposal,
                "accepted_value": obj.accepted_value,
                "prep_response_count": obj.prep_response_count,
                "accept_response_count": obj.accept_response_count,
                "current_phase": json.dumps(obj.current_phase, cls=NodePhaseEncoder),
                "current_state": json.dumps(obj.current_state, cls=NodeStateEncoder),
                "message_queue": json.dumps(obj.message_queue),
                "delivered_messages": json.dumps(obj.delivered_messages),
            }
        return super().default(obj)

