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
    Image,
    Alert,
    Clipboard,
    Modal
} from 'react-native'
import API from '../../service/Api'
import Cache from '../../utils/cache';
import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';

import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'


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
            height:36,
            width:'100%',
            fontSize:13,
            backgroundColor:'white',
            borderRadius:5,
            marginTop:10
        }}
    />
)


const ShowItemList = ({items, onPress, copy1, copy2})=>(
  <View>
    {items.map((item, index)=>{
      return (
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={()=>onPress(item, index)} style={{flexDirection:'row', height:44, marginTop:8, borderRadius:10, backgroundColor:commonColors.lightTheme, paddingHorizontal:10, alignItems:'center'}}>
            <Image source={commonStyles.icon} style={{width:30, height:30}}/>
            <View style={{flex:1, marginLeft:15}}>
              <View style={{flexDirection:'row', width:'100%'}}>
                <Text style={{fontSize:13, color:'#333', flex:1}}>{item.amount} ATHA</Text>
                  <TouchableOpacity onPress={()=>{}}>
                      <Text style={{fontSize:11, color:'#63a5fd'}}></Text>
                  </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', width:'100%'}}>
                <Text style={{fontSize:11, color:'grey', flex:1}}>{item.updated_at}</Text>
                  <TouchableOpacity onPress={()=>{}}>
                      <Text style={{fontSize:11, color:'#63a5fd'}}></Text>
                  </TouchableOpacity>
              </View>
            </View>
        </TouchableOpacity>
      )
    })}
  </View>
)

export default class GetRedeem extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            redeemList:[],
            redeem_code:'',
            showModal: false,
            alertText:''
        }
    }

    updateBalance(){
      if (Cache.currentUser){
         API.received_redeems(Cache.currentUser.id, (error, res) => {
           if (error == null){
             this.setState({redeemList:res.res})
           } else {
             Alert.alert(error);
           }
         });
      } else {
        Alert.alert('none current user');
      }
    }

    renderModal() {
      return (
      <Modal
        visible={this.state.showModal}
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={{flex:1, padding:5, width:'100%'}}>
              <Text style={{fontSize:15, color:'grey',margin:10, textAlign:'center'}}>{this.state.alertText}</Text>
            </View>
            <View style={{height:36, flexDirection:'row', width:'100%', borderBottomRightRadius:5, borderBottomLeftRadius:5, overflow:'hidden', borderTopWidth:1, borderTopColor:'#ccc'}}>
              <TouchableOpacity onPress={()=>this.setState({showModal:false})} style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'rgb(249,249,249)'}}>
                <Text style={{color:commonColors.theme, fontSize:13}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
   }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }

    copy1(address){
      Clipboard.setString(address)
      Alert.alert('Target Address copied to clipboard!');
    }

    copy2(address){
      Clipboard.setString(address)
      Alert.alert('Private key copied to clipboard!');
    }

    submit(){
      if (this.state.redeem_code == ''){
        this.setState({showModal: true, alertText:'Please input redeem code!'});
        return;
      }
      if (Cache.currentUser){
         API.get_redeem(Cache.currentUser.id, this.state.redeem_code, (error, res) => {
           if (error == null){
             this.setState({showModal: true, alertText:'You have claimed your Athleticoin! Please check below for your wallet details.'});
             setTimeout(()=>this.updateBalance(), 2000);
           } else {
             this.setState({showModal: true, alertText:error});             
           }
         });
      } else {
        Alert.alert('none current user');
      }
    }

    render(){
        return(
          <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <View style={styles.container}>
              <ImageBackground source={commonStyles.background} style={styles.container}>
                <View style={{justifyContent:'center', alignItems:'center', width:'100%', paddingHorizontal:20, marginTop:30}}>
                  <Inputer placeholder="REDEEM CODE" value={this.state.redeem_code} onChange={(redeem_code)=>this.setState({redeem_code})}/>
                </View>
                <View style={{marginTop:20, justifyContent:'center', marginHorizontal:20}}>
                    <TouchableOpacity onPress={()=>this.submit()}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                      <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        Redeem
                      </Text>
                    </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{margin:30, flex:1}}>
                  <View style={{backgroundColor:commonColors.lightTheme, justifyContent:'center', flexDirection:'row', alignItems:'center', height:34, borderTopLeftRadius:20, borderTopRightRadius:20, paddingHorizontal:10}}>
                    <Text style={{fontSize:12, color:'red', flex:1}}>Your Redeem List</Text>
                  </View>
                  <ScrollView style={{marginTop:8}} showsVerticalScrollIndicator={false}>
                    <ShowItemList items={this.state.redeemList} onPress={(item, index)=>{Actions.RedeemInfo({item})}}
                      copy1={(address)=>this.copy1(address)} copy2={(address)=>this.copy2(address)}/>
                  </ScrollView>
                </View>
              </ImageBackground>
              {this.renderModal()}
            </View>
          </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: commonColors.background,
    },
    modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    width: 250,
    height:130,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation:3,
  }
})
