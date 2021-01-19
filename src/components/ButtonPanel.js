import React from 'react';
import {
  asset,
  Image,
  NativeModules,
  View,
  StyleSheet,
  VrButton
} from 'react-360';
import { changeRoom, openModal, getCurrentRoom } from '../store';

const icon = {
    Nav: 'https://i.ibb.co/MBtLk6z/ARROW.png',
    Print: 'https://i.ibb.co/92RYRcW/BOW.png',
    Picture: 'https://i.ibb.co/tsS8L6f/EYEBALL.png',
  };
  
class Button extends React.Component {
    state = {
        hover: false,
        id: null,
    }
  
    clickHandler(roomSelection) {
        if (this.props.type === 'Nav') {
          changeRoom(roomSelection.room);
          NativeModules.CustomLinkingModule.updateInteractions(roomSelection.room)
          console.log("going to", roomSelection.room)
        } else if (this.props.type === 'Print' || this.props.type === 'Picture') {
            // console.log('-------------------------------- In clickHandler ' + JSON.stingify(this));
            // console.log("modal State onclickHandler: ", getCurrentModalState() )
            // console.log(roomSelection.room, this.props)
            openModal(roomSelection.room , roomSelection.id);
            NativeModules.CustomLinkingModule.recenterModalAndHideBtnSurface()
            NativeModules.CustomLinkingModule.hideFlaggedSurfaces(roomSelection.room)
            // console.log("modal State: ", getCurrentModalState())
        } else {
            // Sounds Maybe???
  
        }
  
    }
  
    render() {
      const buttonIcon = icon[this.props.type].includes('//') ? {uri: icon[this.props.type] } : asset(icon[this.props.type]);
      // console.log("PROPSSS", this.props)
      return(
        <View>
            <VrButton
              style={this.state.hover ? styles.arrowButtonContainerHover : styles.arrowButtonContainer}
              onEnter={() => this.setState({hover: true})}
              onExit={() => this.setState({hover: false})}
              onClick={() => this.clickHandler({ room: this.props.room, id: this.props.id })}>
                <Image source={buttonIcon} style={styles.arrowbutton} />
            </VrButton>
        </View>
      )
    }
  }
  

export default class ButtonPanel extends React.Component {

    render() {
      // console.log(" 000000000000000 Button ", this.props);
      
      return (
        <View>
          {(this.props.buttonInteraction.originalRoom === getCurrentRoom())  &&
            (<View style={styles.buttonPanel}>
              { <Button 
                type={this.props.buttonInteraction.type} 
                key={`${this.props.buttonInteraction.roomName}` + '-button'} 
                id={ this.props.buttonInteraction.id } 
                room={ this.props.buttonInteraction.roomName }
                /> 
              }
            </View>
            )}
        </View>
      );
    }
  };

  const styles = StyleSheet.create({
    arrowbutton: {
      width: 200,
      height: 200,
    },
    arrowButtonContainer: {
      width: 200,
    },
    arrowButtonContainerHover: {
      width: 250,
    },
    closeBtnHover:{
      width: 100,
      height: 100,
      backgroundColor: 'red'
    },
    buttonPanel: {
      width: 250,
      height: 250,
      opacity: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
  });
  