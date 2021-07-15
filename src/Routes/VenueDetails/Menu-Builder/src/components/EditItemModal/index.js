import React from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';
import { copyModifiers, pathSetSelector } from '../Atoms/atoms';
import MultiChoiceEditor from '../MultiChoiceEditor';
import Select from 'react-select';
import './style.css';
import agent from '../../agent';
import test from './test.jpeg';

export default function EditItemModal({
    path,
    index,
    callback
}) {
    const { id } = useParams();
    let [item, setItem] = useRecoilState(pathSetSelector({path, index}));
    let [copiedModifiers, setCopyModifiers] = useRecoilState(copyModifiers);

    function setOption(index, newValue) {
        let newObject = {
            ...item,
            options: [...item.options].map((elem, i) => (i===index)?newValue: elem)
        };
        console.log("newObj: ", newObject);
        setItem(newObject);
    }
    function editByKey(value, key) {
        setItem({
            ...item,
            [key]: value
        })
    }
    function editArrayByKey(result, key){
        setItem({
            ...item,
            [key]: (result) ? result.map(item => item.value):[]
        })
    }
    function addMultiChoice(ev, radio=false){
        ev.stopPropagation();
        setItem({
            ...item,
            options: [...item.options, {
                itemIDArray: [""],
                options: [""],
                preselArray: [false],
                price: [""],
                required: false,
                title: "",
                type: (radio)? "radio":"check"
            }]
        })
    }
    function delMultiChoice(index) {
        console.log(item.options);
        console.log(index);
        setItem({
            ...item,
            options: [...item.options].filter((_, i) => i!==index)
        })
    }
    async function saveImage(ev) {
        ev.stopPropagation();
        let url = await agent.saveImage(id, ev.target.files[0]);
        setItem({
            ...item,
            imageURL: url
        })
    }
    function copy(ev){
        ev.stopPropagation();
        setCopyModifiers(item.options);
    }
    function paste(ev){
        ev.stopPropagation();
        setItem({
            ...item,
            options: [...item.options, ...copiedModifiers]
        })
    }
    return ReactDOM.createPortal(
        <div className="editModal">
            
            <div className="modal-content">
                <button className="close-button" onClick={callback}>
                    <span>+</span>
                </button>
                <div className="modal_title_box">
                    <div className="va-center modal-title">
                        <div className="sub_box_modal_title">
                            <label className="label_dish_name">
                                <span>Dish name</span>
                                <input  
                                    className="title-input" 
                                    defaultValue={item.title}
                                    placeholder="Title"
                                    onBlur={(ev) => {ev.stopPropagation(); editByKey(ev.target.value, 'title')}}
                                />
                            </label>
                            <label className="label_dish_price">
                                <span>Dish price &euro;</span>
                                <input
                                    className="title-input-price" 
                                    defaultValue={item.price}
                                    placeholder="price..."
                                    onBlur={(ev) => {ev.stopPropagation(); editByKey(ev.target.value, 'price')}}
                                />
                            </label>
                        </div>
                        <div className="ingredients_box" >
                            <label className="label_dish_ingredients">
                                <span>Ingredients</span>
                                <input
                                    className="ingredients" 
                                    defaultValue={item.desc}
                                    placeholder="Description..."
                                    onBlur={(ev) => {ev.stopPropagation(); editByKey(ev.target.value, 'desc')}}
                                    />
                            </label>
                        </div>
                    </div>
                    <div className="modal_img_box">
                        <div className="sub_modal_img_box">
                            <span>picture of a dish</span>
                            <label htmlFor="imageUpload" className="main-image-label">
                                
                                <img className="main-image" src={item?.imageURL ? item.imageURL : test} alt="" />
                                <input type="file" id="imageUpload" onChange={saveImage} name="imageUpload" accept="image/*"/>
                            </label>
                        </div>
                        
                        {/* <input type="file" id="imageUpload" onChange={saveImage} name="imageUpload" accept="image/*"/> */}
                        <div className="sub_modal_img_box">
                            <span>id</span>
                            <div className="flex-row flex-sbetween va-center box-simple">
                                <label>
                                    <span>Item ID:</span>
                                <input className="betterInput" type="text" placeholder="ID" 
                                    value={item.itemID}
                                    onChange={(ev) => {ev.stopPropagation(); editByKey(ev.target.value, 'itemID')}}
                                />
                            </label>
                                <label>
                                <span>Out Of Stock:</span>
                                
                                <input type="checkbox"
                                    checked={item.outOfStock}
                                    onChange={(ev) => {ev.stopPropagation(); editByKey(!item.outOfStock, 'outOfStock')}}
                                />
                            </label>
                        </div>
                        </div>
                        
                    </div>
                </div>

                <div className="section1">
                    <div className="flex-column text-left sub_section1">
                        <div className="section_box">
                            <div className="section">
                                <h3>Contains</h3>
                                <Select 
                                    onChange={(ev) => editArrayByKey(ev, "contains")}
                                    value={item.contains.map(item => ({value: item, label: item}))}
                                    isMulti={true}
                                    options={[
                                        { value: 'celery', label: 'Celery' },
                                        { value: 'crustaceans', label: 'Crustaceans' },
                                        { value: 'eggs', label: 'Eggs' },
                                        { value: 'fish', label: 'Fish' },
                                        { value: 'gluten', label: 'Gluten' },
                                        { value: 'milk', label: 'Milk' },
                                        { value: 'lupin', label: 'Lupin' },
                                        { value: 'mustard', label: 'Mustard' },
                                        { value: 'molluscs', label: 'Molluscs' },
                                        { value: 'nuts', label: 'Nuts' },
                                        { value: 'peanuts', label: 'Peanuts' },
                                        { value: 'sesame', label: 'Sesame' },
                                        { value: 'so2', label: 'SO2' },
                                        { value: 'soya', label: 'Soya' }
                                    ]}
                                />
                            </div>
                            <div className="section">
                                <h3>May Contain</h3>
                                <Select 
                                    onChange={(ev) => editArrayByKey(ev, "maycontain")}
                                    value={item.maycontain.map(item => ({value: item, label: item}))}
                                    isMulti={true}
                                    options={[
                                        { value: 'celery', label: 'Celery' },
                                        { value: 'crustaceans', label: 'Crustaceans' },
                                        { value: 'eggs', label: 'Eggs' },
                                        { value: 'fish', label: 'Fish' },
                                        { value: 'gluten', label: 'Gluten' },
                                        { value: 'milk', label: 'Milk' },
                                        { value: 'lupin', label: 'Lupin' },
                                        { value: 'mustard', label: 'Mustard' },
                                        { value: 'molluscs', label: 'Molluscs' },
                                        { value: 'nuts', label: 'Nuts' },
                                        { value: 'peanuts', label: 'Peanuts' },
                                        { value: 'sesame', label: 'Sesame' },
                                        { value: 'so2', label: 'SO2' },
                                        { value: 'soya', label: 'Soya' }
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="section_box">
                            <div className="section">
                                <h3>Diet Preferences</h3>
                                <Select 
                                    onChange={(ev) => editByKey((ev.value) ? [ev.value] : [], "type")}
                                    value={{value: item.type, label: item.type}}
                                    options={[
                                        { value: 'none', label: 'None'},
                                        { value: 'vegan', label: 'Vegan' },
                                        { value: 'vegeterian', label: 'Vegeterian' },
                                    ]}
                                />
                            </div>
                            <div className="section">
                                <h3>Show Priority?</h3>
                                <Select 
                                    onChange={(ev) => editByKey(ev.value, "showPriority")}
                                    value={{value: item.showPriority, label: item.showPriority ? "Yes" : "No"}}
                                    options={[
                                        { value: true, label: 'Yes'},
                                        { value: false, label: 'No' },
                                    ]}
                                />
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="section2">
                    <div className="s2-header">
                        <button onClick={(ev) => addMultiChoice(ev)}>+ Multiple Choice</button>
                        <button onClick={(ev) => addMultiChoice(ev, true)}>+ Radio Option</button>
                        <button onClick={copy}>Copy ALL</button>
                        <button onClick={paste}>Paste ALL</button>
                    </div>
                    <br/>
                    <div className="options">
                        {item.options && item.options.map((option, i) => (
                            <MultiChoiceEditor key={i} delSelfCallback={() => delMultiChoice(i)} isRadio={option.type!=="check"} initialObj={option} callback={(newValue) => setOption(i, newValue)}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('root')
    )
}
