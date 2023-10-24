from .models.node import Node, NodeEncoder
from .models.message import Message
from .enums.enums import NODE_PHASE, NODE_STATE, MESSAGE_TYPE
import json

class PaxosRunner:
    def __init__(self, num_nodes):
        # Kept as the global proposal number so any new proposal number is bigger than the previous
        self.proposal_number = 0
        # Global message ID
        self.message_id = 0

        self.num_nodes = num_nodes
        self.state = {}
        for i in range(1, num_nodes + 1):
            self.state[i] = self.init_node(i)

    def init_node(self, node_id: int):
        return Node(id=node_id, proposal_number=-1, proposal_value=-1, accepted_proposal=-1, accepted_value=-1, prep_response_count=0, accept_response_count=0, current_phase=NODE_PHASE.NONE, current_state=NODE_STATE.ALIVE)

    def get_message_id(self):
        self.message_id += 1
        return self.message_id

    def perform_prepare(self, node_id: int, proposal_value: int):
        print('Preparing node ', node_id)
        # New globally higher proposal number
        # TODO: Can change later on to show how lower proposal number will not do anything
        self.proposal_number += 1

        # Change node state
        node_state = self.state[node_id]
        node_state.proposal_number = self.proposal_number
        node_state.proposal_value = proposal_value
        node_state.current_phase = NODE_PHASE.PREPARE_PHASE

        # Send prepare message to all nodes
        for tar_node in range(1, self.num_nodes + 1):
            if tar_node != node_id:
                prep_req_message = Message(message_type=MESSAGE_TYPE.PREPARE_REQUEST, source_node=node_id, target_node=tar_node, message_id=self.get_message_id())
                self.state[node_id].message_queue.append(prep_req_message)

    def perform_action(self, action_request):
        # TODO: Write code
        # Validate if message exists - perform action
        pass

    def print_current_state(self):
        for node in range(1, self.num_nodes + 1):
            print(node, self.state[node])

    def serialize_state(self):
        return json.dumps(self.state, cls=NodeEncoder, indent=4)
