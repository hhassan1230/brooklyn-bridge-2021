import React, { useState, useEffect } from "react";

import {TextureLoader, BackSide } from 'three'
import { Canvas, useFrame,  useLoader } from '@react-three/fiber';
// import { useAspect } from "@react-three/drei";

// import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import { useAspect } from '@react-three/drei'

// import { OrbitControls } from '@react-three/drei'
// const environment = require('../../../config.json');

function Video(props) {
    console.log("HEREE")
    // const size = useAspect(1800, 1000);
    const [video] = useState(() => {
      const vid = document.createElement("video");
      vid.src = "./assets/pokemon-center-animated_Mini.mp4";
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      vid.muted = true;
      vid.play();
      return vid;
    });
    // Keep in mind videos can only play once the user has interacted with the site ...
    // useEffect(() => void video.play(), [video]);
    return (
        <group rotation={[Math.PI / 8, Math.PI * 1.2, 0]}>
            <mesh>
                <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
                <meshBasicMaterial>
                    <videoTexture attach="map" args={[video]} />
                </meshBasicMaterial>
            </mesh>
        </group>
    );
  }

  function PanoImage(props) {
    console.log("img")
    const texture = useLoader(TextureLoader, props.src)
    return (
        <mesh>
            <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial attach="material" map={texture} side={BackSide} />
        </mesh>

    )
}


function Background({background}) {
    // console.log(props)
    const texture = useLoader(TextureLoader, background.source)
    return (
        <>
            {background.type.toLowerCase() === "picture" ? (
                <PanoImage src={background.source}/>
            ) : (
                <Video src={background.source} />
            )}
        </>
    )
}

export default Background;