import 'aframe';
import 'aframe-particle-system-component';
import { Entity, Scene } from 'aframe-react';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const Room = (props) => {

    if (props.type == "photo") {
        return (
            // <a-sky src={props.urlImg} title={props.title} alt={props.title} rotation={props.rotation}></a-sky> 
            <a-sky src={props.id} title={props.title} alt={props.title} rotation={props.rotation}></a-sky> 
        );
    } else {
        return (""
       
        );
    }
};

// Room.propTypes = {
//     classes: Room.PropTypes.string,
//     urlImg: Room.PropTypes.string,
//     title: Room.PropTypes.string,
//     rotation: Room.PropTypes.string,
// };

Room.defaultProps = {
    id: '#test',
    color: 'blue',
    classes: "Room",
    type: "photo",
    urlImg: "https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg",
    title: "RoomName",
    rotation: "0 -130 0",
};

export default (Room);