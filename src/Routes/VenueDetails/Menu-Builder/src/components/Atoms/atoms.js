import { atom, selectorFamily } from "recoil";
import {deleteWithPath, setWithPath, getWithPath} from './utilFunctions';

export const menuObj = atom({
    key: 'menuObj',
    default: null
});

export const copyOptions = atom({
    key: 'copyOptions',
    default: null
})

export const copyModifiers = atom({
    key: 'copyModifiers',
    default: null
})

export const currrentSelectedSection = atom({
    key: 'selectedSection',
    default: null
})

export const pathSetSelector = selectorFamily({
    key: 'SetSelector',
    get: ({path, index=''}) => ({get}) => getWithPath(get(menuObj), path),
    set: ({path, index='', newValue}) => ({set, get}, newValue) => {
        return set(menuObj, setWithPath(get(menuObj), path, newValue, (index!==''), index));
    }
})

export const pathDeleteSelector = selectorFamily({
    key: `DeleteSelector`,
    get: ({path, index=''}) => ({get}) => getWithPath(get(menuObj), path),
    set: ({path, index=''}) => ({set, get}) => {
        return set(menuObj, deleteWithPath(get(menuObj), path, (index!==''), index));
    }
})