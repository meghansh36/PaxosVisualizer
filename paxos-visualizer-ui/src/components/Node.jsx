import React from 'react';

const Node = ({ id, acceptedValue, acceptedProposal }) => {

    return (
        <div className="flex flex-col items-center justify-center bg-sky-700 rounded-full h-40 w-40 text-white font-medium">
            <div>Node ID: {id}</div>
            <div>acc_val: {acceptedValue || "Null"}</div>
            <div>acc_prop: {acceptedProposal}</div>
        </div>
  );
}

export default Node;
