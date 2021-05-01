
import { 
    SET_CURRENT_ROOM,
    LOADING_ROOM
 } from '../types';

const initialState = {
    currentRoom: 'Entry',
    loading: false
}


export default function(state = initialState, action){
    // let index; 
    // console.log("SECRET Actionsn -->",action);
    switch(action.type){
        case SET_CURRENT_ROOM:
            // console.log("NAMEE", action.payload)
            return {
                currentRoom: action.payload,
                loading: false
            } 
        case LOADING_ROOM:
            return{
                ...state,
                loading: true
            }
        default:
            return state;
    }
}