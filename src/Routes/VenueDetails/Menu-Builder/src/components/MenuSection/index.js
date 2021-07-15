import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';
import { currrentSelectedSection, menuObj } from '../Atoms/atoms';
import Category from '../Category';
import ConfirmModal from '../ConfirmModal/Index';
import agent from '../../agent';
import './style.css';

export default function MenuSection({
    path,
    title,
    categories
}) {
    let [confirmModal, setConfirmModal] = useState(false);
    let [confirmDelete, setConfirmDeleteModal] = useState(false);
    let [menu, setMenu] = useRecoilState(menuObj);
    const selectedSection = useRecoilValue(currrentSelectedSection);

    const { id } = useParams()

    function publishChanges() {
        console.log(menu);
        agent.publishMenu(id, menu);
    }
    function saveChanges(ev) {
        ev.stopPropagation();
        console.log(menu);
        agent.saveMenu(id, menu);
    }
    async function resetChanges(ev, confirm) {
        ev.stopPropagation();
        if (!confirm) {
            setConfirmModal(false);
            return;
        }
        try {
            let menu = await agent.getMenu(id);
            console.log(menu);
            if (Array.isArray(menu)) {
                menu = { "Food": menu.map((item, i) => item[i + 1]) };
            }
            setMenu(menu);
        } catch (err) {
            console.log(err);
        }
        setConfirmModal(false);
    }
    function addCategory(ev) {
        ev.stopPropagation();
        setMenu({
            ...menu,
            [path[0]]: [...menu[path[0]], {
                catTitle: 'New Category',
                days: [true, true, true, true, true, true, true],
                itemsarray: [],
                times: "00:00 - 00:00"
            }]
        })
    }
    function changeTitle(ev, prevTitle) {
        ev.stopPropagation();
        setMenu(Object.keys(menu).reduce((acc, key) => {
            (key === prevTitle) ? acc[ev.target.value] = menu[key] : acc[key] = menu[key]
            return acc;
        }, {}))
    }
    function deleteSection(ev, confirm = false) {
        ev.stopPropagation();
        setConfirmDeleteModal(false);
        if (!confirm) return;
        if (window.confirm(`You will delete section ${title}, are you certain?`)) {
            let newMenu = { ...menu }
            delete newMenu[selectedSection];
            setMenu(newMenu);
        } else {
            console.log("No")
        }
    }

    function deleteSectionConfirm(ev) {
        ev.stopPropagation();
        setConfirmDeleteModal(true);
    }
    return (
        <div className="menu-section">
            {confirmModal &&
                <ConfirmModal
                    title="Are you sure? (you will lose all progress)"
                    cancelButton="No"
                    confirmButton="Reset"
                    callback={(ev, confirm) => resetChanges(ev, confirm)}
                />
            }
            {confirmDelete &&
                <ConfirmModal
                    title={`Are you sure? (you will lose all items in section ${title})`}
                    cancelButton="No"
                    confirmButton="DELETE"
                    callback={(ev, confirm) => deleteSection(ev, confirm)}
                />
            }
            <div className="flex-row flex-sbetween va-center flex-row-menu">
                <input
                    className="hidden-input section-title"
                    defaultValue={title}
                    onBlur={(ev) => changeTitle(ev, title)}
                />
                <div className="box-btn">
                    <button className="normal-button button-green round-button" onClick={publishChanges}>Publish Changes</button>
                    <button className="normal-button round-button" onClick={saveChanges}>Save Changes</button>
                    <button className="normal-button button-red round-button" onClick={() => setConfirmModal(true)}>Discard Changes</button>
                </div>
            </div>
            {categories && categories.map((item, i) => {
                return (
                    <Category max={categories.length} path={[...path, i.toString()]} key={i} obj={categories[i]} index={i} />
                )
            })}

            <div className="flex-row flex-sbetween va-center btn-footer">
                <button className="button-red delete-button-text" onClick={deleteSectionConfirm}>DELETE SECTION ({title})</button>
                <button className="normal-button" onClick={addCategory}>+Add Category</button>
            </div>
        </div>
    )
}