import {mapStateOnServer} from "./HelmetUtils";
import peekHelmetState from "./peekHelmetState";

export default function renderStatic(store) {
    const state = peekHelmetState(store.getState());
    return mapStateOnServer(state);
}
