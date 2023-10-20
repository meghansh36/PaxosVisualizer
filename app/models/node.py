from pydantic import BaseModel

class Node(BaseModel):

    proposal_number: int
    proposal_value: int
    _id: str
    accepted_proposal: int
    accepted_value: int
    prep_response_count: int
    accept_response_count: int
    current_phase: str
    current_state: str

    message_queue: list
    delivered_messages: list

