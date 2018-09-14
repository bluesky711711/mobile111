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
import API from '../../service/Api'
import Cache from '../../utils/cache';
import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'


import { LinearGradient } from "expo";

const Inputer = ({placeholder, value, onChange, icon})=>(
    <TextInput
        placeholder={placeholder}
        placeholderTextColor={commonColors.theme}
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

export default class PostEvent extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            amount:'',
            title:'SPORT | BIG LEAGUE | FOX @ BEARS | 2018/0101',
            subTitle: 'FOX #8 LNAME1, FNAME1',
            atha_price: 0,
            atha_usd_amount: 0,
            eth_balance:0,
            eth_usd_price:0,
            fee:0,
            event:'',
            part:''
        }
    }
    updateBalance(){
       if (Cache.currentUser){
        API.getAthaBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let atha_balance = parseFloat(res.balance.replace(',', ''));
             API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * atha_balance * 0.00000153;
              this.setState({atha_usd_amount:usd_value.toFixed(4)});
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
              this.setState({eth_usd_price:usd_value.toFixed(4)});
            })
          } else {
            Alert.alert(error);
          }
        });

        API.getGas(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let gasfee = parseFloat(res.gasdata.gasfee);
            this.setState({fee:gasfee});
          } else {
            Alert.alert('none current user');
          }
        });

        setTimeout(()=>this.setState({event:this.props.item.event}), 10);
        setTimeout(()=>this.setState({part:this.props.item}), 10);
      } else {
        Alert.alert('none current user');
      }
    }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }

    goDescribe(){
        Actions.Describe();
    }

    ConfirmVote(){
      if (this.state.amount > 0){
        if (this.state.amount > this.atha_balance){
          Alert.alert('Your  wallet  does  not  contain  enough  ATHA for  this  vote.  Please  visit  the  marketplace  to  buy  ATHA  or  transfer  more  ATHA  to  your  wallet  and  return  to  place  this  vote.');
          return;
        }

        if (this.state.eth_balance < this.state.fee){
          Alert.alert('ATHA  Voting is  completed  on  the  Ethereum  blockchain.\n so  you  must  ensure  you  have  enough  ATHA  for  the  vote  and  enough  ETH  for  the  transaction  fees.Your  wallet  does  not  contain  enough  ETH  for  this  transactionfee.  Please  transfer  more  ETH  to  your  wallet  and  return  to  place  this  vote');
          return;
        }
        Actions.ConfirmVote({item:this.state});
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
                style={{ height: 120, width: '100%' }}
              >
                <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                  <Ionicons name="ios-arrow-back" size={28} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>ATHA Fan Voting Event</Text>
                </View>
                <TouchableOpacity onPress={()=>this.goDescribe()} style={{width:'100%'}}>
                  <Text style={{fontSize:18, color:'white', width:'100%', textAlign:'right', marginTop:15,
                  textDecorationLine:'underline', paddingRight:15}}>Where do the coins go?</Text>
                </TouchableOpacity>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
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
              <ScrollView>
                <View style={{marginTop:50, borderTopLeftRadius:30, borderTopRightRadius:30,paddingHorizontal:15, backgroundColor:commonColors.lightTheme, marginHorizontal:20, alignItems:'center', paddingVertical:10}}>
                  <Text style={{color:'#333', fontSize:13}}>Enter your ATHA Vote Amount and Submit Below.</Text>
                  <Text style={{color:'#333', fontSize:13}}>Be thorough as this can NOT be undone!</Text>
                </View>

                <View style={{alignItems:'center', paddingHorizontal:20, marginTop:10}}>
                  <View style={{height:44, borderRadius:3, width:'100%', justifyContent:'center', backgroundColor:'white'}}>
                    <Text style={{fontSize:13, color:'grey', marginLeft:10}}>{this.state.event.sport} | {this.state.event.league} | {this.state.event.event_hostname}</Text>
                  </View>
                    <View style={{height:44, borderRadius:3, width:'100%', justifyContent:'center', backgroundColor:'white', marginTop: 10}}>
                    <Text style={{fontSize:13, color:'grey', marginLeft:10}}>{this.state.part.first_name} {this.state.part.last_name}</Text>
                  </View>
                  <Inputer placeholder="Enter ATHA Amount" value={this.state.amount} onChange={(amount)=>this.setState({amount})}/>
                </View>
                <View style={{flex:1, justifyContent:'center', marginHorizontal:20, flexDirection:'row', marginTop:10}}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, flex:1, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                      <Text onPress={()=>Actions.pop()} style={{ color: '#fff', backgroundColor: 'transparent' }}>
                       Cancel | Go Back
                      </Text>
                    </LinearGradient>
                    <View style={{width:15}}/>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, flex:1, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                      <Text onPress={()=>this.ConfirmVote()} style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        Submit Vote
                      </Text>
                    </LinearGradient>
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
