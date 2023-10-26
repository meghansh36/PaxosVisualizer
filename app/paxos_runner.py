from .models.node import Node, NodeEncoder
from .models.message import Message
from .enums.enums import NODE_PHASE, NODE_STATE, MESSAGE_TYPE, ACTION_REQUEST_TYPE
from .models.requests import ActionRequest
import json


class PaxosRunner:
    def __init__(self, num_nodes):
        # Kept as the global proposal number so any new proposal number is bigger than the previous
        self.proposal_number = -1
        # Global message ID
        self.message_id = -1
        self.majority = -1
        self.num_nodes = num_nodes
        self.nodes = {}
        for i in range(0, num_nodes):
            self.nodes[i] = self.init_node(i)

    @staticmethod
    def init_node(node_id: int):
        return Node(id=node_id, proposal_number=-1, proposal_value=-1, promised_proposal=-1, accepted_value=None,
                    prep_response_count=0, accept_response_count=0, current_phase=NODE_PHASE.NONE,
                    current_state=NODE_STATE.ALIVE)

    def generate_message_id(self):
        self.message_id += 1
        return self.message_id

    def perform_prepare(self, node_id: int, proposal_value: int):
        print('Preparing node ', node_id)
        # New globally higher proposal number
        # TODO: Can change later on to show how lower proposal number will not do anything
        self.proposal_number += 1

        # Change node state
        node_state = self.nodes[node_id]
        node_state.proposal_number = self.proposal_number
        node_state.proposal_value = proposal_value
        node_state.current_phase = NODE_PHASE.PREPARE_PHASE

        # Send prepare message to all nodes
        for target_node in range(1, self.num_nodes + 1):
            if target_node != node_id and self.nodes[node_id].current_state == NODE_STATE.ALIVE:
                prep_req_message = Message(message_type=MESSAGE_TYPE.PREPARE_REQUEST, source_node=node_id,
                                           message_id=self.generate_message_id(),
                                           proposal_number=node_state.proposal_number, value=proposal_value)
                self.nodes[node_id].message_queue.append(prep_req_message)

    def perform_action(self, action_request: ActionRequest):
        node = self.nodes[action_request.node_id]

        if ActionRequest.action_type == ACTION_REQUEST_TYPE.KILL:
            # TODO: Kill the node - do we drop all of its messages?
            node.current_state = NODE_STATE.DEAD

        elif ActionRequest.action_type == ACTION_REQUEST_TYPE.REVIVE:
            # TODO: Revive the node, what else to do here?
            node.current_state = NODE_STATE.ALIVE

        elif node.current_state == NODE_STATE.ALIVE:
            # If node is alive, perform the requested action
            message_id = action_request.message_id
            message = None

            # Retrieve message from the Node's message queue
            for message in node.message_queue:
                if message_id == message.message_id:
                    message = message

            if ActionRequest.action_type == ACTION_REQUEST_TYPE.DELIVER:
                if message.message_type == MESSAGE_TYPE.PREPARE_REQUEST:
                    node = self.handle_prepare_request(message, node)
                elif message.message_type == MESSAGE_TYPE.PREPARE_RESPONSE:
                    node = self.handle_prepare_response(message, node)
                elif message.message_type == MESSAGE_TYPE.ACCEPT_REQUEST:
                    node = self.handle_accept_request(message, node)
                elif message.message_type == MESSAGE_TYPE.ACCEPT_RESPONSE:
                    node = self.handle_accept_response(message, node)
            elif ActionRequest.action_type == ACTION_REQUEST_TYPE.DROP:
                node.message_queue.remove(message)

        # Update node state
        self.nodes[action_request.node_id] = node

    def handle_prepare_request(self, message, node):
        if message.proposal_number > node.promised_proposal:
            node.promised_proposal = message.proposal_number

        # Fetch the proposer node
        source_node = self.nodes[message.source_node]

        # Create the prepare response message
        prepare_response_message = Message(message_type=MESSAGE_TYPE.PREPARE_RESPONSE, source_node=node.id,
                                           message_id=self.generate_message_id(),
                                           proposal_number=node.promised_proposal, value=node.accepted_value)

        # Send the prepare response to proposer
        source_node.message_queue.append(prepare_response_message)
        self.nodes[message.source_node] = source_node

        return node

    def handle_prepare_response(self, message, node):
        # TODO - handle based on majority responses
        return node

    def handle_accept_request(self, message, node):
        # TODO
        return node

    def handle_accept_response(self, message, node):
        return node

    def print_current_state(self):
        for node in range(1, self.num_nodes + 1):
            print(node, self.nodes[node])

    def serialize_state(self):
        return json.dumps(self.nodes, cls=NodeEncoder, indent=4)

# Prepare generates a proposal number
# Proposal node phase changes to Prepare
# For all Nodes
# Creates message objects
# Append Msg to Message Queue