import {createStore, applyMiddleware} from "redux";
import ExecutionEnvironment from "exenv";
import {
    handleClientStateChange,
    reducePropsToState,
    mapStateOnServer
} from "./HelmetUtils";

import rootReducer from "./modules";

function handleOnClientMiddleware({getState}) {
    return next => action => {
        const prevState = getState();
        const result = next(action);
        const nextState = getState();
        if (prevState !== nextState) {
            const state = reducePropsToState(nextState.values);
            handleClientStateChange(state);
        }
        return result;
    };
}

export default function createHelmetStore(...middlewares) {
    const extra = [
        ...middlewares,
        ...(ExecutionEnvironment.canUseDOM ? [handleOnClientMiddleware] : [])
    ];
    const store =
        extra.length > 0
            ? createStore(rootReducer, applyMiddleware(...extra))
            : createStore(rootReducer);
    const {getState} = store;
    return {
        ...store,
        peek: () => reducePropsToState(getState().values),
        rewind: () => mapStateOnServer(reducePropsToState(getState().values))
    };
}
