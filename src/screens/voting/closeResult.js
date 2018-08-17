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
        let d = new Date(this.props.item.created_at);
        let date = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate();
        this.props.item.date = date;
        this.state={
          event_item:this.props.item,
          winner_fan_amount:0,
          winner_part_amount:0,
        }
    }

    componentDidMount(){
      API.get_winner_part_amount_by_event(this.props.item.id, (err, res)=>{
        if (err == null){
            this.setState({winner_part_amount:res.res});
        } else {
            Alert.alert(err);
        }
      });

      API.get_winner_fan_amount_by_event(this.props.item.id, (err, res)=>{
        if (err == null){
            this.setState({winner_fan_amount:res.res});
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
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>ATHA Fan Voting Event</Text>
                </View>
                <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center', marginTop:15}}>CLOSED EVENTS AND RESULTS</Text>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <View style={{padding: 20, margin:12, alignItems:'center'}}>
                  <Text style={{fontSize:12, color:'white', fontWeight:'bold'}}>{this.state.event_item.sport} | {this.state.event_item.league}  | {this.state.event_item.event_hostname} | {this.state.event_item.date}</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>Winning Athlete:</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>{this.state.event_item.winner_part_firstname} {this.state.event_item.winner_part_lastname} = {this.state.winner_part_amount} ATHA</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>Winning Fan:</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>{this.state.event_item.winner_fan_name} = {this.state.winner_fan_amount} ATHA Votes</Text>
                </View>
                <View style={{flex:1}}/>
                {/*<View style={{backgroundColor:'rgb(122, 211, 245)', borderRadius:10, padding: 20, margin:10, marginBottom:30}}>
                  <Text style={{fontSize:18, color:'grey', textDecorationLine:'underline', fontWeight:'bold'}}>ATHA Distribution</Text>
                  <Text style={{color:'grey', marginTop:5, fontSize:15}}>
                    Winning Athlete
                  </Text>
                  <Text style={{color:'grey', marginLeft:20, fontSize:16}}>
                    50% of ATHA votes sent to them + 10% of All other ATHA votes in event
                  </Text>
                  <Text style={{color:'grey', marginTop:5, fontSize:15}}>
                    Other Athletes
                  </Text>
                  <Text style={{color:'grey', marginLeft:20, fontSize:15}}>
                    50% of ATHA votes sent to them
                  </Text>
                  <Text style={{color:'grey', marginTop:5, fontSize:15}}>
                    Winnning Fan
                  </Text>
                  <Text style={{color:'grey', marginLeft:20, fontSize:15}}>
                    50% of ATHA votes sent to them
                  </Text>

                </View>*/}
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
