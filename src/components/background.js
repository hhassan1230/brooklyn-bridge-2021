import React from "react";

import {TextureLoader, BackSide} from 'three'
import { Canvas, useFrame,  useLoader } from "react-three-fiber";


function Background(props) {
    console.log(props)
    const texture = useLoader(TextureLoader, props.background.source)
    return (
        <mesh>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial attach="material" map={texture} side={BackSide} />
        </mesh>
    )
}

export default Background;