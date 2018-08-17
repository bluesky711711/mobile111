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

const ShowItemList = ({items, onPress})=>(
  <View>
    {items.map((item, index)=>{
      let d = new Date(item.created_at);
      let date = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate();
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={()=>onPress(item, index)} style={{flexDirection:'row', height:34, marginTop:8, borderRadius:10, backgroundColor:commonColors.lightTheme, paddingHorizontal:10, alignItems:'center'}}>
            <Ionicons name="ios-arrow-back" size={20} color={'grey'}/>
            <Text style={{fontSize:13, color:'#333', flex:1, marginLeft:15}}>{item.sport} | {item.league} | {item.event_name}</Text>
            <Text style={{fontSize:11, color:'#333'}}>{date}</Text>
        </TouchableOpacity>
      )
    })}
  </View>
)

export default class LiveEvent extends PureComponent{
    constructor(props){
        super(props)
        this.state={
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{margin:30, flex:1}}>
                  <View style={{backgroundColor:commonColors.lightTheme, justifyContent:'center', alignItems:'center', height:34, borderTopLeftRadius:20, borderTopRightRadius:20}}>
                    <Text style={{fontSize:12, color:'#333'}}>SPORT | LEAGUE | EVENT | DATE</Text>
                  </View>
                  <ScrollView style={{marginTop:8}} showsVerticalScrollIndicator={false}>
                    <ShowItemList items={this.props.active_events} onPress={(item, index)=>{Actions.IncludeTop({item})}}/>
                  </ScrollView>
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