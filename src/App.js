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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: 0
    };
  }

  handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  // componentDidMount() {
  //   this.interval = setInterval(() => this.setState({ room: 1}), 3000);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

render(){
  return (
    <div className="App">

      <Scene>
        <PreloadAssets assets={[<img id="1" src="https://i.ibb.co/RhDdpLG/Ambush-Alley-BKG-20.jpg" />, <img id="0" src="https://raw.githubusercontent.com/hhassan1230/PhotoChill/gh-pages/SAM_100_2087.jpg"/>]}/>
        
        <Entity camera look-controls position="0 1.6 0"> 
          <a-entity cursor="fuse:true; fuseTimeout:500" position="0 0 -1" geometry="primitive: ring; radiusInner:0 0.02; radiusOuter:0.03" material="color:blue; shader:flat"> </a-entity>
        </Entity>

        <Entity light={{type: 'point'}}/>
        <Entity gltf-model={{src: 'virtualcity.gltf'}}/>

        <Room id={"#" + this.state.room.toString()}/>
        <Entity text={{value: 'Hello, WebVR!'}}/>
        <a-cylinder position="0 .75 -2.3" rotation="-90" radius=".3" height=".1" color="#ff65D" onClick={this.handleClick} link="href:https://hessvacio.com"> </a-cylinder>
      </Scene>
    </div>
  );
  }
}

export default App;
