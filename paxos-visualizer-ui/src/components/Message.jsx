import React from 'react';
import { MESSAGE_TYPE_TO_LABEL, ACTION_TYPES } from '../constants';

const Message = ({ messageId, messageType, proposalNumber, sourceNode, value, onMessageActionClick }) => {

    const handleMessageActionClick = (actionType) => onMessageActionClick({ message_id: messageId, action_type: actionType })

    return (
        <div className="flex flex-col items-center justify-center text-slate-900 bg-yellow-500 p-2 rounded-md font-medium">
            <div className="text-md font-extrabold">{MESSAGE_TYPE_TO_LABEL[messageType]}</div>
            <div>Proposal Number: {proposalNumber}</div>
            <div>Source Node: {sourceNode}</div>
            <div>Value: {value}</div>
            <div className="w-full flex gap-1 mt-2 justify-evenly font-semibold">
                <button 
                    className="bg-green-600 text-slate-100 p-1.5 rounded-md text-center" 
                    onClick={() => handleMessageActionClick(ACTION_TYPES.DELIVER)}>
                        Deliver
                </button>
                <button 
                    className="bg-rose-600 text-slate-100 p-1.5 rounded-md text-center" 
                    onClick={() => handleMessageActionClick(ACTION_TYPES.DROP)}>
                        Drop
                </button>
            </div>
        </div>
    );
}

export default Message;
