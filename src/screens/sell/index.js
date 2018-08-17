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
    KeyboardAvoidingView,
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
        placeholderTextColor={commonColors.placeholder}
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

const ShowItemList = ({items, onPress})=>(
  <View>
    {items.map((item, index)=>{
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={()=>onPress(item, index)} style={{flexDirection:'row', height:34, marginTop:8, borderRadius:10, backgroundColor:commonColors.lightTheme, paddingHorizontal:10, alignItems:'center'}}>
            <Ionicons name="ios-arrow-back" size={20} color={'grey'}/>
            <Text style={{fontSize:13, color:'#333', flex:1, marginLeft:15}}>{item.title}</Text>
            <Text style={{fontSize:11, color:'#333'}}>{item.date}</Text>
        </TouchableOpacity>
      )
    })}
  </View>
)

export default class Sell extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            amount: '1000',
            atha_balance:'0.00',
            atha_usd_amount: '0.00',
            minETH: 0.0016,
            minUSD: 0.00000153,
            eth_balance: 0,
            eth_usd_unit: 0
        }
    }
    updateBalance(){
       if (Cache.currentUser){
        API.getAthaBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let atha_balance = parseFloat(res.balance.replace(',', ''));
             API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * atha_balance * 0.00000160;
              let min_usd_price = price_usd * 0.00000160;
              this.setState({atha_usd_amount:usd_value.toFixed(4), eth_usd_unit:price_usd});
            })
            this.setState({atha_balance:atha_balance.toFixed(8)});
          } else {
            Alert.alert(error);
          }
        });
         API.getEthBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let eth_balance = parseFloat(res.balance);
            this.setState({eth_balance:eth_balance.toFixed(8)});
            API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * eth_balance;
              let minUSD =  this.state.minETH * price_usd;
              this.setState({eth_usd_price:usd_value.toFixed(4), minUSD:minUSD});
            })
          } else {
            Alert.alert(error);
          }
        });
      } else {
        Alert.alert('none current user');
      }
    }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }

    submit(){
        let eth_min_price = this.state.amount * 0.00000160;
        if (eth_min_price > this.state.minETH){
          Alert.alert('Min Price must be at least 0.00160 ETH for 1000 ATHA');
          return;
        }

        API.getGas(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let gasfee = parseFloat(res.gasdata.gasfee);
            if (gasfee > this.state.eth_balance) {
              Alert.alert('You need more ETH for this transaction. Please add ETH to your wallet then try again.');
              return;
            }
            API.setSellingRequest(Cache.currentUser.id, this.state.amount, this.state.minETH, (err, res) => {
                if (err){
                  Alert.alert(err);
                } else {
                  Alert.alert('Your request successfully sent');
                  setTimeout(()=>Actions.Main(), 3000);
                }
            });
          } else {
            Alert.alert('cannot calc gas fee now, try it later!');
          }
        });
    }

    changeUSD(minUSD){
      if (minUSD > 0){
        let minETH = minUSD / this.state.eth_usd_unit;
        this.setState({minETH, minUSD});
      }
    }

    changeETH(minETH){
      if (minETH > 0){
        let minUSD = minETH * this.state.eth_usd_unit;
        this.setState({minETH, minUSD});
      }

    }

    changeATHA(amount) {
      if (amount > 0){
        let minETH = parseFloat(amount * 0.0000016);
        let minUSD = minETH * this.state.eth_usd_unit;
        this.setState({amount, minETH, minUSD});
      }
    }

    render(){
        return(
          <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
            <View style={styles.container}>

              <LinearGradient
                colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                start={[0.0, 0.0]}
                end={[1.0, 0.0]}
                style={{ height: 120, width: '100%', borderBottomColor:'grey', borderBottomWidth:1 }}
              >
                <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                  <Ionicons name="ios-menu" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>SELL ATHA</Text>
                </View>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
              <ScrollView style={{flex:1}}>
                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                <LinearGradient
                  colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                  start={[0.0, 0.0]}
                  end={[1.0, 0.0]}
                  style={{ height: 120, width: '80%', borderRadius: 10, marginTop:30 }}
                >
                  <Text style={{fontSize:12, color:'white', marginLeft:15, marginTop:10}}>Current Balance</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>ATHA</Text>
                  <Text style={{fontSize:24, color:'white', width:'100%', textAlign:'center', fontWeight:'bold'}}>{this.state.atha_balance}</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>${this.state.atha_usd_amount} USD</Text>
                </LinearGradient>
              </View>
              <View style={{height:400, marginTop:50, borderTopLeftRadius:30, borderTopRightRadius:30, backgroundColor:commonColors.lightTheme}}>
                <View style={{alignItems:'center', paddingHorizontal:20, marginTop:10}}>
                  <Text style={{fontSize:10, color:'#333', textAlign:'center'}}>If you want to sell ATHA please fill out the form below.</Text>
                  <Text style={{fontSize:10, color:'#333', textAlign:'center'}}>You may enter ETH amount or USD amount you want to sell for. ATHA is sold as a fraction of ETH. Your minimum price must be at least 0.00160 ETH per 1000 ATHA but it can be any amount higher. Your price will increase if ETH increases. </Text>


                  <Inputer placeholder="Amount of ATHA" value={this.state.amount.toString()} onChange={(amount)=>this.changeATHA(amount)}/>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Inputer placeholder="Min Price in USD" value={this.state.minUSD.toString()} onChange={(minUSD)=>this.changeUSD(minUSD)}/>
                    </View>
                    <View style={{width:15}}/>
                    <View style={{flex:1}}>
                        <Inputer placeholder="Min Price in ETH" value={this.state.minETH.toString()} onChange={(minETH)=>this.changeETH(minETH)}/>
                    </View>
                  </View>
                </View>
                <View style={{marginTop:10, justifyContent:'center', marginHorizontal:20}}>
                    <TouchableOpacity onPress={()=>this.submit()}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                      <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        Submit Sell Listing
                      </Text>
                    </LinearGradient>
                    </TouchableOpacity>
                </View>
              </View>
              </ScrollView>
              </ImageBackground>
            </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: commonColors.background,
    }
})
