import React from 'react';
import './style.css';

export default function Index({ defaultTime, callback }) {
    function returnTime(ev, hour=false){
        ev.stopPropagation();
        let time = defaultTime;
        if(hour) time = `${ev.target.value}:${defaultTime.split(":")[1]}`
        else time = `${defaultTime.split(":")[0]}:${ev.target.value}`
        callback(time);
    }
    return (
        <div className="timePicker">
            <select value={defaultTime.split(":")[0]} onChange={(ev) => {returnTime(ev, true)}}>
                {Array.from({length: 24}, (item,i)=>i).map((item,i) => {
                    let number = (item<10) ? `0${item}`: `${item}`;
                    return (
                        <option key={i} value={number}>{number}</option>
                    )
                })}
            </select>
            :
            <select value={defaultTime.split(":")[1]} onChange={(ev) => {returnTime(ev, false)}}>
                {Array.from({length: 60}, (item,i)=>i).map((item, i) => {
                    let number = (item<10) ? `0${item}`: `${item}`;
                    return (
                        <option key={i} value={number}>{number}</option>
                    )
                })}
            </select>
        </div>
    )
}
