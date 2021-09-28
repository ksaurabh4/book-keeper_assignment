import { api } from "../api";
import * as TYPE from "../constants/eventConstants";

export const fetchEvents = (type, searchText) => async (dispatch) => {
    dispatch({ type: TYPE.EVENT_LIST_REQUEST });
    try {
        const { data } = await api.get(`/event?${type}=${searchText}`);
        dispatch({ type: TYPE.EVENT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: TYPE.EVENT_LIST_FAIL, payload: error.message });
    }
};
