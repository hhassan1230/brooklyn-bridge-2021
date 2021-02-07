import 'aframe';
import 'aframe-particle-system-component';
import { Entity, Scene } from 'aframe-react';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const Room = (props) => {

    if (props.type == "photo") {
        return (
            // <a-sky src={props.urlImg} title={props.title} alt={props.title} rotation={props.rotation}></a-sky> 
            <a-sky src="#test" title={props.title} alt={props.title} rotation={props.rotation}></a-sky> 
        );
    } else {
        return (
            <Entity>

  
            <Entity material="shader: flat; src: #videoBunny"
                    geometry="primitive: plane; width: 160; height: 90"
                    position="0 -60 -200"
                    rotation="0 -35 0"
                    play-on-click
                    visible="false">
            </Entity>
        </Entity>
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
    color: 'blue',
    classes: "Room",
    type: "photo",
    urlImg: "https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg",
    title: "RoomName",
    rotation: "0 -130 0",
};

export default (Room);