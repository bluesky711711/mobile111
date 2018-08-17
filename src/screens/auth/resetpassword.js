
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
    KeyboardAvoidingView,
    Alert,
    ImageBackground,
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';
import API from '../../service/Api'
import Cache from '../../utils/cache';
import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'
import { LinearGradient } from "expo";
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

export default class ResetPassword extends PureComponent{
    constructor(props){
        super(props)
        this.state={
          password: '',
          confirmPassword: '',
        }
    }

    Reset(){
      let { password, confirmPassword} = this.state;
      if (password != confirmPassword) {
        Alert.alert('please input password correctly!');
        return;
      }
      if (password == ''){
        Alert.alert('password is empty!');
        return;
      }
      if (Cache.currentUser){
      API.ResetPassword(Cache.currentUser.id, password, (err, res) => {
        if (err == null){
          Alert.alert('password successfully updated!');
        } else {
          Alert.alert(JSON.stringify(err));
        }
      });
      }
    }



    render(){
        return(
          <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
            <View style={styles.container}>

              <LinearGradient
                colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                start={[0.0, 0.0]}
                end={[1.0, 0.0]}
                style={{ height: 120, width: '100%', borderBottomColor:'grey', borderBottomWidth:1 }}
              >
                <View style={{flexDirection:'row', marginTop:40, marginLeft:15}}>
                  <Ionicons name="ios-menu" size={24} color={'white'} onPress={()=>Actions.pop()} />
                  <Text style={{fontSize:20, color:'white',marginLeft:15}}>Reset Password</Text>
                </View>
              </LinearGradient>

              <ScrollView style={{flex:1}}>
              <View style={{marginTop:50}}>
                <View style={{alignItems:'center', paddingHorizontal:0, marginTop:10}}>
                  <Inputer placeholder="Password" value={this.state.password} onChange={(password)=>this.setState({password})} icon="ios-lock-outline"/>
                  <Inputer placeholder="Confirm Password" value={this.state.confirmPassword} onChange={(confirmPassword)=>this.setState({confirmPassword})} icon="ios-lock-outline"/>
                </View>
                <View style={{marginTop:10, justifyContent:'center', marginHorizontal:20}}>
                    <TouchableOpacity onPress={()=>this.Reset()}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                      <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        Reset Password
                      </Text>
                    </LinearGradient>
                    </TouchableOpacity>
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
        backgroundColor: commonColors.background,
    }
    })
