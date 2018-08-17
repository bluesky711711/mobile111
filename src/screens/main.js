
import React, {PureComponent} from 'react'

import {
    Linking,
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    Alert,
    Image
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';
import { LinearGradient } from "expo";

import Cache from '../utils/cache';
import * as commonColors from '../styles/commonColors'
import * as commonStyles from '../styles/commonStyles'

const Button = ({icon, title, onPress})=>(
  <TouchableOpacity onPress={()=>onPress()} style={{flexDirection:'row', backgroundColor:commonColors.theme, paddingHorizontal:20, height:44, alignItems:'center',marginTop:8, width:'87%'}}>
    <Ionicons name={icon} size={28} color={'white'} style={{marginLeft:20}}/>
    <Text style={{fontSize:16, color:'white', flex:1, marginLeft:20}}>{title}</Text>
    <Ionicons name="ios-play" size={20} color={'white'} />
  </TouchableOpacity>
)

export default class Main extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          email:'',
          name: ''
        }
    }

    componentDidMount(){
      if (Cache.currentUser){
        setTimeout(()=> this.setState({email:Cache.currentUser.email, name:Cache.currentUser.name})
        , 10);
      }
    }

    goHelp(){
      let url = 'https://athleticoin.org/apps'
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));

    }

    render(){
        return(          
          <ImageBackground source={commonStyles.menu} style={styles.container}>
          <ScrollView>
          <View style={{flexDirection:'row', paddingHorizontal:20, alignItems:'center', marginTop:30}}>
            <Image source={commonStyles.icon} style={{width:80, height:80, borderRadius:40}}/>
            <View style={{marginLeft:20}}>
              <Text style={{fontSize:24, color:'white'}}>{this.state.name}</Text>
              <Text style={{fontSize:13, color:'white',marginTop:5}}>{this.state.email}</Text>
            </View>
            </View>
            <View style={{marginTop:40}}>
              <Button icon="ios-basket-outline" title="Give or Redeem ATHA" onPress={()=>Actions.Redeem()}/>
              <Button icon="ios-git-network-outline" title="ATHA Fan Voting Events" onPress={()=>Actions.Voting()}/>
              <Button icon="ios-undo-outline" title="Sell ATHA" onPress={()=>Actions.Sell()}/>
              <Button icon="ios-exit-outline" title="Buy ATHA" onPress={()=>Actions.Buy()}/>
              <View style={{height:1, backgroundColor:commonColors.theme, width:100, marginTop:23, marginBottom:15}}/>
              <Button icon="ios-briefcase-outline" title="Manage Wallet" onPress={()=>Actions.Wallet()}/>
              <Button icon="ios-settings" title="Reset Password" onPress={()=>Actions.ResetPassword()}/>
              <Button icon="ios-information-circle" title="Help" onPress={()=>this.goHelp()}/>
            </View>
            <View style={{alignItems:'center', width:'87%', marginTop: 20}}>
              <TouchableOpacity onPress={()=>Actions.Signin()} activeOpacity={0.8} style={{width:150, height:40, backgroundColor:commonColors.theme, justifyContent:'center', alignItems:'center', borderRadius:3}}>
              <LinearGradient
                    colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                    start={[0.0, 0.0]}
                    end={[1.0, 0.0]}
                    style={{ height: 40, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                  >
                    <Text style={{fontSize:16, color:'white'}}>Log Out</Text>
                  </LinearGradient>

              </TouchableOpacity>
            </View>
          </ScrollView>  
          </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})
