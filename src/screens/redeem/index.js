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
import GiveRedeem from './giveRedeem'
import GetRedeem from './getRedeem'
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

export default class Redeem extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          type:0,
        }
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
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>ATHA Redeem</Text>
                </View>
                <View style={{flexDirection:'row', flex:1, alignItems:'flex-end'}}>
                  <TouchableOpacity onPress={()=>this.setState({type:0})} style={{flex:1, alignItems:'center', borderBottomWidth:this.state.type==0?2:0, borderBottomColor:'white', marginHorizontal:20, paddingBottom:8}}>
                    <Text style={{fontSize:18, color:'white'}}>Give ATHA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setState({type:2})} style={{flex:1, alignItems:'center', borderBottomWidth:this.state.type==2?2:0, borderBottomColor:'white', marginHorizontal:20, paddingBottom:8}}>
                    <Text style={{fontSize:18, color:'white'}}>Redeem ATHA</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                {this.state.type==0 && <GiveRedeem/>}
                {this.state.type==2 && <GetRedeem/>}
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
