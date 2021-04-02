import React, { Component, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useThree, useFrame, useLoader } from "react-three-fiber";
import { softShadows, MeshWobbleMaterial, OrbitControls } from "drei";
import { useSpring, useTransition, animated, config, a } from 'react-spring/three'
// import { useDrag } from 'react-use-gesture'

// import * as THREE from 'three'
import {MeshBasicMaterial, TextureLoader} from 'three'

// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import Background from './background'
const house = require('../config.json')
const state = {
    currentRoom: 'Entry'
}

  function Image() {
    // const texture1 = useLoader(TextureLoader, 'https://i.ibb.co/MBtLk6z/ARROW.png');
    const texture = useLoader(TextureLoader, 'https://i.ibb.co/MBtLk6z/ARROW.png')

    console.log("texture1", texture)
    return (
        <mesh position={[10, 1, -5]}>
            <planeBufferGeometry attach="geometry" args={[3, 3]} />
            <meshBasicMaterial attach="material" map={texture} />
        </mesh>
    )
  }


  const SpinningMesh = ({ position, color, speed, args }) => {
    //ref to target the mesh
    const mesh = useRef();
  
    //useFrame allows us to re-render/update rotation on each frame
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  
    //Basic expand state
    const [expand, setExpand] = useState(false);
    // React spring expand animation
    const props = useSpring({
      scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
    });
    return (
      <a.mesh
        position={position}
        ref={mesh}
        onClick={() => setExpand(!expand)}
        scale={props.scale}
        castShadow>
        <boxBufferGeometry attach='geometry' args={args} />
        <MeshWobbleMaterial
          color={color}
          speed={speed}
          attach='material'
          factor={0.6}
        />
      </a.mesh>
  
      //Using Drei box if you want
      // <Box {...props} ref={mesh} castShadow>
      //   <MeshWobbleMaterial
      //     {...props}
      //     attach='material'
      //     factor={0.6}
      //     Speed={1}
      //   />
      // </Box>
    );
  };
export default class Room extends Component {
    componentDidMount(){
        // console.log(house.rooms[this.state.room].background)
    }
    render(){
        const {currentRoom} = state;
        // console.log(this.state)
        return(
            <Canvas
                camera={{ position: [-9, 0, 0], fov: 60 }}
            >
                <Suspense fallback={null}>
                    <Background background={house.rooms[currentRoom].background} />
                </Suspense>
                <Suspense fallback={null}>
                    <Image />
                </Suspense>
            <SpinningMesh
                position={[0, 1, 0]}
                color='lightblue'
                args={[3, 2, 1]}
                speed={2}
            />
                <OrbitControls />
            </Canvas>
        )
    }
}