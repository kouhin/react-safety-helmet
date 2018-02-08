export const ADD_HELMET_PROPS = "helmet/ADD";
export const REMOVE_HELMET_PROPS = "helmet/REMOVE";

export function addHelmetProps(target, content) {
    return {
        type: ADD_HELMET_PROPS,
        payload: {
            target,
            content
        }
    };
}

export function removeHelmetProps(target) {
    return {
        type: REMOVE_HELMET_PROPS,
        payload: {
            target
        }
    };
}

function getInitState() {
    return {
        keys: [],
        values: []
    };
}

export default function rootReducer(state = getInitState(), action) {
    switch (action.type) {
        case ADD_HELMET_PROPS: {
            const {target, content} = action.payload;
            const idx = state.keys.indexOf(target);
            if (idx === -1) {
                return {
                    keys: [...state.keys, target],
                    values: [...state.values, content]
                };
            }
            if (state.values[idx] !== content) {
                const newValues = [].concat(state.values);
                newValues[idx] = content;
                return {
                    keys: state.keys,
                    values: newValues
                };
            }
            return state;
        }
        case REMOVE_HELMET_PROPS: {
            const {keys, values} = state;
            const {target} = action.payload;
            const idx = keys.indexOf(target);
            if (idx === -1) {
                return state;
            }
            return {
                keys: keys.slice(0, idx).concat(keys.slice(idx + 1)),
                values: values.slice(0, idx).concat(values.slice(idx + 1))
            };
        }
        default:
            return state;
    }
}
