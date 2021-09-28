import * as TYPE from "../constants/eventConstants";

export const eventReducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case TYPE.EVENT_LIST_REQUEST:
            return { loading: true };
        case TYPE.EVENT_LIST_SUCCESS:
            return { loading: false, success: true, events: action.payload };
        case TYPE.EVENT_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

