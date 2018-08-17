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
    KeyboardAvoidingView,
    Alert,
    Image,
    Clipboard,
    Modal
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import {Ionicons} from '@expo/vector-icons';

import * as commonColors from '../../styles/commonColors'
import * as commonStyles from '../../styles/commonStyles'
import API from '../../service/Api'
import Cache from '../../utils/cache';
import RNPickerSelect from 'react-native-picker-select';

import { LinearGradient } from "expo";

const Inputer = ({placeholder, value, onChange, editable})=>(
    <TextInput
        placeholder={placeholder}
        placeholderTextColor={commonColors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        value={value}
        editable = {editable}
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

const ShowItemList = ({items, onPress, copy})=>(
  <View>
    {items.map((item, index)=>{
      return (
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={()=>onPress(item, index)} style={{flexDirection:'row', height:34, marginTop:8, borderRadius:10, backgroundColor:commonColors.lightTheme, paddingHorizontal:10, alignItems:'center'}}>
            <Image source={commonStyles.icon} style={{width:30, height:30}}/>
            <View style={{flex:1, marginLeft:15}}>
              <View style={{flexDirection:'row', width:'100%'}}>
                <Text style={{fontSize:13, color:'#333', flex:1}}>{item.title}</Text>
                <TouchableOpacity onPress={()=>copy(item.redeem_code)}>
                    <Text style={{fontSize:11, color:'#63a5fd'}}>Copy RedeemCode</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', width:'100%'}}>
                <Text style={{fontSize:12, color:'#333'}}>{item.amount} ATHA</Text>
              </View>
            </View>
        </TouchableOpacity>
      )
    })}
  </View>
)


export default class GiveRedeem extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            award_amount: '100',
            award_title: '',
            award_description: '',
            atha_balance:'0.00',
            atha_usd_amount: '0.00',
            eth_balance: 0,
            eth_usd_unit: 0,
            type:0,
            redeemList:[],
            eth_amount: '0',
            submitting: false,
            showModal: false
        }
        this.amount_list=[
          {label:'100', value:'100'},
          {label:'1000', value:'1000'},
          {label:'10000', value:'10000'},
          {label:'20000', value:'20000'},
          {label:'30000', value:'30000'},
          {label:'40000', value:'40000'},
          {label:'50000', value:'50000'},
        ]
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
    updateBalance(){
       if (Cache.currentUser){
        API.getAthaBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let atha_balance = parseFloat(res.balance.replace(',', ''));
             API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * atha_balance * 0.00000160;
              let min_usd_price = price_usd * 0.00000160;
              this.setState({atha_usd_amount:usd_value.toFixed(4), eth_usd_unit:price_usd});
            })
            this.setState({atha_balance:atha_balance.toFixed(8)});
          } else {
            Alert.alert(error);
          }
        });
         API.getEthBalance(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let eth_balance = parseFloat(res.balance);
            this.setState({eth_balance:eth_balance.toFixed(8)});
            API.getEthPrice((error, res) => {
              let price_usd = res[0].price_usd;
              let usd_value = price_usd * eth_balance;
              let minUSD =  this.state.minETH * price_usd;
              this.setState({eth_usd_price:usd_value.toFixed(4), minUSD:minUSD});
            })
          } else {
            Alert.alert(error);
          }
        });
        API.sent_redeems(Cache.currentUser.id, (error, res) => {
         if (error == null){
           this.setState({redeemList:res.res});
         } else {
           Alert.alert(error);
         }
        });
      } else {
        Alert.alert('none current user');
      }
    }

    componentDidMount(){
      this.updateBalance();
      //setInterval(()=>this.updateBalance(), 10000);
    }

    submit(){
      if (this.state.submitting == true) return;

      this.state.submitting = true;
      if (this.state.award_amount < 100) {
          this.state.submitting = false;
          Alert.alert('please select ATHA amount!')
          return;
      }
      if (this.state.award_title ==  '') {
          this.state.submitting = false;
          Alert.alert('please input title!')
          return;
      }
      if (Cache.currentUser){
        API.getGas(Cache.currentUser.id, (error, res) => {
          if (error == null){
            let gasfee = parseFloat(res.gasdata.gasfee);
            let eth_amount = gasfee + this.state.eth_amount;
            if (eth_amount > this.state.eth_balance) {
              Alert.alert('You have not enough Balance for this transaction');
              return;
            }
            API.give_redeem(Cache.currentUser.id, this.state.award_amount, this.state.eth_amount, this.state.award_title, this.state.award_description, (err, res)=>{
              if (err == null){
                // Alert.alert('Redeem  Code  Created.  Please  visit  History  Tab  to  copy  and  send  the  code.');                
                this.setState({showModal: true, alertText:'Redeem  Code  Created.  Please  visit  History  Tab  to  copy  and  send  the  code.'})
                this.state.submitting = false;
                setTimeout(()=>this.updateBalance(), 1000);
              } else {
                this.state.submitting = false;
                Alert.alert(err);
              }
            });
          } else {
            this.state.submitting = false;
            Alert.alert('cannot calc gas fee now, try it later!');
          }
        });
      } else {
        this.state.submitting = false;
        Alert.alert('please login again!');
      }
    }

    setAmount(value){
      let eth_amount = 0;
      if (this.state.atha_balance >= value){
        eth_amount = value * 2 * 0.00000153 / 100;
      } else {
        rest_value = value * 102 / 100 - this.state.atha_balance;
        eth_amount = rest_value * 0.00000153;
      }
      //Alert.alert(eth_amount.toString());
      this.setState({
        award_amount: value,
        eth_amount:eth_amount.toString()
      });
    }

    copy(address){
      Clipboard.setString(address)
      Alert.alert('Redeem code copied to clipboard!');
    }

    render(){
        return(
            <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
            <ScrollView>
            <ImageBackground source={commonStyles.background} style={styles.container}>
              <View style={{flex:1}}>
                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                <LinearGradient
                  colors={[commonColors.color1, commonColors.color2, commonColors.color3]}
                  start={[0.0, 0.0]}
                  end={[1.0, 0.0]}
                  style={{ height: 120, width: '80%', borderRadius: 10, marginTop:30 }}
                >
                  <Text style={{fontSize:12, color:'white', marginLeft:15, marginTop:10}}>Current Balance</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>ATHA</Text>
                  <Text style={{fontSize:24, color:'white', width:'100%', textAlign:'center', fontWeight:'bold'}}>{this.state.atha_balance}</Text>
                  <Text style={{fontSize:15, color:'white', width:'100%', textAlign:'center'}}>${this.state.atha_usd_amount} USD</Text>
                </LinearGradient>
              </View>
              <View style={{height:this.state.type==0?600:32, marginTop:50, borderTopLeftRadius:30, borderTopRightRadius:30, backgroundColor:commonColors.lightTheme,marginHorizontal:this.state.type==0?0:20}}>
                <View style={{backgroundColor:commonColors.lightTheme, justifyContent:'center', flexDirection:'row', alignItems:'center', height:34, borderTopLeftRadius:20, borderTopRightRadius:20, paddingHorizontal:10}}>
                    <TouchableOpacity onPress={()=>this.setState({type:0})} style={{borderBottomWidth:2, borderBottomColor:this.state.type==0?commonColors.theme:'white', paddingBottom:5}}>
                      <Text style={{fontSize:12, color:commonColors.theme, width:70, textAlign:'center'}}>Give</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.setState({type:1})}} style={{borderBottomWidth:2, borderBottomColor:this.state.type==1?commonColors.bColor3:'white', paddingBottom:5}}>
                      <Text style={{fontSize:12, color:commonColors.bColor3, width:70, textAlign:'center'}}>History</Text>
                    </TouchableOpacity>
                  </View>
                {this.state.type==0&&<View style={{alignItems:'center', paddingHorizontal:20, marginTop:10}}>
                  {/* <Text style={{fontSize:10, color:'#333', textAlign:'center'}}>If You Want To give ATHA, please make redeem to get redeem code here.</Text>
                  <Text style={{fontSize:10, color:'#333', textAlign:'center'}}>You should have some ETH for transaction fee.</Text> */}
                  <Inputer placeholder="AWARD TITLE" value={this.state.award_title} editable={true} onChange={(award_title)=>this.setState({award_title})}/>
                  <Inputer placeholder="AWARD DESCRIPTION" value={this.state.award_description} editable={true} onChange={(award_description)=>this.setState({award_description})}/>
                  {/* <Inputer placeholder="AWARD AMOUNT" value={this.state.award_amount} onChange={(award_amount)=>this.setState({award_amount})}/> */}
                  <RNPickerSelect
                    placeholder={{
                        label: 'Select a amount...',
                        value: null,
                    }}
                    items={this.amount_list}
                    onValueChange={(value) => {
                      this.setAmount(value);
                    }}
                    style={{ ...pickerSelectStyles }}
                />
              <Inputer placeholder="ETH Amount Required" editable={false}  value={this.state.eth_amount} onChange={(eth_amount)=>this.setState({eth_amount})}/>
                <View style={{marginTop:10, justifyContent:'center', marginHorizontal:20, width:'100%'}}>
                    <TouchableOpacity onPress={()=>this.submit()}>
                    <LinearGradient
                      colors={[commonColors.bColor1, commonColors.bColor2, commonColors.bColor3]}
                      start={[0.0, 0.0]}
                      end={[1.0, 0.0]}
                      style={{ height: 44, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                    >
                      <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>
                        Confirm
                      </Text>
                    </LinearGradient>
                    </TouchableOpacity>
                </View>
                </View>}
              </View>
              {this.state.type==1&&<ScrollView style={{marginTop:8, paddingHorizontal:20, marginBottom:30}} showsVerticalScrollIndicator={false}>
                    <ShowItemList items={this.state.redeemList} onPress={(item, index)=>{Actions.RedeemInfo({item})}}
                      copy={(address)=>this.copy(address)}/>
                </ScrollView>}
              </View>
              </ImageBackground>
              </ScrollView>
              {this.renderModal()}
              </KeyboardAvoidingView>
            </View>
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      // paddingTop: 13,
      paddingHorizontal: 10,
      // paddingBottom: 12,
      // borderWidth: 1,
      // borderColor: 'gray',
      height:36,
      borderRadius: 4,
      backgroundColor: 'white',
      color: 'black',
      marginTop:10,
  },
  inputAndroid: {
      fontSize: 16,
      // paddingTop: 13,
      paddingHorizontal: 10,
      // paddingBottom: 12,
      // borderWidth: 1,
      // borderColor: 'gray',
      height:36,
      borderRadius: 4,
      backgroundColor: 'white',
      color: 'black',
      marginTop:10,
  },
});
