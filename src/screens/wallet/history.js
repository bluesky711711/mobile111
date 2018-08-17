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
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';

import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'
import API from "../../service/Api";
import Cache from '../../utils/cache';

export default class Received extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            type:0, 
            ethRev:[
            ],
            ethSnd:[
            ],
            athaRev:[
            ],
            athaSnd:[
            ],
            user_id: 0
        }
    }
    
    pad(n) {
        return (n < 10 ? '0' : '') + n;
    }
    
    updateData(){
      if (Cache.currentUser){
        API.getEthTransactions(Cache.currentUser.id, (err, res)=>{
          if (err == null){
            let eth_revs = [];
            let eth_sends = [];
            for (let i in res.transactions){
                let now = new Date().getTime() / 1000;
                let seconds_left = now - res.transactions[i]["timestamp"];
                let days = this.pad(parseInt(seconds_left / 86400));
                seconds_left = seconds_left % 86400;

                let  hours = this.pad(parseInt(seconds_left / 3600));
                seconds_left = seconds_left % 3600;

                let  minutes = this.pad(parseInt(seconds_left / 60));
                let  seconds = this.pad(parseInt(seconds_left % 60));
                let time_str = '';
                if (days != 0){
                  time_str = time_str + days + ' days ';
                }
                if (days != 0 || hours != 0){
                  time_str = time_str + hours + ' hours ';
                }
                if (days != 0 || hours != 0 || minutes != 0){
                  time_str = time_str + minutes + ' mins ';
                } else {
                  time_str = time_str + seconds + ' secs ';
                }
                time_str = time_str + ' ago';
                
                if (res.transactions[i].from.toUpperCase() == Cache.currentUser.wallet_address.toUpperCase()){
                  eth_sends.push({title:'Sent', price:res.transactions[i]["value"], date:time_str});
                } else if (res.transactions[i].to.toUpperCase() == Cache.currentUser.wallet_address.toUpperCase()){
                  eth_revs.push({title:'Received', price:res.transactions[i]["value"], date:time_str});  
                }
            }
            this.setState({ethRev:eth_revs, ethSnd:eth_sends});
          }
        });
        
        API.getEventLogs(Cache.currentUser.id, 'receive',  (err, res)=>{
          if (err == null){
            for (let i in res.events){
                let atha_revs = [];
                let now = new Date().getTime() / 1000;
                let seconds_left = now - res.events[i]["timestamp"];
                let days = this.pad(parseInt(seconds_left / 86400));
                seconds_left = seconds_left % 86400;

                let  hours = this.pad(parseInt(seconds_left / 3600));
                seconds_left = seconds_left % 3600;

                let  minutes = this.pad(parseInt(seconds_left / 60));
                let  seconds = this.pad(parseInt(seconds_left % 60));
                let time_str = '';
                if (days != 0){
                  time_str = time_str + days + ' days ';
                }
                if (hours != 0){
                  time_str = time_str + hours + ' hours ';
                }
                if (minutes != 0){
                  time_str = time_str + minutes + ' mins ';
                } else {
                  time_str = time_str + seconds + ' secs';
                }
                time_str = time_str + ' ago';
              
                atha_revs.push({title:'Received', price:res.events[i]["_value"], date:time_str});  
                this.setState({athaRev:atha_revs});
            }
          }
        });
        
        API.getEventLogs(Cache.currentUser.id, 'send',  (err, res)=>{
          if (err == null){
            for (let i in res.events){
                let atha_sends = [];
                let now = new Date().getTime() / 1000;
                let seconds_left = now - res.events[i]["timestamp"];
                let days = this.pad(parseInt(seconds_left / 86400));
                seconds_left = seconds_left % 86400;

                let  hours = this.pad(parseInt(seconds_left / 3600));
                seconds_left = seconds_left % 3600;

                let  minutes = this.pad(parseInt(seconds_left / 60));
                let  seconds = this.pad(parseInt(seconds_left % 60));
                let time_str = '';
                if (days != 0){
                  time_str = time_str + days + ' days ';
                }
                if (hours != 0){
                  time_str = time_str + hours + ' hours ';
                }
                if (minutes != 0){
                  time_str = time_str + minutes + ' mins ';
                } else {
                  time_str = time_str + seconds + ' secs';
                }
                time_str = time_str + ' ago';
                
              
                atha_sends.push({title:'Sent', price:res.events[i]["_value"], date:time_str});
              
                this.setState({athaSnd:atha_sends});
            }
          }
        });        
      }
    }
    
    componentDidMount(){
      setTimeout(()=>{
        this.setState({user_id:Cache.currentUser.id});
        this.updateData() ;
      }, 10);
      //setInterval(()=>this.updateData(), 10000);
    }
    
    render(){
        let items = this.state.type==0?(this.props.coinType=='ETH'?this.state.ethRev:this.state.athaRev):(this.props.coinType=='ETH'?this.state.ethSnd:this.state.athaSnd)
        return(
            <View style={styles.container}>
                <View style={{flex:1, marginTop:50, borderTopLeftRadius:30, borderTopRightRadius:30, backgroundColor:commonColors.lightTheme}}>
                <View style={{alignItems:'center', paddingHorizontal:20, marginTop:10, flex:1}}>
                  <View style={{backgroundColor:commonColors.lightTheme, justifyContent:'center', flexDirection:'row', alignItems:'center', height:34, borderTopLeftRadius:20, borderTopRightRadius:20, paddingHorizontal:10}}>
                    <Text style={{fontSize:12, color:'#333', flex:1}}>Activity</Text>
                    <TouchableOpacity onPress={()=>this.setState({type:0})} style={{borderBottomWidth:2, borderBottomColor:this.state.type==0?commonColors.theme:'white', paddingBottom:5}}>
                      <Text style={{fontSize:12, color:commonColors.theme, width:70, textAlign:'center'}}>Received</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({type:1})} style={{borderBottomWidth:2, borderBottomColor:this.state.type==1?commonColors.bColor3:'white', paddingBottom:5}}>
                      <Text style={{fontSize:12, color:commonColors.bColor3, width:70, textAlign:'center'}}>Send</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={{width:'100%'}}>
                  {items.map((item, index)=>(
                    <View style={{paddingHorizontal:10, width:'100%'}}>
                      <TouchableOpacity style={{alignItems:'center', flexDirection:'row', height:60, width:'100%'}}>
                        <Ionicons name="ios-arrow-back" color={commonColors.theme} size={28}/>
                        <Text style={{marginLeft:15, flex:1, color:'#333', size:14}}>{item.title}</Text>
                        <View>
                          <Text style={{color:'grey', size:12, textAlign:'right'}}>{item.price} {this.props.coinType}</Text>
                          <Text style={{color:'grey', size:12}}>{item.date}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{height:1, width:'100%', backgroundColor:'#ccc'}}/>
                    </View>
                  ))}
                  </ScrollView>
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