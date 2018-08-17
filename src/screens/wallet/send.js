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
    Alert
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';

import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'
import API from '../../service/Api'
import Cache from '../../utils/cache';

import { LinearGradient } from "expo";

const Inputer = ({placeholder, value, onChange, icon, isButton, onPress})=>(
    <View style={{flexDirection:'row', marginTop:15,}}>
      <TextInput 
          placeholder={placeholder}
          placeholderTextColor={commonColors.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={value}
          onChangeText={(text)=>onChange(text)}
          style={{
              paddingHorizontal:15,
              height:40,
              width:'100%',
              fontSize:14, 
              backgroundColor:'white',
              borderRadius:5,
          }}
      />
      <TouchableOpacity onPress={onPress} activeOpacity={1} style={{position:'absolute', right:0, top:0, height:40, width:40, alignItems:'center', justifyContent:'center', backgroundColor:isButton?'rgb(223,245,255)':'white'}}>
        <Ionicons name={icon} size={30} color={commonColors.theme} />
      </TouchableOpacity>
    </View>
)

export default class Send extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            amount:'',
            to_address:'',
            type:1,
        }
    }
    
    getQRCode(qrcode){
      this.setState({to_address:qrcode});
    }
    
    Send(){
       if (Cache.currentUser){
        API.getGas(Cache.currentUser.id, (err1, res) => {
          if (err1 == null){
            let gasfee = parseFloat(res.gasdata.gasfee);
            let balance = this.props.Balance.ETH;
            if (balance > gasfee + this.state.amount){
              if (this.props.coinType == "ETH"){
                API.sendETH(Cache.currentUser.id, this.state.to_address, this.state.amount, (err2, res1) => {
                  if (err2 == null){
                    Alert.alert('ETH successfully sent!');
                  } else {
                    Alert.alert(err2.toString());
                  }
                });
              } else if (this.props.coinType == 'ATHA'){
                API.sendATHA(Cache.currentUser.id, this.state.to_address, this.state.amount, (err3, res2) => {
                  if (err3 == null){
                    Alert.alert('ATHA successfully sent!');
                  } else {
                    Alert.alert(err3);
                  }
                });
              }
            } else {
              Alert.alert('Sufficient Balance!');
            }
          } else {
            Alert.alert('failed gas fee');
          }
        });
       }
    }
    
    render(){
        return(
            <View style={styles.container}>
              <View style={{flex:1, marginTop:50, borderTopLeftRadius:30, borderTopRightRadius:30, backgroundColor:commonColors.lightTheme}}>
                <View style={{alignItems:'center', paddingHorizontal:20, marginTop:10}}>
                  <Text style={{fontSize:10, color:'#333', textAlign:'center', marginTop:10}}>If You Want To Send ETH to another wallet. Please Complete The Form Below</Text>
                  <Inputer placeholder="Wallet Address" value={this.state.to_address} onChange={(to_address)=>this.setState({to_address})} icon={'ios-qr-scanner'} isButton={true} onPress={()=>Actions.ScanQRCode({getQRCode:(qrcode)=>this.getQRCode(qrcode)})}/>
                  <Inputer placeholder={this.props.coinType=='ETH'?"Amount of ETH":'Amount of ATHA'} value={this.state.amount} onChange={(amount)=>this.setState({amount})} icon={'ios-trending-up'}/>
                  <Inputer placeholder="Notes" value={this.state.date} onChange={(date)=>this.setState({date})} icon={'ios-paper-outline'}/>
                </View>
                <View style={{flex:1, justifyContent:'center', marginHorizontal:20}}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                    <TouchableOpacity onPress={()=>this.Send()}>  
                      <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        Send Now
                      </Text>
                    </TouchableOpacity>  
                    </LinearGradient>
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