import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { BarCodeScanner, Permissions } from 'expo';
import {screenWidth, screenHeight} from '../../styles/commonStyles'
import * as commonColors from '../../styles/commonColors'

import { LinearGradient } from "expo";
import {Ionicons} from '@expo/vector-icons';


const MARK_SIZE = 240
const MARK_BORDER = 3


export default class App extends Component {
  state = {
    scanBarTop: new Animated.Value(0),
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    this.props.getQRCode(result)
    Actions.pop()
  };
  
  componentDidMount() {
    this._requestCameraPermission();
    this.mounted = true
    let toValue = MARK_SIZE
    let myInterval = setInterval(() => {
        if (this.mounted) {
            Animated.timing(                  // Animate over time
                this.state.scanBarTop,            // The animated value to drive
                {
                    toValue: toValue,                   // Animate to opacity: 1 (opaque)
                    duration: 1000,              // Make it take a while
                }
            ).start();
            if ( toValue == MARK_SIZE ) toValue = 0
            else if ( toValue == 0 ) toValue = MARK_SIZE
        }
    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
            <LinearGradient
                colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                start={[0.0, 0.0]}
                end={[1.0, 0.0]}
                style={{ height: 80, width: '100%' }}
              >
                <View style={{flexDirection:'row', marginTop:20, marginHorizontal:15, alignItems:'center',flex:1}}>
                  <Ionicons name="md-arrow-back" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15, flex:1, textAlign:'center'}}>Scan QRCode</Text>
                  <Ionicons name="md-close" size={24} color={'white'} />
                </View>
            </LinearGradient>
        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Camera permission is not granted
                </Text>
              : <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{
                    height: Dimensions.get('window').height-80,
                    width: Dimensions.get('window').width,
                  }}
                />}
        <View style={{position:'absolute', top:80, left:0, width:screenWidth, height:screenHeight-80, justifyContent:'center', alignItems:'center'}}>
            <View style={{ height: MARK_SIZE, width: MARK_SIZE }}>
                <View style={{ position: 'absolute', left: -MARK_BORDER, top: -MARK_BORDER, height: 40, width: 40, borderTopColor: commonColors.theme, borderTopWidth: MARK_BORDER, borderLeftColor: commonColors.theme, borderLeftWidth: MARK_BORDER }} />
                <View style={{ position: 'absolute', right: -MARK_BORDER, bottom: -MARK_BORDER, height: 40, width: 40, borderBottomColor: commonColors.theme, borderBottomWidth: MARK_BORDER, borderRightColor: commonColors.theme, borderRightWidth: MARK_BORDER }} />
                <View style={{ position: 'absolute', right: -MARK_BORDER, top: -MARK_BORDER, height: 40, width: 40, borderTopColor: commonColors.theme, borderTopWidth: MARK_BORDER, borderRightColor: commonColors.theme, borderRightWidth: MARK_BORDER }} />
                <View style={{ position: 'absolute', left: -MARK_BORDER, bottom: -MARK_BORDER, height: 40, width: 40, borderBottomColor: commonColors.theme, borderBottomWidth: MARK_BORDER, borderLeftColor: commonColors.theme, borderLeftWidth: MARK_BORDER }} />
                <Animated.View style={{ height: 2, width: '100%', backgroundColor: 'red', top: this.state.scanBarTop, position: 'absolute' }} />
            </View>
        </View>
        <StatusBar hidden />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
});