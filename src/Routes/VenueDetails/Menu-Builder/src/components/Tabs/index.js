import React, { useState } from 'react';
import Select from 'react-select';
import { useRecoilState } from 'recoil';
import { currrentSelectedSection, menuObj } from '../Atoms/atoms';
import './style.css';

export default function Tabs({
    children
}) {
    let [menu, setMenu] = useRecoilState(menuObj);
    let [selected, setSelected] = useRecoilState(currrentSelectedSection);
    if(!selected) setSelected(Object.keys(menu)[0]);
    let [selectedIndex, setSelectedIndex] = useState(0);
    function getLanguage() {
        let lang = window.location.href.split("=")[1];
        let result = {value: "en", label: "English"}
        if(lang === "ru") result = { value: 'ru', label: 'Russian' };
        if(lang === "gr") result = { value: 'gr', label: 'Greek' };
        return result;
    }
    function changeLang(ev) {
        window.location.href = window.location.origin + window.location.pathname +  "?lang=" + ev.value;
    }
    return (
        <div className="tab-container">
            <div className="flex-row flex-sbetween va-center bg-grey tab-box">
                <div className="tab">
                    {Object.keys(menu).map((item,i) => (
                        <button className="tablinks" key={item} onClick={() => {setSelectedIndex(i); setSelected(item)}}>{item}</button>
                    ))}
                    <button className="tablinks warning-text addSection" onClick={() => setMenu({...menu, 'Extra section': []})}>+ Add Section</button>
                </div>
                <Select
                    className="lang-select"
                    onChange={changeLang}
                    value={getLanguage()}
                    options={[
                        { value: 'en', label: 'English' },
                        { value: 'gr', label: 'Greek' },
                        { value: 'ru', label: 'Russian' }
                ]}
                />
            </div>
            {children[selectedIndex]}
        </div>
    )
}