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
            height:30,
            width:'100%',
            fontSize:13, 
            backgroundColor:'white',
            borderRadius:5,
            marginTop:8
        }}
    />
)

const ShowItemList = ({items, onPress})=>(
  <View>
    {items.map((item, index)=>{
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={()=>onPress(item, index)} style={{flexDirection:'row', height:34, marginTop:8, borderRadius:10, backgroundColor:commonColors.lightTheme, paddingHorizontal:10, alignItems:'center'}}>
            <Ionicons name="ios-arrow-back" size={20} color={'grey'}/>
            <Text style={{fontSize:13, color:'#333', flex:1, marginLeft:15}}>{item.event.sport} | {item.league} | {item.first_name}</Text>
            {item.StartDate && <Text style={{fontSize:11, color:'#333'}}>{item.StartDate.split('T')[0]}</Text>}
        </TouchableOpacity>
      )
    })}
  </View>
)

export default class IncludeTop extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          sport:'',
          league:'',
          fans:[],
          athletes:[],
          parts:[],
          type: 0,
          atha_balance:0,
        }
    }
    updateEvents(){
    
      API.getTopAthletes(this.props.item.id, (err, res)=>{
        if (err == null){
            this.setState({athletes:res.athletes});
        } else {
            Alert.alert(err);
        }
      });
      
      API.getTopFans(this.props.item.id, (err, res)=>{
        if (err == null){
            this.setState({fans:res.fans});
        } else {
            Alert.alert(err);
        }
      });
      
      API.getParticipants(this.props.item.id, (err, res)=>{
        if (err == null){
          for (let i in res.parts){
            res.parts[i].event = this.props.item;
          }
          this.setState({parts:res.parts}); 
        } else {
            Alert.alert(err);
        }
      });
      
      if (Cache.currentUser){
        API.getAthaBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let atha_balance = parseFloat(res.balance.replace(',', ''));
            this.setState({atha_balance:atha_balance.toFixed(8)});
          } else {
            Alert.alert(error);
          }
        });
      } else {
        Alert.alert('none current user');
      }
    }
    
    componentDidMount(){
      this.updateEvents();
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
                <Text style={{fontSize:16, color:'white', width:'100%', marginTop:15, marginLeft:10}}>Current ATHA Balance {this.state.atha_balance}</Text>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <View style={{margin:30, flex:1}}>
                  <View style={{borderTopLeftRadius:20,paddingHorizontal:10,  borderTopRightRadius:20, backgroundColor:commonColors.lightTheme, paddingVertical:10}}>
                    <View style={{flexDirection:'row'}}>
                      <View style={{borderBottomWidth:2, borderBottomColor:commonColors.theme}}>
                        <Text style={{fontSize:20, color:'#333', marginHorizontal:20}}>{this.state.type==0?'Top Athletes':'Top Fans'}</Text>
                      </View>
                      <View style={{flex:1}}/>
                      <TouchableOpacity onPress={()=>this.setState({type:0})} style={{ paddingBottom:5}}>
                        <Text style={{fontSize:12, color:this.state.type==1?'grey':commonColors.theme, width:50, textAlign:'center'}}>Athlete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.setState({type:1})} style={{ paddingBottom:5}}>
                        <Text style={{fontSize:12, color:this.state.type==0?'grey':commonColors.theme, width:50, textAlign:'center'}}>Fans</Text>
                      </TouchableOpacity>
                    </View>
                    {this.state.type==0 && <View style={{marginTop:10}}>
                      {this.state.athletes.map((item, index)=>(
                        <Text style={{fontSize:14, color:'grey'}}>{item.total_amount}ATHA {item.first_name} {item.last_name}</Text>
                      ))}
                    </View>}
                    {this.state.type==1 && <View style={{marginTop:10}}>
                      {this.state.fans.map((item, index)=>(
                        <Text style={{fontSize:14, color:'grey'}}>{item.total_amount}ATHA {item.name}</Text>
                      ))}
                    </View>}
                  </View>
                  <View style={{backgroundColor:commonColors.lightTheme, justifyContent:'center',marginTop:20,  alignItems:'center', height:34, borderTopLeftRadius:20, borderTopRightRadius:20}}>
                    <Text style={{fontSize:12, color:'#333'}}>SPORT | LEAGUE | PARTICIPANT | DATE</Text>
                  </View>
                  <ScrollView style={{marginTop:8}} showsVerticalScrollIndicator={false}>
                    <ShowItemList items={this.state.parts} onPress={(item, index)=>{Actions.PostEvent({item})}}/>
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