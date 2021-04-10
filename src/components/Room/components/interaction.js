import React, {useState} from "react";

import {TextureLoader, BackSide} from 'three'
import { Canvas, useFrame,  useLoader } from "react-three-fiber";


function Interaction() {
    const [hovered, setHover] = useState(false);
    // const props = useSpring({
    //   scale: hover ? [1.4, 1.4, 1.4] : [1, 1, 1],
    // });
    // const texture1 = useLoader(TextureLoader, 'https://i.ibb.co/MBtLk6z/ARROW.png');
    const texture = useLoader(TextureLoader, 'https://i.ibb.co/0BSKCkq/Riddle-1-book-front-cover.png')

    console.log("texture1", texture)
    return (
        <mesh 
          position={[0, -200, -200]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          // scale={props.scale}
          onPointerOver={(event) => setHover(true)}
          onPointerOut={(event) => setHover(false)}
        >
            <planeGeometry attach="geometry" args={[30, 40]} />
            <meshBasicMaterial attach="material" map={texture} color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
  }

export default Interaction;