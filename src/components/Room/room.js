import React, { Component, useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import { Canvas, useThree, useFrame, useLoader } from "react-three-fiber";
// import { softShadows, MeshWobbleMaterial } from "drei";
// import { useSpring, useTransition, animated, config, a } from 'react-spring/three'
// import { useDrag } from 'react-use-gesture'
// import '../index.css'
// import * as THREE from 'three'
// import {MeshBasicMaterial, TextureLoader} from 'three'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {changeRoom} from '../../redux/actions/contentActions.js'
import {somethingElse} from '../../redux/actions/contentActions.js'
// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import Background from './components/background';
import Interaction from './components/interaction'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const environment = require('../../config.json');

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 3;
      controls.maxDistance = 20;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};


class Room extends Component {
    componentDidMount(){
        // console.log(house.rooms[this.state.room].background)
    }
    render(){
        // const {currentRoom} = state;
        const { content : {currentRoom}} = this.props
        console.log(this.props)
        return(
            <Canvas
                camera={{ position: [-9, 0, 0], fov: 60 }}
            >
                <CameraController />
                <Suspense fallback={null}>
                    <Background background={environment.rooms[currentRoom].background} />
                </Suspense>
                <Suspense fallback={null}>
                  {environment.rooms[currentRoom].interactions.map((interaction, i) => (
                    <Interaction key={i} interaction={interaction} action={interaction.action.type === "nav" ? this.props.changeRoom : this.props.somethingElse}/>
                  ))}
                  {/* <Interaction /> */}
                </Suspense>
            </Canvas>
        )
    }
}


Room.propTypes = {
  content: PropTypes.object.isRequired,
  changeRoom: PropTypes.func.isRequired,
  somethingElse: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  content: state.content,
});

const mapActionsToProps = {
  changeRoom,
  somethingElse
}

export default connect(mapStateToProps, mapActionsToProps)(Room);