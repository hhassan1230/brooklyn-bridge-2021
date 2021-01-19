import React from 'react';
import {
  asset,
  Image,
  NativeModules,
  StyleSheet,
  Text,
  View,
  VrButton
} from 'react-360';
import { closeModal, getCurrentModalState } from '../store';

export default class InfoPanel extends React.Component {
    state = {
      active: getCurrentModalState(),
      id: null,
      hoverCloseBtn: false,
      hoverPrintBtn: false
    }
    
    closePanel(){
      this.setState({hoverCloseBtn: false});
      // console.log("modal State on closebtn: ", getCurrentModalState())
      NativeModules.CustomLinkingModule.closeModalAndShowBtnSurface()
      closeModal()
      // console.log("modal State on closebtn: ", getCurrentModalState())
    }

    openPrintable(url_or_path){
      this.setState({hoverPrintBtn: false});
      NativeModules.CustomLinkingModule.open(url_or_path.uri);
    }
  
    render() {
      console.log(" -------------------------------------------------- InfoPanel active ", this.state.active + " == " + "getCurrentModalState() " + getCurrentModalState());
      // let imgFetching = this.props.infoImage.includes('//') ? 'remote' : asset(this.props.infoImage);
      let url_or_path = '';
      if(this.props.infoImage.includes('//')){
        url_or_path = {uri: this.props.infoImage }
        remote = true;
      } else {
        url_or_path = asset(this.props.infoImage);
        remote = false
      }
      
      return(
        <View>
        {getCurrentModalState() &&
  
          <View style={styles.infoPanel}>
              <VrButton
                style={styles.closeBtnContainer}
                onEnter={() => this.setState({hoverCloseBtn: true})}
                onExit={() => this.setState({hoverCloseBtn: false})}
                onClick={() => this.closePanel() }>
                  <Image source={{uri: "https://i.ibb.co/p3HtGWy/Navi-Icon-24.png"}} 
                    style={this.state.hoverCloseBtn ?  styles.closeBtnHover : styles.closeBtn}
                  />
              </VrButton>
            { <Image source={url_or_path} style={{height: '70%', width: '100%'}} /> }
            <View>
              <Text style={styles.text}>{ this.props.info } </Text>
              {(remote && this.props.infoType === "Print") && (
              <VrButton
                onEnter={() => this.setState({hoverPrintBtn: true})}
                onExit={() => this.setState({hoverPrintBtn: false})}
                onClick={() => this.openPrintable(url_or_path)}
                style={styles.printBtnContainer}
                >
                <Image source={{uri: "https://i.ibb.co/vkKZ6hL/PrintV1.png"}} 
                  style={this.state.hoverPrintBtn ?  styles.printBtnHover : styles.printBtn}
                />
              </VrButton>
              )}
            </View>
          </View>
        }
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    infoPanel: {
        display: 'flex',
        width: 800,
        height: 950,
        opacity: 1,
        backgroundColor: '#CD853F',
        borderColor: '#D2B48C',
        borderWidth: 5,
        borderRadius: 20
    },
    closeBtnContainer: {
        marginLeft: 'auto',
        height: '10%',
        width: '10%',
        borderRightColor: 'black',
        right: 0,
    },
    closeBtn:{
        width: 100,
        height: 100,
        borderRadius: 100
    },
    closeBtnHover:{
      width: 100,
      height: 100,
      borderRadius: 100,
      backgroundColor: '#DEB887'
    },
    text: {
      fontSize: 25, 
      textAlign: 'center', 
      fontWeight: 'bold', 
      marginBottom: 10,
      width: '100%'
    },
    printBtnContainer: {
      // borderWidth: 2,
      // borderColor: "black",
      width: "25%",
      height: 80,
      marginLeft: '37.5',
      marginRight: '37.5'
    },
    printBtn: {
      marginTop: 10,
      borderWidth: 2,
      backgroundColor: 'black',
      borderColor: 'black',
      height: 65,
      width: '100%',
      borderRadius: 20,
    },
    printBtnHover: {
      marginTop: 10,
      borderWidth: 2,
      backgroundColor: 'black',
      borderColor: 'black',
      height: 65,
      width: '100%',
      borderRadius: 20,
      borderColor: "#DEB887"
    },
  })