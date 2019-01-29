import * as Immutable from 'immutable';

export function listToMap(list, keyField = 'id') {
    let result = new Immutable.Map();
    list.forEach(listItem => {
        result = result.set(listItem.get(keyField), listItem);
    });
    return result;
}
