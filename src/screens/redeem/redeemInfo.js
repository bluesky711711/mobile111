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
    Image,
    Alert,
    Clipboard
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';

import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'
import API from '../../service/Api'
import Cache from '../../utils/cache';

import { LinearGradient } from "expo";

const Inputer = ({placeholder, value, onChange})=>(
    <TextInput
        placeholder={placeholder}
        placeholderTextColor={commonColors.lightTheme}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={(text)=>onChange(text)}
        style={{
            paddingHorizontal:15,
            height:36,
            width:'100%',
            fontSize:13,
            backgroundColor:'white',
            borderRadius:5,
            marginTop:10
        }}
    />
)

export default class RedeemInfo extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          amount: this.props.item.amount,
          title: this.props.item.title,
          redeem_code: this.props.item.redeem_code,
          redeem_date: this.props.item.updated_at,
          award_date:this.props.item.redeem_date,
          eth_balance:0,
          eth_usd_price:0,
          fee: 0,
        }
    }

    updateBalance(){
      if (this.state.redeem_date && this.state.redeem_date.includes('T')){
        let date = this.state.redeem_date.split('T')[0];
        this.setState({redeem_date:date});
      }
      if (this.state.award_date && this.state.award_date.includes('T')){
        let date = this.state.award_date.split('T')[0];
        this.setState({award_date:date});
      }
    }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }

    copyRedeem(redeemcode){
      Clipboard.setString(redeemcode);
      Alert.alert('Redeem code copied to clipboard!');
    }

    render(){
        return(
            <View style={styles.container}>
            <LinearGradient
              colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
              start={[0.0, 0.0]}
              end={[1.0, 0.0]}
              style={{ height: 120, width: '100%' }}
            >
              <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                <Ionicons name="ios-arrow-back" size={24} color={'white'} onPress={()=>Actions.pop()} />
                <Text style={{fontSize:20, color:'white',marginLeft:15}}>ATHA REDEEM INFO</Text>
              </View>
            </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <View style={{margin:30, flex:1, marginTop:50}}>
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>REDEEM TITLE: {this.state.title}</Text>
                  </View>
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>REDEEM AMOUNT: {this.state.amount} ATHA</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.copyRedeem(this.state.redeem_code)} style={{backgroundColor:'white',height:50, flexDirection:'column', justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:14, flex:1, color:commonColors.theme, marginLeft:10}}>REDEEM CODE: {this.state.redeem_code}</Text>
                    </View>
                    <View style={{flex:1, paddingVertical:0, marginVertical:0}}>
                      <Text style={{fontSize:10, flex:1, textAlign:'center', addingVertical:0, marginVertical:0, color:'#f00', marginLeft:10}}>Copy RedeemCode to Clipboard!</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>AWARD DATE: {this.state.award_date}</Text>
                  </View>
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>REDEEMED DATE: {this.state.redeem_date}</Text>
                  </View>
                </View>
              </ImageBackground>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: commonColors.background,
        height:commonStyles.height
    }
})
