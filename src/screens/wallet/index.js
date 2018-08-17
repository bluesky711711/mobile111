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
import History from './history'
import Received from './received'
import Send from './send'
import API from '../../service/Api'
import Cache from '../../utils/cache';
import { LinearGradient } from "expo";

const ETH = 'ETH'
const ATHA = 'ATHA'

export default class Wallet extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            amount:'',
            type:1,
            coinType: ETH,
            ETH_BALANCE: '',
            ETH_PRICE:'',
            ATHA_PRICE: '',
            ATHA_BALANCE: '',
        }
    }
    
    updateBalance(){
       if (Cache.currentUser){
        API.getEthBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let eth_balance = parseFloat(res.balance);
            this.setState({ETH_BALANCE:eth_balance.toFixed(8)});
            API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * eth_balance;
              this.setState({ETH_PRICE:usd_value.toFixed(4)});
            })
          } else {
            Alert.alert(error);
          }
        });
        
        API.getAthaBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let atha_balance = parseFloat(res.balance.replace(',', ''));
            this.setState({ATHA_BALANCE:atha_balance.toFixed(8)});
            API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * atha_balance * 0.00000153;
              this.setState({ATHA_PRICE:usd_value.toFixed(4)});
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
    
    render(){
        return(
          <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <View style={styles.container}>
                
              <LinearGradient
                colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                start={[0.0, 0.0]}
                end={[1.0, 0.0]}
                style={{ height: 120, width: '100%' }}
              >
                <View style={{flexDirection:'row', marginTop:40, marginHorizontal:15}}>
                  <Ionicons name="ios-menu" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15, flex:1}}>Personal Wallet</Text>
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>this.setState({coinType:ETH})} activeOpacity={0.8} style={{backgroundColor:this.state.coinType==ATHA?'#eee':commonColors.bColor1, alignItems:'center', justifyContent:'center', borderTopLeftRadius:20, borderBottomLeftRadius:20, height:28, width:50}}>
                      <Text style={{fontSize:14, color:this.state.coinType==ATHA?'grey':'white'}}>ETH</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({coinType:ATHA})} activeOpacity={0.8} style={{backgroundColor:this.state.coinType==ETH?'#eee':commonColors.bColor1, alignItems:'center', justifyContent:'center', borderTopRightRadius:20, borderBottomRightRadius:20, height:28, width:50}}>
                      <Text style={{fontSize:13, color:this.state.coinType==ETH?'grey':'white'}}>ATHA</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection:'row', marginTop:10}}>
                  <TouchableOpacity onPress={()=>this.setState({type:0})} style={{flex:1, alignItems:'center', borderBottomWidth:this.state.type==0?2:0, borderBottomColor:'white'}}>
                    <Ionicons name="ios-briefcase-outline" size={20} color={'white'}/>
                    <Text style={{fontSize:13, color:'white'}}>Receive</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setState({type:1})} style={{flex:1, alignItems:'center', borderBottomWidth:this.state.type==1?2:0, borderBottomColor:'white'}}>
                    <Ionicons name="ios-git-network-outline" size={20} color={'white'}/>
                    <Text style={{fontSize:13, color:'white'}}>History</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setState({type:2})} style={{flex:1, alignItems:'center', borderBottomWidth:this.state.type==2?2:0, borderBottomColor:'white'}}>
                    <Ionicons name="ios-send-outline" size={20} color={'white'}/>
                    <Text style={{fontSize:13, color:'white'}}>SEND</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                <LinearGradient
                  colors={[commonColors.tColor1, commonColors.tColor2, commonColors.tColor3]}
                  start={[0.0, 0.0]}
                  end={[1.0, 0.0]}
                  style={{ height: 120, width: '80%', borderRadius: 10, marginTop:30 }}
                >
                  <Text style={{fontSize:12, color:'white', marginLeft:15, marginTop:10}}>Current Balance</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>{this.state.coinType}</Text>
                  <Text style={{fontSize:24, color:'white', width:'100%', textAlign:'center', fontWeight:'bold'}}>{this.state.coinType==ETH?this.state.ETH_BALANCE:this.state.ATHA_BALANCE}</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>${this.state.coinType==ETH?this.state.ETH_PRICE:this.state.ATHA_PRICE} USD</Text>
                </LinearGradient>
              </View>
              {this.state.type==0&&<Received coinType={this.state.coinType} />}
              {this.state.type==1&&<History coinType={this.state.coinType}/>}
              {this.state.type==2&&<Send coinType={this.state.coinType} Balance={{ETH:this.state.ETH_BALANCE, ATHA:this.state.ATHA_BALANCE}}/>}
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: commonColors.background,
    }
})



























 