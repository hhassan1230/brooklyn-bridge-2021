import React from "react";

import {TextureLoader, BackSide} from 'three'
import { Canvas, useFrame,  useLoader } from "react-three-fiber";
import { OrbitControls } from 'drei'
const environment = require('../../../config.json');


function Background({room}) {
    // console.log(props)
    const texture = useLoader(TextureLoader, environment.rooms[room].background.source)
    return (
        <mesh>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial attach="material" map={texture} side={BackSide} />
            <OrbitControls />
        </mesh>
    )
}

export default Background;