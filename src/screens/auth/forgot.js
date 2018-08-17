
import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,
    Alert
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';
import API from "../../service/Api";
import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'

const Inputer = ({placeholder, value, onChange, icon})=>(
  <View style={{flexDirection:'row', borderWidth:1, borderColor:'grey', marginHorizontal:30, borderTopLeftRadius:5,borderBottomLeftRadius:5, marginTop:20}}>
    <TextInput
        placeholder={placeholder}
        placeholderTextColor={commonColors.placeText}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={(text)=>onChange(text)}
        style={{
            paddingHorizontal:15,
            height:40,
            flex:1,
            fontSize:16,
            backgroundColor:'white',
            borderTopLeftRadius:5,
            borderBottomLeftRadius:5,
        }}
    />
    <View style={{backgroundColor:commonColors.lightTheme, width:50, justifyContent:'center', alignItems:'center'}}>
      <Ionicons name={icon} size={30} color={commonColors.theme}/>
    </View>
  </View>
)

export default class Forgot extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          email:''

        }
    }

    Send(){
      API.Forgot(this.state.email, (err, res) => {
        if (err == null){
          Alert.alert("Password reset. Please check your email for your new password.");
          setTimeout(()=>Actions.Signin(), 2000);
        } else {
          Alert.alert(JSON.stringify(err));
        }
      });
    }

    render(){
        return(
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <Text style={{color:'white', fontSize:26, width:'100%', textAlign:'center',marginTop:40}}>Forgot Password</Text>
                <Text style={{color:'white', fontSize:18, width:'100%', textAlign:'center',marginTop:15, paddingHorizontal:40}}>Enter the email on your account to have your password sent</Text>
                <View style={{flex:1}}/>
                <View>
                  <Inputer placeholder="Email" value={this.state.email} onChange={(email)=>this.setState({email})} icon="ios-mail-outline"/>
                  <TouchableOpacity onPress={()=>this.Send()} style={{backgroundColor:commonColors.theme, height:50, borderRadius:5, marginHorizontal:30, marginTop:30, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Send Now</Text>
                  </TouchableOpacity>

                </View>
                <View style={{flex:1}}/>

                <TouchableOpacity onPress={()=>Actions.pop()} style={{backgroundColor:'transparent', position:'absolute', left:15, top:45}}>
                  <Ionicons name="ios-arrow-back" size={30} color={'white'}/>
                </TouchableOpacity>
              </ImageBackground>
          </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: commonColors.background
    }
})
