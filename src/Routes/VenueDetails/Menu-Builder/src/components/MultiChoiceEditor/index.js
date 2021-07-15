import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { copyOptions } from '../Atoms/atoms';
import './style.css'

export default function MultiChoiceEditor({
    initialObj,
    isRadio,
    callback,
    delSelfCallback
}) {
    let [unsavedChanges, setUnsavedChanges] = useState(false);
    let [editedObject, setEditedObject] = useState(initialObj);
    let [copiedOption, setCopyOption] = useRecoilState(copyOptions);

    useEffect(() => {
        console.log("HERE", initialObj)
        setEditedObject(initialObj);
    }, [initialObj])

    function editTitle(ev) {
        ev.stopPropagation();
        setEditedObject({...editedObject, title: ev.target.value});
        setUnsavedChanges(true)
    }
    function addRow(ev) {
        ev.stopPropagation();
        let {itemIDArray, price, options, preselArray} = editedObject;
        setEditedObject({
            ...editedObject,
            itemIDArray: [...itemIDArray, ""],
            price: [...price, ""],
            options: [...options, ""],
            preselArray: [...preselArray, false]
        });
        setUnsavedChanges(true)
    }
    function editOption(ev, index, key){
        ev.stopPropagation();
        setEditedObject({
            ...editedObject,
            [key]: [...editedObject[key]].map((item, i) => (i===index) ? ev.target.value : item) 
        })
        setUnsavedChanges(true)
    }
    function setValue(value, key) {
        setEditedObject({
            ...editedObject,
            [key]: value
        })
    }
    function delRow(ev, index) {
        ev.stopPropagation();
        let {itemIDArray, price, options, preselArray} = editedObject;
        setEditedObject({
            ...editedObject,
            itemIDArray: [...itemIDArray].filter((_, i) => i!==index),
            price: [...price].filter((_, i) => i!==index),
            options: [...options].filter((_, i) => i!==index),
            preselArray: [...preselArray].filter((_, i) => i!==index)
        });
        setUnsavedChanges(true)
    }
    function copy(ev) {
        ev.stopPropagation();
        setCopyOption(editedObject);
    }
    function paste(ev) {
        ev.stopPropagation();
        if(!copiedOption) return;
        let {itemIDArray: itemIDArray1, price:price1, options:options1, preselArray:preselArray1} = editedObject;
        let {itemIDArray:itemIDArray2, price:price2, options:options2, preselArray:preselArray2} = copiedOption;
        setEditedObject({
            ...editedObject,
            itemIDArray: [...itemIDArray1, ...itemIDArray2],
            price: [...price1, ...price2],
            options: [...options1, ...options2],
            preselArray: [...preselArray1, ...preselArray2]
        })
        setUnsavedChanges(true)
    }
    return (
        <div className={`multiChoiceEditor ${unsavedChanges? 'warning-border':''}`} >
            <div className="flex-column flex-center">
                <div className="flex-row flex-sbetween">
                    <div style={{color: 'green'}}>{isRadio ? "Radio" : "Multichoice"}</div>
                    <label> <span>Title:</span> <input className="title-input" type="text" placeholder="Type Title Here" value={editedObject.title} onChange={editTitle}/></label>
                    <div>    
                        <button className="delete-x" onClick={(ev) => { ev.stopPropagation(); delSelfCallback() }}>
                            <svg width="17px" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="grid grid-header">
                    <div className="justify-center">
                        <button className="normal-button" onClick={copy}>Copy All</button>
                        <button className="normal-button" onClick={paste}>Paste</button>
                    </div>
                </div>
                <div className="grid-body">
                    {editedObject?.options.map((option, i) => (
                        <div className="content_box">
                            
                            <div className="option_box">
                            <label>
                                <span>Preselect</span>
                                <input type="checkbox" value={editedObject.preselArray[i]} 
                                    onChange={(ev) => editOption(ev, i, "preselArray")}
                                    
                                />
                            </label>
                            <label>
                                <span>Name</span>
                                <input type="text" placeholder="Option" value={option}
                                    onChange={(ev) => editOption(ev, i, "options")}
                                />
                            </label>
                            <label>
                                <span>ID</span>
                                <input type="text" placeholder="ID" value={editedObject.itemIDArray[i]}
                                    onChange={(ev) => editOption(ev, i, "itemIDArray")}
                                />
                            </label>
                            <label>
                                <span>Price</span>
                                <input type="text" placeholder="price" value={editedObject.price[i]}
                                    onChange={(ev) => editOption(ev, i, "price")}
                                />
                            </label>
                            <button className="delete-x delete_field" onClick={(ev) => delRow(ev, i)}>
                                <svg width="17px" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                </svg>
                            </button>
                        </div>
                        </div>
                        
                        
                    ))}
                </div>
                <div className="grid-footer">
                    <button className="button_footer" onClick={addRow}>+ Add option</button>
                    {isRadio && (
                        <label>Required: 
                            <input type="checkbox"
                                checked={editedObject.required}
                                onChange={(ev) => {
                                    ev.stopPropagation(); 
                                    setUnsavedChanges(true);
                                    setValue(!editedObject.required, 'required')
                                }}
                            />
                        </label>
                    )}
                    <div className="button_footer_box">
                        {unsavedChanges && <span className="warning">Unsaved Changes!</span>}
                        <button className="button_footer" onClick={() => {callback(editedObject); setUnsavedChanges(false)}}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
