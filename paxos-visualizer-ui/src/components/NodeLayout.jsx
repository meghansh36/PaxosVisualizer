import React, { useRef, useState } from 'react';
import Node from './Node';
import Message from './Message';
import Tick from "../assets/correct.png";
import Cancel from "../assets/x-button.png";
import { API_ROUTE } from '../constants';

const sendPrepareRequest = async (data, setSystemState) => {
    try {
        const res = await fetch(`${API_ROUTE}/prepare`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const systemState = await res.json()
        setSystemState(Object.values(systemState))
    } catch (error) {
        console.log("Could not send Prepare Request, error: ", error)
    }
}

const sendActionRequest = async (data, setSystemState) => {
    try {
        const res = await fetch(`${API_ROUTE}/action`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const systemState = await res.json()
        setSystemState(Object.values(systemState))
    } catch (error) {
        console.log("Could not send Action Request, error: ", error)
    }
}

const NodeLayout = ({ id, acceptedValue, acceptedProposal, message_queue, 
    proposalNumber, proposalValue, setSystemState, minProposal, currentPhase }) => {
    
    const [paxosDialogVisibility, setPaxosDialogVisibility] = useState(false)
    const inputRef = useRef(null)

    const displayInitiatePaxosDialog = () => setPaxosDialogVisibility(true)
    const handleInitiatePaxos = () => {
        const proposingValue = inputRef.current.value
        sendPrepareRequest({ node_id: id, proposal_value: proposingValue }, setSystemState)
        setPaxosDialogVisibility(false)
    }
    const cancelInitiatePaxos = () => setPaxosDialogVisibility(false)

    const executeMessageAction = (messagePayload) => sendActionRequest({ node_id: id, ...messagePayload }, setSystemState) 

    return (
        <div className="flex flex-col max-w-[14rem] min-w-[6rem m-4 items-center gap-4 min-h-full border-4 border-rose-700 rounded-md p-4">
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
            <button onClick={handleInitiatePaxos}><img src={Tick} alt="submit" className="w-6" /></button>
            <button onClick={cancelInitiatePaxos}><img src={Cancel} alt="submit" className="w-6" /></button>
        </div>}
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
