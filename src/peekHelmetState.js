import {reducePropsToState} from "./HelmetUtils";

function peekHelmetState(storeState) {
    return reducePropsToState(storeState.values);
}

export default peekHelmetState;
