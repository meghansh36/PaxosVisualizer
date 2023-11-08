import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { API_ROUTE } from '../constants';
import NodeLayout from './NodeLayout';

const NUM_NODES=  5;

const fetchSystemState = async (setSystemState) => {
  try {
    const res = await fetch(`${API_ROUTE}/init/${NUM_NODES}`)
    const systemState = await res.json()
    setSystemState(Object.values(systemState))
  } catch (error) {
    console.log("Could not fetch initial System State, error: ", error)
  }
} 

const PaxosSystem = () => {

  const [systemState, setSystemState] = useState([]);

  useEffect(() => {
    fetchSystemState(setSystemState)
  }, [])  

  return (
    <div className="grid grid-flow-col justify-center flex-auto pb-4">
      {systemState.map(({ 
        accept_response_count, accepted_proposal, accepted_value, current_phase, current_state, 
        delivered_messages, message_queue, prep_response_count, promised_proposal, proposal_number, proposal_value, id
        }) => <NodeLayout 
                    key={id}
                    id={id}
                    acceptedValue={accepted_value} 
                    acceptedProposal={accepted_proposal}  
                    proposalNumber={proposal_number}
                    proposalValue={proposal_value}
                    message_queue={message_queue}
                    setSystemState={setSystemState}
                  />)}
    </div>
  );
}

export default PaxosSystem;
