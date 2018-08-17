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
import API from '../../service/Api'
import Cache from '../../utils/cache';
import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';

import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'


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
            <Image source={commonStyles.icon} style={{width:30, height:30}}/>
            <Text style={{fontSize:13, color:'#333', flex:1, marginLeft:15}}>{item.selling_amount} ATHA</Text>
            <Text style={{fontSize:13, color:'#333', flex:1, marginLeft:15}}>{item.seller}</Text>
            <Text style={{fontSize:11, color:'#333'}}>{item.price} ETH</Text>
        </TouchableOpacity>
      )
    })}
  </View>
)

export default class Buy extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            eth_balance:'',
            eth_usd_price:'',
            selling_requests:[
            ],
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
            })
          } else {
            Alert.alert(error);
          }
        });
      } else {
        Alert.alert('none current user');
      }
      
      API.getSellingRequest(Cache.currentUser.id, (err, res)=>{
        if (err == null){
          this.setState({selling_requests:res.res});
        } else {
          Alert.alert(err);
        }
      });
    }
    
    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }
    
    Sort(type){      
      let listitems = this.state.selling_requests;
      if (type == 1){
        listitems.sort(function(a, b){return a.price - b.price});
      } else if (type == 0){
        listitems.sort(function(a, b){return b.price - a.price});
      }
      this.setState({type:type, selling_requests:listitems});
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
                <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                  <Ionicons name="ios-menu" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>Buy ATHA</Text>
                </View>
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
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>ETH</Text>
                  <Text style={{fontSize:24, color:'white', width:'100%', textAlign:'center', fontWeight:'bold'}}>{this.state.eth_balance}</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>${this.state.eth_usd_price} USD</Text>
                </LinearGradient>
              </View>
                <View style={{margin:30, flex:1}}>
                  <View style={{backgroundColor:commonColors.lightTheme, justifyContent:'center', flexDirection:'row', alignItems:'center', height:34, borderTopLeftRadius:20, borderTopRightRadius:20, paddingHorizontal:10}}>
                    <Text style={{fontSize:12, color:'red', flex:1}}>ATHA Marketplace Listings</Text>
                    <TouchableOpacity onPress={()=>this.Sort(1)} style={{borderBottomWidth:2, borderBottomColor:this.state.type==1?commonColors.theme:'white', paddingBottom:5}}>
                      <Text style={{fontSize:12, color:commonColors.theme, width:50, textAlign:'center'}}>Min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.Sort(0)} style={{borderBottomWidth:2, borderBottomColor:this.state.type==0?commonColors.theme:'white', paddingBottom:5}}>
                      <Text style={{fontSize:12, color:commonColors.theme, width:50, textAlign:'center'}}>Max</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={{marginTop:8}} showsVerticalScrollIndicator={false}>
                    <ShowItemList items={this.state.selling_requests} onPress={(item, index)=>{Actions.Confirm({item})}}/>
                  </ScrollView>
                </View>
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