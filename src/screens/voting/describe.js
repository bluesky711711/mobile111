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
            <Text style={{fontSize:13, color:'#333', flex:1, marginLeft:15}}>{item.title}</Text>
            <Text style={{fontSize:11, color:'#333'}}>{item.date}</Text>
        </TouchableOpacity>
      )
    })}
  </View>
)

export default class LiveEvent extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          sport:'',
          league:'',
          events:[
            {title:'FOX #8 LNAME1, FNAME1'},
            {title:'FOX #8 LNAME1, FNAME1'},
            {title:'FOX #8 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
            {title:'BEARS #1 LNAME1, FNAME1'},
          ]
        }
    }

    render(){
        return(
            <View style={styles.container}>

              <LinearGradient
                colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                start={[0.0, 0.0]}
                end={[1.0, 0.0]}
                style={{ height: 80, width: '100%' }}
              >
                <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                  <Ionicons name="ios-arrow-back" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:18, color:'white', textDecorationLine:'underline', marginLeft:10}}>Where do the coins go?</Text>
                </View>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
              <ScrollView>
                <View style={{backgroundColor:'rgba(155, 205, 255, 0.3)', borderRadius:10, padding: 20, margin:12}}>
                  <Text style={{fontSize:18, color:'white', textDecorationLine:'underline', fontWeight:'bold'}}>Where do the coins go?</Text>
                  <Text style={{fontSize:18, color:'white', textDecorationLine:'underline', fontWeight:'bold', marginTop:10}}>Summary</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>
                    ATHA voting events were created to reward athletes and give fans a voice in the recognition of athletes.
                    While an event is open for voting, all ATHA votes are tallied via a secure system using blockchain technology.
                    Once an event is closed for voting, 1 winning athlete and 1 winning fan is selected.
                    The winning athlete is the athlete with the most ATHA votes sent to them.
                    The winning fan is the fan that sent the most ATHA votes during the event.
                    If there is a tie in either category, the total ATHA will be splite equally.
                  </Text>
                </View>
                <View style={{backgroundColor:'rgba(155, 205, 255, 0.3)', borderRadius:10, padding: 20, margin:10}}>
                  <Text style={{fontSize:18, color:'white', textDecorationLine:'underline', fontWeight:'bold'}}>ATHA Distribution</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>
                    Winning Athlete
                  </Text>
                  <Text style={{color:'white', marginLeft:20, fontSize:16}}>
                    50% of ATHA votes sent to them
                  </Text>
                  <Text style={{color:'white', marginLeft:20, fontSize:16}}>
                    + 10% of All other ATHA votes in event
                  </Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>
                    Other Athletes
                  </Text>
                  <Text style={{color:'white', marginLeft:20, fontSize:15}}>
                    50% of ATHA votes sent to them
                  </Text>
                  <Text style={{color:'white', marginTop:5, fontSize:15}}>
                    Winning Fan
                  </Text>
                  <Text style={{color:'white', marginLeft:20, fontSize:15}}>
                    5% of ATHA votes sent to them
                  </Text>
                </View>
                </ScrollView>
              </ImageBackground>
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
