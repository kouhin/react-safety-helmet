import {reducePropsToState, mapStateOnServer} from "./HelmetUtils";

export default function renderStatic(store) {
    const props = store.getState().values;
    const state = reducePropsToState(props);
    return mapStateOnServer(state);
}
