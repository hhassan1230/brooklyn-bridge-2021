import 'aframe';
import 'aframe-particle-system-component';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import Room from './components/Room.js';
//PreloadAssets
import PreloadAssets from './components/PreloadAssets.js';

import './App.css';

function App() {
  return (
    <div className="App">
      <Scene>
        <PreloadAssets />
        <Entity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 0, y: 0, z: -5}}/>
        <Entity light={{type: 'point'}}/>
        <Entity gltf-model={{src: 'virtualcity.gltf'}}/>
        {/* <a-sky src="https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg" rotation="0 -130 0"></a-sky> */}

        <Room />
        <Entity text={{value: 'Hello, WebVR!'}}/>
      </Scene>
    </div>
  );
}

export default App;
