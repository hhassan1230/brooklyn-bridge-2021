
import { 
    SET_SECRETS, 
    LOADING_DATA, 
    LIKE_SECRET, 
    UNLIKE_SECRET, 
    DELETE_SECRET, 
    SET_ERRORS, 
    CLEAR_ERRORS,
    POST_SECRET,
    LOADING_UI,
    SET_SECRET,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
    ON_IMAGE_UPDATED
    } from '../types';
import axios from 'axios';

//get all secrets
export const setNewRoom = (imageUpdated) => (dispatch) => {
    // console.log("BEIN CALLED");
    dispatch( { type: LOADING_DATA });
    axios.get('/secrets')
    .then((res) => {
        dispatch({
            type: SET_SECRETS,
            payload: res.data
        });
        //imageUpdated parameter is a  true or false 
        if(imageUpdated){ dispatch(updatedImg());}
    })
    .catch(err => {
        dispatch({
            type: SET_SECRETS,
            payload: []
        });
    });
}