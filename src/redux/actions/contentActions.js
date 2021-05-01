
import { 
    SET_CURRENT_ROOM,
    LOADING_ROOM
    } from '../types';
import axios from 'axios';

//get all secrets
export const changeRoom = (roomName) => (dispatch) => {
    console.log("change room herrr")
    dispatch( { type: LOADING_ROOM });
    dispatch({
        type: SET_CURRENT_ROOM,
        payload: roomName
    });
}

export const somethingElse = () => (dispatch) => {
    console.log("Something else to do")
    // dispatch( { type: LOADING_ROOM });
    // dispatch({
    //     type: SET_CURRENT_ROOM,
    //     payload: roomName
    // });
}
