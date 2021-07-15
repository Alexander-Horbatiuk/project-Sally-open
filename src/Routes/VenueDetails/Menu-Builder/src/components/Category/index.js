import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useRecoilState } from 'recoil';
import { pathDeleteSelector, pathSetSelector } from '../Atoms/atoms';
import ConfirmModal from '../ConfirmModal/Index';
import NavButtons from '../NavButtons';
import ItemRow from '../ItemRow';
import TimePicker from '../TimePicker'
import './style.css';
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Category({
    path,
    index,
    max
}) {
    let [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    let [category, setDeleteCategory] = useRecoilState(pathDeleteSelector({path, index}));
    let [categories, setCategoryNav] = useRecoilState(pathSetSelector({path: path.slice(0,-1)}))
    let setCategory = useSetRecoilState(pathSetSelector({path, index}));
    function deleteCategory(ev, confirm=false) {
        ev.stopPropagation();
        setConfirmDeleteModal(false);
        if(!confirm) return;
        setDeleteCategory({array: true, index});
    }
    function deleteModal(ev) {
        ev.stopPropagation();
        setConfirmDeleteModal(true);
    }
    function selectDay(ev, index) {
        ev.stopPropagation();
        setCategory({
            ...category, 
            days: category.days.map((item,i) => (i===index)?!item: item)
        });
    }

    function editKeyValue(ev, key){
        ev.stopPropagation();
        setCategory({
            ...category,
            [key]: ev.target.value
        });
    }
    function addCategory(ev) {
        ev.stopPropagation();
        setCategory({
            ...category,
            itemsarray: [...category.itemsarray, {
                title: "New Item",
                desc: "",
                itemID: "54117",
                price: "00.00",
                outOfStock: false,
                contains: [],
                maycontain: [],
                type: [],
                options: []
            }]
        })
    }
    function categoryUp(ev){
        ev.stopPropagation();
        let newArray = [...categories.slice(0, index-1), categories[index], categories[index-1]];
        setCategoryNav(newArray.concat(categories.slice(index+1))); 
    }
    function categoryDown(ev){
        ev.stopPropagation();
        let newArray = [...categories.slice(0, index), categories[index+1], categories[index]];
        setCategoryNav(newArray.concat(categories.slice(index+2))); 
    }
    function setTime(value, from=false){
        let time = category.times;
        if(from) time = `${value} - ${category.times.split(" - ")[1]}`
        else time = `${category.times.split(" - ")[0]} - ${value}`
        setCategory({
            ...category,
            times: time
        })
    }
    
    return (
        <div className="category">
            {confirmDeleteModal && 
                <ConfirmModal
                    title="Are you sure?"
                    info={`(Delete Category: ${category?.catTitle})`}
                    cancelButton="No"
                    confirmButton="Delete" 
                    callback={(ev, confirm) => deleteCategory(ev, confirm)}
                />
            }
            <div className="flex-row flex-sbetween va-center table-header">
                <input className="hidden-input title"
                    value={category?.catTitle} 
                    onChange={(ev) => editKeyValue(ev, 'catTitle')}
                />{/* <h2 className="hm-1">{category?.catTitle}</h2> */}
                <div className="flex-column hm-2">
                    <div className="flex-row flex-justify-center va-center">
                        From &nbsp;<TimePicker defaultTime={category.times.split(" - ")[0]} callback={value => setTime(value, true)}/> &nbsp; &#8211;
                        To &nbsp;<TimePicker defaultTime={category.times.split(" - ")[1]} callback={value => setTime(value, false)}/>
                    </div>
                    <div className="flex-row flex-row-box">
                        {category.days.map((item, i)=> {
                            let day = weekDays[i];
                            return (
                                <label key={i} className="checkbox-label checkbox-ios" htmlFor={day}>
                                    <input type="checkbox" id={day} name={day} value={day} checked={item} onChange={(ev) => selectDay(ev,i)}/>
                                    <span className="checkbox-ios-switch"> </span>
                                    <br />
                                    {day} 
                                </label>
                                
                            )
                        })}
                        
                    </div>
                </div>
            </div>
            {category?.itemsarray && category.itemsarray.map((item, i) => (
                <ItemRow 
                    path={[...path, 'itemsarray', i.toString()]}
                    key={i}
                    index={i}
                    max={category.itemsarray.length}
                    obj={item}
                />
            ))}
            <div className="flex-row flex-sbetween va-center table-footer">
                <button className="delete-button-text round-button" onClick={deleteModal}>Delete Category</button>
                <NavButtons 
                    btnUp={categoryUp}
                    btnDown={categoryDown}
                    disabledUp={index===0}
                    disabledDown={index===max-1}
                    row={true}
                />
                <button className="normal-button" onClick={addCategory}>+ Add Item</button>
        </div>

        </div>
    )
    
}