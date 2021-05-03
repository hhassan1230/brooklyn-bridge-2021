import React, {useState, useEffect} from "react";

import {TextureLoader, BackSide} from 'three'
import { Canvas, useFrame,  useLoader } from "@react-three/fiber";
import "./style.css"
import {changeRoom} from "../../../redux/actions/contentActions"
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


function Interaction({interaction, action}) {
  // const [texture, setTexture] = useState(null);
    const [hovered, setHover] = useState(false);
    // console.log("texture1", interaction)

    const texture = useLoader(TextureLoader, interaction.display.source)
    const handleClick = e => {
      if(interaction.action.type === "nav"){
        // console.log("helloo", props)
        action(interaction.roomName)
        // changeRoom(interaction.roomName)
      } else {
        action()
      }
    }
    // if(interaction.)

    return (
        <mesh 
          position={interaction.position} 
          rotation={interaction.rotation} 
          // scale={scale}
          className="material" 
          onPointerOver={(event) => setHover(true)}
          onPointerOut={(event) => setHover(false)}
          onClick={handleClick}
        >
            <planeGeometry attach="geometry" args={interaction.size} />
            <meshBasicMaterial 
              className="material" 
              attach="material" 
              map={texture} 
              color={hovered ? 'hotpink' : 'orange'}
            />
        </mesh>
    )
  }

// Interaction.propTypes = {
//   // content: PropTypes.object.isRequired,
//   changeRoom: PropTypes.func.isRequired,
// }

// // const mapStateToProps = (state) => ({
// //   content: state.content,
// // });

// const mapActionsToProps = {
//   changeRoom
// }
  
// export default connect(mapActionsToProps)(Interaction);

export default Interaction;