import React, { useState, useEffect } from 'react';
import scenarios from './scenarios.json';
import { PREPARE_REQ, ACTION_REQ } from '../constants';
import { prepareRequestAPICall, actionRequestAPICall, resetSystemState } from '../api';


const sendPrepareRequest = async (data, setSystemState, setStateFlag = true) => {
    const { systemState, error } = await prepareRequestAPICall(data);
    if (error === null && setStateFlag)  setSystemState(systemState)

}

const sendActionRequest = async (data, setSystemState, setStateFlag = true) => {
    const { systemState, error } = await actionRequestAPICall(data);
    if (error === null && setStateFlag) setSystemState(systemState);
}

const resetState = async (setSystemState) => {
  const { systemState, error } = await resetSystemState()
  if (error === null) setSystemState(systemState)
}

const PredefinedScenarios = ({ setSystemState }) => {

    const [selectedScenario, setSelectedScenario] = useState('');
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [infoMessage, setInfoMessage] = useState('');
    // Find the selected scenario object
    const activeScenario = scenarios.find(scenario => scenario.id === selectedScenario);
    const isAtStart = currentMessageIndex === 0;
    const isAtEnd = activeScenario && currentMessageIndex === activeScenario.messages.length;


     useEffect(() => {
      // Reset the message index when a new scenario is selected
      setCurrentMessageIndex(0);
    }, [selectedScenario]);

    const handleScenarioChange = (e) => {
      setSelectedScenario(e.target.value);
      resetState(setSystemState);

    };

    const handleNext = () => {
      const scenario = activeScenario;

      if (activeScenario && currentMessageIndex < scenario.messages.length) {
        let message = scenario.messages[currentMessageIndex];

        if(message.route === PREPARE_REQ)
            sendPrepareRequest({ node_id: message.input.node_id, proposal_value: message.input.proposal_value }, setSystemState)
        else if (message.route === ACTION_REQ)
            sendActionRequest({node_id: message.input.node_id, message_id: message.input.message_id, action_type: message.input.action_type}, setSystemState)

        setInfoMessage(message.message)
        setCurrentMessageIndex(currentMessageIndex + 1);

      }
    };

    const handlePrevious = async () => {
      const scenario = activeScenario;
      if (scenario && currentMessageIndex >= 0) {
        resetState(setSystemState)
        setInfoMessage('')
        let flag = false;

        for(let i=0; i<= currentMessageIndex - 2; i++){
          let message = scenario.messages[i];
          if(i === currentMessageIndex - 2){
             flag = true;
             setInfoMessage(message.message)
          }

          if(message.route === PREPARE_REQ)
            await sendPrepareRequest({ node_id: message.input.node_id, proposal_value: message.input.proposal_value }, setSystemState, flag)
          else if (message.route === ACTION_REQ)
            await sendActionRequest({node_id: message.input.node_id, message_id: message.input.message_id, action_type: message.input.action_type}, setSystemState, flag)

        }
        setCurrentMessageIndex(currentMessageIndex-1);

      }
    };

    return (
    <div className="p-4 text-white mt-8">
      <select
        onChange={handleScenarioChange}
        className="bg-gray-800 border border-gray-500 rounded-md p-2 text-white"
        value={selectedScenario}
      >
        <option value="" className="text-gray-300">Select a Scenario</option>
        {scenarios.map(scenario => (
          <option key={scenario.id} value={scenario.id} className="text-gray-300">{scenario.name}</option>
        ))}
      </select>

      {selectedScenario && (
        <div className="mt-4">
          <p className="text-white-600 mb-4 font-bold">{activeScenario.description}</p>
          <button className={`bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md mr-2
                        ${isAtStart ? 'opacity-50 cursor-not-allowed bg-blue-300' : ''}`} disabled={isAtStart} onClick={handlePrevious} >Previous</button>
          <button className={`bg-green-500 hover:bg-green-700 text-white p-2 rounded-md
                        ${isAtEnd ? 'opacity-50 cursor-not-allowed bg-green-300' : ''}`} disabled={isAtEnd} onClick={handleNext} >Next</button>
          <p className="text-white-300 mb-4 mt-10">{infoMessage ? infoMessage: "-"}</p>
        </div>
      )}


    </div>
  );

}

export default PredefinedScenarios