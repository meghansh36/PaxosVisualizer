import React from 'react';
import { useEffect, useState } from 'react';
import NodeLayout from './NodeLayout';
import UndoIcon from '../assets/undo.png';
import RedoIcon from '../assets/redo.png';
import { resetSystemState, prepareRequestAPICall, actionRequestAPICall } from '../api';

const fetchSystemState = async (setSystemState, actionHistory, actionPosition) => {
  const { systemState, error } = await resetSystemState()
  if (error === null) {
    setSystemState(systemState)
    actionHistory.current = []
    actionPosition.current = -1
  }
} 

const executeUndoAction = async (setSystemState, actionHistory, actionPosition) => {
    const replayActionPromises = [resetSystemState()];
    for(let i = 0; i < actionPosition.current; i++) {
      const currentAction = actionHistory.current[i]
      if(currentAction.proposal_value) replayActionPromises.push(prepareRequestAPICall(currentAction))
      else replayActionPromises.push(actionRequestAPICall(currentAction))
    }

    try {
      const returnedSystemStates = await Promise.all(replayActionPromises)
      setSystemState(returnedSystemStates[returnedSystemStates.length - 1].systemState)
      actionPosition.current = actionPosition.current - 1
    } catch (error) {
      console.log("Could not execute Undo Action, error: ", error)
    }
}

const executeRedoAction = async (setSystemState, actionHistory, actionPosition) => {
    const nextAction = actionHistory.current[actionPosition.current + 1]
    let tempResponse = {}
    if (nextAction.proposal_value) tempResponse = await prepareRequestAPICall(nextAction)
    else tempResponse = await actionRequestAPICall(nextAction)
    
    if (tempResponse.error === null) {
      setSystemState(tempResponse.systemState)
      actionPosition.current = actionPosition.current + 1
    }
}

const PaxosSystem = ({ actionHistory, actionPosition }) => {

  const [systemState, setSystemState] = useState([]);
  
  const isUndoDisabled = actionPosition.current === -1;
  const isRedoDisabled = actionPosition.current === actionHistory.current.length - 1;

  const undoBtnClassName = isUndoDisabled ? 'bg-sky-800/50': 'bg-sky-800 font-semibold';
  const redoBtnClassName = isRedoDisabled ? 'bg-sky-800/50': 'bg-sky-800 font-semibold';

  const handleUndoClick = () => executeUndoAction(setSystemState, actionHistory, actionPosition)
  const handleRedoClick = () => executeRedoAction(setSystemState, actionHistory, actionPosition)
  
  useEffect(() => {
    fetchSystemState(setSystemState, actionHistory, actionPosition)
  }, [actionHistory, actionPosition])  

  return (
    <div className="flex flex-col h-full">
      <div className='text-center w-full text-stone-200 font-semibold mb-2'>Replay Actions</div>
      <div className="flex w-full justify-center gap-4 text-stone-200">
        <button className={`flex flex-row gap-2 items-center p-1.5 rounded-md ${undoBtnClassName}`} disabled={isUndoDisabled} onClick={handleUndoClick}>
          Undo <img src={UndoIcon} alt="undo-icon" className="w-6" />
        </button>
        <button className={`flex flex-row gap-2 items-center p-1.5 rounded-md ${redoBtnClassName}`} disabled={isRedoDisabled} onClick={handleRedoClick}>
          Redo <img src={RedoIcon} alt="redo-icon" className="w-6" />
        </button>
      </div>
      <div className="grow grid grid-flow-col justify-center flex-auto pb-4">
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
                      minProposal={promised_proposal}
                      currentPhase={current_phase}
                      actionHistory={actionHistory}
                      actionPosition={actionPosition}
                      setSystemState={setSystemState}
                    />)}
      </div>
    </div>
  );
}

export default PaxosSystem;
