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
    Alert
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
          redeem_date: this.props.item.redeem_date,
          eth_balance:0,
          eth_usd_price:0,
          fee: 0,
        }
    }

    updateBalance(){
      if (this.state.redeem_date.includes('T')){
        let date = this.state.redeem_date.split('T')[0];
        this.setState({redeem_date:date});
      }
    }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
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
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>REDEEM CODE: {this.state.redeem_code}</Text>
                  </View>
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>REDEEM DATE: {this.state.redeem_date}</Text>
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
