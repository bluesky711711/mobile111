
import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Platform,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';
import API from '../../service/Api';
import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'




const Inputer = ({placeholder, value, isSecure, onChange, icon})=>(
  <View style={{flexDirection:'row', borderWidth:1, borderColor:'grey', marginHorizontal:30, borderTopLeftRadius:5,borderBottomLeftRadius:5, marginTop:20}}>
    <TextInput
        placeholder={placeholder}
        placeholderTextColor={commonColors.placeText}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={(text)=>onChange(text)}
        secureTextEntry={isSecure}
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

export default class Signin extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          email:'', //cryptominerlaf@gmail.com
          password:'', //pass4ATHLETICOIN
          calling: false
        }
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content', false);
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(commonColors.theme, false);
        }
    }

    SignIn(){
      let {email,  password} = this.state;

      if (this.state.calling == true) return;

      this.setState({calling:true});
      API.Login(email, password, (err, res) => {
        if (err == null){
          this.setState({calling:false});
          Actions.Main();
        } else {
          Alert.alert(err);
          this.setState({calling:false});
        }
      });
    }

    Forgot(){
      Actions.Forgot()
    }

    Register(){
      Actions.Register()
    }

    render(){
        return(
          <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <Text style={{color:'white', fontWeight:'bold', fontSize:30, width:'100%', textAlign:'center',marginTop:50}}>Sign In Now</Text>
                <Text style={{color:'white', fontWeight:'bold', fontSize:18, width:'100%', textAlign:'center',marginTop:15}}>Login below to access your account</Text>
                <View style={{flex:1}}/>
                <View>
                  <Inputer placeholder="Email" value={this.state.email} onChange={(email)=>this.setState({email})} icon="ios-mail-outline"/>
                  <Inputer placeholder="Password" isSecure={true} value={this.state.password} onChange={(password)=>this.setState({password})} icon="ios-lock-outline"/>
                  <TouchableOpacity onPress={()=>this.SignIn()} style={{backgroundColor:commonColors.theme, height:50, borderRadius:5, marginHorizontal:30, marginTop:30, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Sign In</Text>
                  </TouchableOpacity>

                  <View style={{width:'100%', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>this.Forgot()} style={{backgroundColor:commonColors.lightTheme, height:50, borderRadius:5, width:220, marginTop:15, justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:15, color:'black'}}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.Register()} style={{backgroundColor:commonColors.lightTheme, height:50, borderRadius:5, width:220, marginTop:10, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                      <Text style={{fontSize:12, color:'black'}}>Not a Member Yet?</Text>
                      <Text style={{fontSize:14, color:commonColors.theme, marginLeft:5}}>Register</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={{flex:1}}/>
              </ImageBackground>
          </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})
