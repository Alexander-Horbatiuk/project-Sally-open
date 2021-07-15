import deepCopy from 'deepcopy';

export function getWithPath(obj, path) {
    return path.reduce((acc, item) => acc[item], obj);
}

export function setWithPath(obj, path, newValue, array=false, index=0) {    
    let copiedObj = deepCopy(obj);
    var schema = copiedObj;  // a moving reference to internal objects within obj
    var len = path.length;
    for(var i = 0; i < len-1; i++) {
        var elem = path[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }
    if(array) {
        schema[index] = (newValue);
    } else {
        schema[path[len-1]] = newValue;
    }
    return copiedObj;
}

export function deleteWithPath(obj, path, array=false, index=0) {
    let copiedObj = deepCopy(obj);
    var schema = copiedObj;  // a moving reference to internal objects within obj
    var len = path.length;
    for(var i = 0; i < len-1; i++) {
        var elem = path[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }
    if(array) {
        schema.splice(index, 1);
    } else {
        delete schema[path[len-1]];
    }
    return copiedObj;
}