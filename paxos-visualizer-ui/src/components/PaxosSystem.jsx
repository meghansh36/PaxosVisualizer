import React from 'react';
import { useEffect, useState } from 'react';
import NodeLayout from './NodeLayout';
import FaultInjection from './FaultInjection';
import PredefinedScenarios from './PredefinedScenarios';
import UndoIcon from '../assets/undo.png';
import RedoIcon from '../assets/redo.png';
import { resetSystemState, prepareRequestAPICall, actionRequestAPICall, sendFaultInjectionRequest } from '../api';

const fetchSystemState = async (setSystemState, actionHistory, actionPosition) => {
  const { systemState, error } = await resetSystemState()
  if (error === null) {
    setSystemState(systemState)
    actionHistory.current = []
    actionPosition.current = -1
  }
} 

const executeFaultInjection = async (setSystemState, actionHistory, actionPosition, data) => {
  const { systemState, error } = await resetSystemState()
  if (error === null) {
    setSystemState(systemState)
    actionHistory.current = []
    actionPosition.current = -1
    sendFaultInjectionRequest(data)
  }
}

const executeUndoAction = async (setSystemState, actionHistory, actionPosition) => {
    console.log(actionHistory)
    const returnedSystemStates = [await resetSystemState()];
    for(let i = 0; i < actionPosition.current; i++) {
      const currentAction = actionHistory.current[i]
      if(currentAction.proposal_value) returnedSystemStates.push(await prepareRequestAPICall(currentAction))
      else returnedSystemStates.push(await actionRequestAPICall(currentAction))
    }

    try {
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
  const [activeMode, setActiveMode] = useState("learner"); // 'learner', 'automated', or 'faultInjection'

  const isUndoDisabled = actionPosition.current === -1;
  const isRedoDisabled = actionPosition.current === actionHistory.current.length - 1;
  const isScenarioMode = activeMode === 'scenarios';
  const undoBtnClassName = isUndoDisabled ? 'bg-sky-800/50': 'bg-sky-800 font-semibold';
  const redoBtnClassName = isRedoDisabled ? 'bg-sky-800/50': 'bg-sky-800 font-semibold';

  const handleUndoClick = async () => await executeUndoAction(setSystemState, actionHistory, actionPosition)
  const handleRedoClick = async () => await executeRedoAction(setSystemState, actionHistory, actionPosition)

  const showLearnerMode = () => {
    if(activeMode !== 'learner'){
      setActiveMode('learner');
      fetchSystemState(setSystemState, actionHistory, actionPosition)
    }
  }


  const showPredefinedScenarios = () => {
    if(activeMode !== 'scenarios'){
      setActiveMode('scenarios');
      fetchSystemState(setSystemState, actionHistory, actionPosition)

    }
  }
  const showFaultInjection = () => {
    if(activeMode !== 'faultInjection'){
      setActiveMode('faultInjection');
      fetchSystemState(setSystemState, actionHistory, actionPosition)

    }
  }

  const onInjectFaults = (faultType, faultString, eventStatus) => {
    if (eventStatus) {
      executeFaultInjection(setSystemState, actionHistory, actionPosition, { fault_type: faultType, fault_string: faultString })   
    } else {
      fetchSystemState(setSystemState, actionHistory, actionPosition)
    }
  }
  
  useEffect(() => {
    fetchSystemState(setSystemState, actionHistory, actionPosition)
  }, [actionHistory, actionPosition])  

  return (
    <div className="flex flex-col h-full">
      <div className="flex w-full justify-center gap-4 text-stone-200">
        <button onClick={showLearnerMode}  className={`mr-1 bg-green-700 text-white p-1.5 rounded-md text-center ${activeMode === 'learner' ? 'button-active' : ''}`}>Learner Mode</button>
        <button onClick={showPredefinedScenarios}  className={`mr-1 bg-yellow-700 text-white p-1.5 rounded-md text-center ${activeMode === 'scenarios' ? 'button-active' : ''}`}>Predefined Scenarios</button>
        <button onClick={showFaultInjection}  className={`mr-1 bg-red-500 text-white p-1.5 rounded-md text-center ${activeMode === 'faultInjection' ? 'button-active' : ''}`}>Fault Injection Mode</button>
      </div>
      {activeMode === 'scenarios' && (
        <div>
          <PredefinedScenarios setSystemState={setSystemState}/>
        </div>
      )}
      {activeMode === 'faultInjection' && <FaultInjection onInjectFaults={onInjectFaults} />}

      {activeMode === 'learner' && (
        <div>
          <div className='text-center w-full text-stone-200 font-semibold mb-2 mt-8'>Replay Actions</div>
          <div className="flex w-full justify-center gap-4 text-stone-200">
            <button className={`flex flex-row gap-2 items-center p-1.5 rounded-md ${undoBtnClassName}`} disabled={isUndoDisabled} onClick={handleUndoClick}>
              Undo <img src={UndoIcon} alt="undo-icon" className="w-6" />
            </button>
            <button className={`flex flex-row gap-2 items-center p-1.5 rounded-md ${redoBtnClassName}`} disabled={isRedoDisabled} onClick={handleRedoClick}>
              Redo <img src={RedoIcon} alt="redo-icon" className="w-6" />
            </button>
          </div>
        </div>
      )}
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
                      current_state={current_state}
                      isScenarioMode={isScenarioMode}
                    />)}
      </div>
    </div>
  );
}

export default PaxosSystem;
