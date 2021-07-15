import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { pathDeleteSelector, pathSetSelector } from '../Atoms/atoms';
import NavButtons from '../NavButtons'
import ConfirmModal from '../ConfirmModal/Index';
import EditItemModal from '../EditItemModal/index';
import './style.css';

export default function ItemRow({
    path,
    index,
    max
}) {
    let [confirmModal, setConfirmModal] = useState(false);
    let [editModal, setEditModal] = useState(false);
    let [item, setDeleteItem] = useRecoilState(pathDeleteSelector({path, index}));
    let [item2, setItemOrder] = useRecoilState(pathSetSelector({path: path.slice(0, -1)}));
    let { title, price, desc, itemID, outOfStock } = item;

    function deleteItemCallback(ev, confirm=false, itemname){
        ev.stopPropagation();
        setConfirmModal(false);
        if(!confirm) return;
        console.log(item);
        setDeleteItem({array: true, index});
        // setMenu(deleteWithPath(menu, path, true, index));
        console.log(`Delete ${itemname}`);
    }

    function deleteItem(ev) {
        ev.stopPropagation();
        setConfirmModal(true);
    }

    function editItemCallback(ev)  {
        ev.stopPropagation();
        setEditModal(false);
    }

    function editItem(ev) {
        ev.stopPropagation();
        setEditModal(true);
    }

    function itemRowUp(ev, index) {
        ev.stopPropagation();
        let newArray = [...item2.slice(0, index-1), item2[index], item2[index-1]];
        setItemOrder(newArray.concat(item2.slice(index+1)));                
    }

    function itemRowDown(ev, index) {
        ev.stopPropagation();
        let newArray = [...item2.slice(0, index), item2[index+1], item2[index]];
        setItemOrder(newArray.concat(item2.slice(index+2)));      
    }

    return (
        <div className="item-row va-center" onClick={editItem}>
            {editModal &&
                <EditItemModal 
                    path={path}
                    index={index}
                    callback={editItemCallback}
                />
            }
            {confirmModal && 
                <ConfirmModal 
                    title="Are you sure?"
                    info={`(Delete Item: ${title})`}
                    cancelButton="No"
                    confirmButton="Delete"
                    callback={(ev, confirm) => deleteItemCallback(ev, confirm, title)}
                />
            }
            <div className="flex-column hm-1 fg-1 w-auto">
                <div className="flex-row va-center">
                    <h3 className="vm-zero">{title}</h3>
                    <p className="vm-zero hm-1 flex-center">&euro;{Number(price).toFixed(2)}</p>
                    {outOfStock && (<p className="vm-zero hm-1 flex-center warning-text">Out Of Stock</p>)}
                </div>
                <p className="vm-zero">{desc}</p>
            </div>
            <NavButtons index={index} btnUp={itemRowUp} btnDown={itemRowDown} disabledUp={index===0} disabledDown={index===max-1}/>
            <div className="util-column">
                {/* <p className="vm-zero">ID: {itemID}</p> */}
                <button className="delete-button hm-auto" onClick={deleteItem}>
                    <svg
                        width="17px"
                        viewBox="0 0 16 16"
                        className="bi bi-trash"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    <p className="vm-zero">ID: {itemID}</p>
                </button>
            </div>
        </div>
    )
}