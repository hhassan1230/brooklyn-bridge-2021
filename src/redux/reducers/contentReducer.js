
import { 
    SET_CURRENT_ROOM
 } from '../types';

const initialState = {
    currentRoom: 'Entry'
}


export default function(state = initialState, action){
    // let index; 
    // console.log("SECRET Actionsn -->",action);
    switch(action.type){
        case SET_CURRENT_ROOM:
            // console.log("NAMEE", action.payload)
            return {
                currentRoom: action.payload
            } 
        default:
            return state;
    }
}