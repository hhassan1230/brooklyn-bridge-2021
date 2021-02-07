import 'aframe';
import 'aframe-particle-system-component';
import { Entity, Scene } from 'aframe-react';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const PreloadAssets = (props) => 
	<>
	<a-assets>
          if (props.assets) { 
            return props.assets.map(item =>{
                return item;
            })
          }
          else {
           return "";
          }
      </a-assets>
      </>;

// Room.propTypes = {
//     classes: Room.PropTypes.string,
//     urlImg: Room.PropTypes.string,
//     title: Room.PropTypes.string,
//     rotation: Room.PropTypes.string,
// };

// const PreloadAssets = (props) => 
//     <>
//     <a-assets>
//     <img id="test" src="https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg" />
//     </a-a

PreloadAssets.defaultProps = {
    assets: [`<img id="test" src="https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg" />`],
    color: 'blue',
    classes: "Room",
    type: "photo",
    urlImg: "https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg",
    title: "RoomName",
    rotation: "0 -130 0",
};

export default (PreloadAssets);