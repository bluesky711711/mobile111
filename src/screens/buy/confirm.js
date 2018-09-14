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

export default class Confirm extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          selling_amount: this.props.item.selling_amount,
          price: this.props.item.price,
          seller: this.props.item.seller,
          eth_balance:0,
          eth_usd_price:0,
          fee: 0,
        }
    }

    updateBalance(){
       if (Cache.currentUser){
        API.getEthBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let eth_balance = parseFloat(res.balance);
            this.setState({eth_balance:eth_balance.toFixed(8)});
            API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * eth_balance;
              this.setState({eth_usd_price:usd_value.toFixed(4)});
            });
          } else {
            Alert.alert(error);
          }
        });

        API.getGas(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let gasfee = parseFloat(res.gasdata.gasfee);
            let fee = this.state.price * 2 / 100 + gasfee;
            this.setState({fee:fee});
            let price = parseFloat(this.state.price) + fee;
            this.setState({price});
          } else {
            Alert.alert('none current user');
          }
        });
      }
    }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }

    Confirm(){
      if (this.state.price > this.state.eth_balance)  {
        Alert.alert('You need more ETH for this transaction!');
        return;
      }
      API.setBuyingRequest(Cache.currentUser.id, this.props.item.id, (err, res) => {
        if (err == null){
          Alert.alert('Success', 'Your Wallet Balance will change soon. Please be patient');
          setTimeout(()=>Actions.Main(), 3000);
        } else {
          Alert.alert(err);
        }
      });
    }

    render(){
        return(
            <View style={styles.container}>

              <LinearGradient
                colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                start={[0.0, 0.0]}
                end={[1.0, 0.0]}
                style={{ height: 120, width: '100%', borderBottomWidth:1, borderBottomColor:'#333' }}
              >
                <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                  <Ionicons name="ios-arrow-back" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>Buy ATHA</Text>
                </View>
              </LinearGradient>
              <ScrollView>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                <LinearGradient
                  colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                  start={[0.0, 0.0]}
                  end={[1.0, 0.0]}
                  style={{ height: 120, width: '80%', borderRadius: 10, marginTop:30 }}
                >
                  <Text style={{fontSize:12, color:'white', marginLeft:15, marginTop:10}}>Current Balance</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>ETH</Text>
                  <Text style={{fontSize:24, color:'white', width:'100%', textAlign:'center', fontWeight:'bold'}}>{this.state.eth_balance}</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>${this.state.eth_usd_price} USD</Text>
                </LinearGradient>
              </View>
                <View style={{margin:30, flex:1}}>
                  <Text style={{fontSize:24, color:'white', textAlign:'center', marginTop:10}}>Confirm Buy Details below</Text>
                  <Text style={{fontSize:24, color:'white', textAlign:'center'}}>This cannot be reversed</Text>
                  <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>AMOUNT: {this.state.selling_amount} ATHA</Text>
                  </View>
                   <View style={{ flexDirection:'row', alignItems:'center', backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, paddingRight:10, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10, flex:1}}>ETH PRICE: {parseFloat(this.state.price).toFixed(5)} ETH</Text>
                    <View>
                      <Text style={{fontSize:10, color:commonColors.theme}}>{'*Includes \nTransaction Fee:'}</Text>
                      <Text style={{fontSize:10, color:commonColors.theme}}>{this.state.fee.toFixed(5)}ETH</Text>
                    </View>
                  </View>
                   <View style={{backgroundColor:'white',height:50, justifyContent:'center', marginTop:15, borderRadius:5}}>
                    <Text style={{fontSize:16, color:commonColors.theme, marginLeft:10}}>FROM: {this.state.seller}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>this.Confirm()}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 50, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop:15 }}
                    >
                      <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        CONFIRM PURCHASE
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: commonColors.background,
    }
})
