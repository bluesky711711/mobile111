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

import API from '../../service/Api'
import Cache from '../../utils/cache';
import { LinearGradient } from "expo";

export default class LiveEvent extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          eth_balance: this.props.item.eth_balance,
          atha_balance:this.props.item.atha_balance,
          eth_price: this.props.item.eth_price,
          atha_price: this.props.item.atha_price,
          fee:this.props.item.fee,
          amount:this.props.item.amount,
          event: this.props.item.event,
          to_part:'',
          from_fan:'',
          note:'',
        }
    }


    componentDidMount(){
      if (Cache.currentUser){
          let from_fan = Cache.currentUser.name;
          let to_part = this.props.item.part.first_name + ' ' + this.props.item.part.last_name;
          setTimeout(()=>{
            this.setState({from_fan, to_part});
          }, 10);
      } else {
        Alert.alert('none current user');
      }
    }

    Confirm(){
      API.submitVote(Cache.currentUser.id, this.props.item.part.id, this.state.event.id, this.state.amount, (err, res) => {
        if (err == null){
          Alert.alert('Vote Submitted!',
          'Your Wallet Balance will change soon. Please be patient!',
          [
              {text: 'OK', onPress: () => Actions.Main()},
          ],
          { cancelable: false });
        } else {
          Alert.alert(err);
        }
      });
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
                  <Ionicons name="ios-arrow-back" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>ConfirmVote</Text>
                </View>
                <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center', marginTop:15}}>{this.state.atha_balance} ATHA</Text>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={{flex:1, padding:20}}>
                <Text style={{marginTop:40, color:'white', fontSize:18}}>Confirm Vote Details</Text>
                <View style={{marginTop:20, borderRadius:3, overflow:'hidden'}}>
                  <View style={{flexDirection:'row', alignItems:'center', height:50, backgroundColor:'rgb(220,244,254)', paddingHorizontal:20}}>
                    <Text style={{color:'grey', flex:1, fontSize:15}}>To</Text>
                    <Text style={{color:'black', fontSize:15}}>{this.state.to_part}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center', height:50, backgroundColor:'rgb(205,241,255)', paddingHorizontal:20}}>
                    <Text style={{color:'grey', flex:1, fontSize:15}}>From</Text>
                    <Text style={{color:'black', fontSize:15}}>{this.state.from_fan}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center', height:50, backgroundColor:'rgb(205,241,255)', paddingHorizontal:20}}>
                    <Text style={{color:'grey', flex:1, fontSize:15}}>Total</Text>
                    <Text style={{color:'black', fontSize:15}}>{this.state.amount}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center', height:50, backgroundColor:'rgb(205,241,255)', paddingHorizontal:20}}>
                    <Text style={{color:'grey', flex:1, fontSize:15}}>Note</Text>
                    <Text style={{color:'black', fontSize:15}}>{this.state.event.event_name}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row', height:50, marginTop:20, width:'100%'}}>
                  <TouchableOpacity onPress={()=>Actions.pop()} style={{borderRadius:3, backgroundColor:'rgb(224, 224, 224)', alignItems:'center', justifyContent:'center', flex:1}}>
                    <Text style={{fontSize:16, color:'black', fontWeight:'bold'}}>Go Back</Text>
                  </TouchableOpacity>
                  <View style={{width:10}}/>
                  <TouchableOpacity onPress={()=>this.Confirm()} style={{borderRadius:3, backgroundColor:commonColors.theme, alignItems:'center', justifyContent:'center', flex:1}}>
                    <Text style={{fontSize:16, color:'white', fontWeight:'bold'}}>Confirm</Text>
                  </TouchableOpacity>
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
