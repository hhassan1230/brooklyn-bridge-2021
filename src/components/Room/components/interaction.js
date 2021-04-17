import React, {useState, useEffect} from "react";
import styled from "styled-components";

import {TextureLoader, BackSide} from 'three'
import { Canvas, useFrame,  useLoader } from "react-three-fiber";

function Interaction({interaction}) {
  // const [texture, setTexture] = useState(null);
    const [hovered, setHover] = useState(false);
    // console.log("texture1", interaction)

    const texture = useLoader(TextureLoader, interaction.display.source)

    return (
        <mesh 
          position={interaction.position} 
          rotation={interaction.rotation} 
          // scale={props.scale}
          onPointerOver={(event) => setHover(true)}
          onPointerOut={(event) => setHover(false)}
        >
            <planeGeometry attach="geometry" args={interaction.size} />
            <meshBasicMaterial className="material" attach="material" map={texture} color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
  }

export default Interaction;