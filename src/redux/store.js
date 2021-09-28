import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { eventReducer } from "./reducers/eventReducer";
const initialState = { eventInfo: [] };

const reducer = combineReducers({ eventInfo: eventReducer })


const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk))
);
export default store;