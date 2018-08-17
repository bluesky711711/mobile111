
import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    KeyboardAvoidingView
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';
import API from "../../service/Api";
import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'

const Inputer = ({placeholder, value, onChange, icon})=>(
  <View style={{flexDirection:'row', borderWidth:1, borderColor:'grey', marginHorizontal:30, marginTop:15}}>
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
            height:36,
            flex:1,
            fontSize:13,
            backgroundColor:'white',
        }}
    />
    <View style={{backgroundColor:commonColors.lightTheme, width:50, justifyContent:'center', alignItems:'center'}}>
      <Ionicons name={icon} size={30} color={commonColors.theme}/>
    </View>
  </View>
)

export default class Register extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          email:'',
          name:'',
          password: '',
          confirmPassword: '',
          phone_number:'',
          country:''
        }
    }

    SignUp(){
      let {email, password, confirmPassword, name, phone_number, country} = this.state;
      API.Register(name, email, password, phone_number, country, (err, res) => {
        if (err == null){
          Actions.Main();
        } else {
          Alert.alert(JSON.stringify(err));
        }
      });
    }

    Forgot(){

    }

    render(){
        return(
          <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
            <View style={styles.container}>
              <ScrollView>
                <Image source={commonStyles.register} style={styles.image}/>
                <View style={{width:'100%', height:180, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:20, color:'white'}}>Register Now</Text>
                  <Text style={{fontSize:12, color:'white', paddingHorizontal:50, textAlign:'center', marginTop:10}}>Complete the form below to register and create an account.</Text>
                </View>
                <View style={{marginTop:20}}>
                  <Inputer placeholder="Full Name" value={this.state.name} onChange={(name)=>this.setState({name})} icon="ios-person-outline"/>
                  <Inputer placeholder="Email" value={this.state.email} onChange={(email)=>this.setState({email})} icon="ios-mail-outline"/>
                  <Inputer placeholder="Password" value={this.state.password} onChange={(password)=>this.setState({password})} icon="ios-lock-outline"/>
                  <Inputer placeholder="Confirm Password" value={this.state.confirmPassword} onChange={(confirmPassword)=>this.setState({confirmPassword})} icon="ios-lock-outline"/>
                  <Inputer placeholder="Phone Number" value={this.state.phone_number} onChange={(phone_number)=>this.setState({phone_number})} icon="ios-call-outline"/>
                  <Inputer placeholder="Country" value={this.state.country} onChange={(country)=>this.setState({country})} icon="ios-flag-outline"/>
                  <TouchableOpacity onPress={()=>this.SignUp()} style={{backgroundColor:commonColors.theme, height:50, marginHorizontal:30, marginTop:30, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:18, color:'white'}}>Sign Up</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:20, marginTop:30}}>
                    <Text style={{fontSize:13, color:'grey'}}>Already a Member?</Text>
                    <Text style={{color:commonColors.theme, fontSize: 15, marginLeft:5}} onPress={()=>Actions.Signin()}>Sign In</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    image:{
        position:'absolute',
        top:0,
        left:0,
        width:commonStyles.screenWidth,
        height:commonStyles.screenHeight,
        resizeMode:'cover',
    }

})
