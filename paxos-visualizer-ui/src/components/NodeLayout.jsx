import React, { useRef, useState } from 'react';
import Node from './Node';
import Message from './Message';
import Tick from "../assets/correct.png";
import Cancel from "../assets/x-button.png";
import { prepareRequestAPICall, actionRequestAPICall } from '../api';

const registerStateInApp = (systemState, data, setSystemState, actionHistory, actionPosition) => {
    setSystemState(systemState)
    if (actionPosition.current !== actionHistory.current.length - 1) actionHistory.current = actionHistory.current.slice(0, actionPosition.current+1)
    actionHistory.current.push(data)
    actionPosition.current = actionHistory.current.length - 1
}

const sendPrepareRequest = async (data, setSystemState, actionHistory, actionPosition) => {
    const { systemState, error } = await prepareRequestAPICall(data);
    if (error === null) registerStateInApp(systemState, data, setSystemState, actionHistory, actionPosition)
}

const sendActionRequest = async (data, setSystemState, actionHistory, actionPosition) => {
    const { systemState, error } = await actionRequestAPICall(data);
    if (error === null) registerStateInApp(systemState, data, setSystemState, actionHistory, actionPosition)
}

const NodeLayout = ({ id, acceptedValue, acceptedProposal, message_queue, 
    proposalNumber, proposalValue, setSystemState, minProposal, currentPhase, actionHistory, actionPosition, current_state }) => {
    
    const [paxosDialogVisibility, setPaxosDialogVisibility] = useState(false)
    const inputRef = useRef(null)

    const displayInitiatePaxosDialog = () => setPaxosDialogVisibility(true)
    const handleInitiatePaxos = () => {
        const proposingValue = inputRef.current.value
        sendPrepareRequest({ node_id: id, proposal_value: proposingValue }, setSystemState, actionHistory, actionPosition)
        setPaxosDialogVisibility(false)
    }
    const cancelInitiatePaxos = () => setPaxosDialogVisibility(false)

    const handleKillNode = () => {
        sendActionRequest({node_id: id, message_id: 0, action_type: 'kill'}, setSystemState, actionHistory, actionPosition)
    }

    const handleReviveNode = () => {
        sendActionRequest({node_id: id, message_id: 0, action_type: 'revive'}, setSystemState, actionHistory, actionPosition)
    }

    const executeMessageAction = (messagePayload) => sendActionRequest({ node_id: id, ...messagePayload }, setSystemState, actionHistory, actionPosition) 

    return (
        <div className="flex relative flex-col max-w-[14rem] min-w-[6rem m-4 items-center gap-4 min-h-[50rem] border-4 border-rose-700 rounded-md p-4">
        {!current_state ? <div className='absolute h-full w-full top-0 left-0 bg-black/40'></div> : ''}
        <Node id={id} 
            acceptedValue={acceptedValue} 
            acceptedProposal={acceptedProposal} 
            proposalNumber={proposalNumber} 
            proposalValue={proposalValue} 
            currentPhase={currentPhase}
            minProposal={minProposal} 
        />
        <button onClick={displayInitiatePaxosDialog} className="bg-rose-700 text-white p-1.5 rounded-md text-center">Initiate Paxos</button>
        {paxosDialogVisibility && <div className="flex justify-center gap-1">
            <input type="text" placeholder="Propose Value" className="w-6/12 p-1 rounded-sm" ref={inputRef} />
            <button onClick={handleInitiatePaxos}><img src={Tick} alt="submit-btn" className="w-6" /></button>
            <button onClick={cancelInitiatePaxos}><img src={Cancel} alt="cancel-btn" className="w-6" /></button>
        </div>}

        <div>
            <button onClick={handleKillNode}  className="mr-1 bg-red-700 text-white p-1.5 rounded-md text-center">Kill Node</button>
            <button onClick={handleReviveNode} className="bg-green-700 text-white p-1.5 rounded-md text-center z-10 relative">Revive Node</button>
        </div>
        <div className="text-lg italic font-semibold text-stone-200">Message Queue</div>
        {message_queue.map(({ message_id, message_type, proposal_number, source_node, value }) => 
                <Message 
                    key={message_id} 
                    messageType={message_type}
                    messageId={message_id}  
                    proposalNumber={proposal_number} 
                    sourceNode={source_node}
                    value={value}
                    onMessageActionClick={executeMessageAction}
                />)}
        </div>
    );
}

export default NodeLayout;
