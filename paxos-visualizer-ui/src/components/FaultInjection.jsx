import React, { useState, useRef } from 'react';
import { FAULT_INJECTION_TYPES, OPERATORS } from '../constants';
import PaxosAlgoImage from '../assets/paxos_algo.png';

const FaultInjection = ({ onInjectFaults }) => {

    const majorityNumber = useRef(null);

    const [dropDownVisibility, setDropDownVisibility] = useState({
        [FAULT_INJECTION_TYPES.PREPARE_CHECK_STRING]: "hidden",
        [FAULT_INJECTION_TYPES.ACCEPT_CHECK_STRING]: "hidden"
    })

    const [dropdownValue, setDropdownValue] = useState({
        [FAULT_INJECTION_TYPES.PREPARE_CHECK_STRING]: OPERATORS.GREATER_THAN,
        [FAULT_INJECTION_TYPES.ACCEPT_CHECK_STRING]: OPERATORS.GREATER_THAN_EQUAL
    })
 
    const [faultValue, setFaultValue] = useState(FAULT_INJECTION_TYPES.PREPARE_CHECK_STRING)

    const onDropDownBtnClick = faultType => {
        setDropDownVisibility({ ...dropDownVisibility, [faultType]: dropDownVisibility[faultType] === "hidden" ? "block" : "hidden" })
    }

    const onMenuClick = (event, selectedOperator, faultType) => {
        setDropdownValue({ ...dropdownValue, [faultType]: selectedOperator })
        event.stopPropagation()
    }
 
    const renderFaultInjectionOptions = () => Object.values(FAULT_INJECTION_TYPES).map(faultType => {
        let faultLabel = ''
        if (faultType === FAULT_INJECTION_TYPES.PREPARE_CHECK_STRING || faultType === FAULT_INJECTION_TYPES.ACCEPT_CHECK_STRING) {
            const options = Object.values(OPERATORS).map(operatorName => 
                <li key={operatorName}>
                    <div htmlFor={operatorName} className="flex items-center cursor-pointer" onClick={(e) => onMenuClick(e, operatorName, faultType)}>
                        <input checked={operatorName === dropdownValue[faultType]} id={operatorName} type="radio" value={operatorName} name={faultType} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{operatorName}</label>
                    </div>
                </li>
            )
            faultLabel = <div className="flex gap-2 items-center">
                Proposal Number(n) 
                <button className="relative bg-white rounded text-slate-900" onMouseEnter={() => onDropDownBtnClick(faultType)} onMouseLeave={() => onDropDownBtnClick(faultType)}>
                    <div className="flex items-center p-0.5">{dropdownValue[faultType]}      
                        <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </div>
                    <div id={`${faultType}_dropdownDefaultRadio`} className={`absolute z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow ${dropDownVisibility[faultType]}`}>
                        <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby={`${faultType}_dropdownDefaultRadio`}>
                        {options}
                        </ul>
                    </div>
                </button>
                minProposal
            </div>
        }
        else if (faultType === FAULT_INJECTION_TYPES.ASSIGN_ACCEPT_PROPOSAL) {
            faultLabel =  <div className="flex p-0.5">Do not execute: Accepted Proposal in Accept Phase = Proposal Number(n)</div>
        } else if (faultType === FAULT_INJECTION_TYPES.ASSIGN_MINPROPOSAL) {
            faultLabel =  <div className="flex p-0.5">Do not execute: Accepted Proposal in Prepare Phase = Proposal Number(n)</div>
        } else if (faultType === FAULT_INJECTION_TYPES.MAJORITY) {
            faultLabel = <div className="flex">Change Majority Number: <input placeholder='Majority Number' type="number" min="1" max="5" ref={majorityNumber} className="ml-2 text-black w-32 p-0.5" defaultValue={3}></input></div>
        }

        return (
            <div className="flex items-center ps-4 border border-gray-200 rounded bg-sky-800" key={faultType} onClick={() => setFaultValue(faultType)}>
                <input id={faultType} type="radio" value={faultType} name="fault-injection-radio" checked={faultValue===faultType} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700" />
                <label htmlFor={faultType} className="w-full py-4 ms-2 text-sm font-medium text-stone-200 px-2">
                    {faultLabel}
                </label>
            </div>
        )
    }) 

    const onSwitchFaultInjection = (event) => {
        let faultStr = ''
        if(faultValue === FAULT_INJECTION_TYPES.PREPARE_CHECK_STRING) {
            faultStr = 'message.proposal_number ' + dropdownValue[faultValue] + ' node.promised_proposal'
        } else if (faultValue === FAULT_INJECTION_TYPES.ACCEPT_CHECK_STRING) {
            faultStr = 'message.proposal_number ' + dropdownValue[faultValue] + ' node.promised_proposal'
        } else if (faultValue === FAULT_INJECTION_TYPES.MAJORITY) {
            faultStr = majorityNumber.current ? majorityNumber.current.value : 3
        }
        onInjectFaults(faultValue, faultStr, event.target.checked)
    }

    return(
        <div className="flex flex-row justify-center items-center gap-8 mb-8">
            <img src={PaxosAlgoImage} alt="algo-reference" className="w-5/12" />
            <div className="flex flex-col gap-4">
                <div className="text-stone-200 font-semibold">Select one of the faults below, to see how the algorithm gets affected: </div>
                <div className="flex flex-col gap-2">
                    {renderFaultInjectionOptions()}
                </div>
                <div className='flex flex-row gap-2 justify-center h-fit items-center'>
                    <div className='text-center text-stone-200 font-semibold'>Fault Injection Mode: </div>
                    <label className="switch">
                        <input type="checkbox" onClick={onSwitchFaultInjection}/>
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default FaultInjection