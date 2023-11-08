import React from 'react';
import { NODE_PHASE } from '../constants';

const Node = ({ id, acceptedValue, acceptedProposal, proposalNumber, proposalValue, minProposal, currentPhase  }) => {

    return (
        <div className="flex flex-col items-center justify-center bg-sky-700 rounded-full h-44 w-44 text-white font-medium">
            <div>Node ID: {id}</div>
            <div>prop_num: {proposalNumber}</div>
            <div>prop_val: {proposalValue}</div>
            <div>min_prop: {minProposal}</div>
            <div>acc_value: {acceptedValue}</div>
            <div>Phase: {NODE_PHASE[currentPhase]}</div>
        </div>
  );
}

export default Node;
