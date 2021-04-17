import React, { Component, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useThree, useFrame, useLoader } from "react-three-fiber";
import { softShadows, MeshWobbleMaterial } from "drei";
import { useSpring, useTransition, animated, config, a } from 'react-spring/three'
// import { useDrag } from 'react-use-gesture'
// import '../index.css'
// import * as THREE from 'three'
import {MeshBasicMaterial, TextureLoader} from 'three'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {setNewRoom} from '../../redux/actions/contentActions.js'
// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import Background from './components/background';
import Interaction from './components/interaction'
const environment = require('../../config.json');

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
class Room extends Component {
    componentDidMount(){
        // console.log(house.rooms[this.state.room].background)
    }
    render(){
        // const {currentRoom} = state;
        const { content : {currentRoom}} = this.props
        // console.log(this.props)
        return(
            <Canvas
                camera={{ position: [-9, 0, 0], fov: 60 }}
            >
                <Suspense fallback={null}>
                    <Background room={currentRoom} />
                </Suspense>
                <Suspense fallback={null}>
                  {environment.rooms[currentRoom].interactions.map((interaction, i) => (
                    <Interaction key={i} interaction={interaction}/>
                  ))}
                  {/* <Interaction /> */}
                </Suspense>
            </Canvas>
        )
    }
}


Room.propTypes = {
  content: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  content: state.content,
});

export default connect(mapStateToProps, {setNewRoom})(Room);