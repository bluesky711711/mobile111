import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Clipboard
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';
import QRCode from 'react-native-qrcode';
import API from '../../service/Api'
import Cache from '../../utils/cache';
import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'


import { LinearGradient } from "expo";

export default class Received extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          address:'',
          coinType: props.coinType
        }
    }

    componentDidMount(){
      if (Cache.currentUser){
        setTimeout(()=>this.setState({address:Cache.currentUser.wallet_address}), 10);
      }
    }
    
    copyToClipboard(){
      Clipboard.setString(this.state.address);
      Alert.alert("Wallet address copied!");
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{flex:1, marginTop:50, borderTopLeftRadius:30, borderTopRightRadius:30, backgroundColor:commonColors.lightTheme}}>
                  <View style={{alignItems:'center', paddingHorizontal:20, marginTop:10}}>
                    <View style={{marginTop:15}}>
                      <QRCode
                        value={this.state.text}
                        size={160}
                        bgColor='black'
                        fgColor='white'/>
                    </View>
                    
                      <View style={{marginTop:10}}>
                        <TouchableOpacity onPress={()=>this.copyToClipboard()}>
                          <Text style={{color:'blue', fontSize:14, marginTop:10}}>Copy Address to ClipBoard</Text>
                        </TouchableOpacity>
                        <Text style={{color:'black', fontSize:13, marginTop:5}}>{this.state.address}</Text>
                      </View>
                  </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})