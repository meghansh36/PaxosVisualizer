from pydantic import BaseModel
from .message import Message, MessageEncoder
from ..enums.enums import NODE_PHASE, NODE_STATE, NodePhaseEncoder, NodeStateEncoder
import json
from typing import Optional


class Node(BaseModel):
    proposal_number: int
    proposal_value: Optional[str]
    id: int
    promised_proposal: int
    accepted_proposal: int
    accepted_value: Optional[str]
    prep_response_count: int
    accept_response_count: int
    current_phase: NODE_PHASE
    current_state: NODE_STATE

    message_queue: list[Message] = []
    delivered_messages: list[Message] = []

    def __str__(self):
        res = (f"Node: {self.id}\nStatus: {self.current_state}, Phase: {self.current_phase}\n"
               + f"Promised Proposal: {self.promised_proposal}, " + f"Accepted Value: {self.accepted_value}"
               + f"\nMessages:\n{self.message_queue}\n")
        if self.current_phase != NODE_PHASE.NONE:
            res += ("----------PROPOSER---------\n"
                    + f"Proposal Number: {self.proposal_number}, "
                    + f"Proposal Value: {self.proposal_value}\n"
                    + f"Prepare responses: {self.prep_response_count}, "
                    + f"Accept responses: {self.accept_response_count}\n")
        res += "-------------------------------------------------------"
        return res


# Define a custom JSON encoder
class NodeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Node):
            # Convert the Node object to a dictionary
            return {
                "proposal_number": obj.proposal_number,
                "proposal_value": obj.proposal_value,
                "id": obj.id,
                "promised_proposal": obj.promised_proposal,
                "accepted_value": obj.accepted_value,
                "prep_response_count": obj.prep_response_count,
                "accept_response_count": obj.accept_response_count,
                "current_phase": json.dumps(obj.current_phase, cls=NodePhaseEncoder),
                "current_state": json.dumps(obj.current_state, cls=NodeStateEncoder),
                "message_queue": json.dumps(obj.message_queue, cls=MessageEncoder),
                "delivered_messages": json.dumps(obj.delivered_messages),
            }
        return super().default(obj)
