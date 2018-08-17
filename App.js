import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import {Actions, ActionConst, Scene, Router} from 'react-native-router-flux'

import Signin from './src/screens/auth/signin'
import Register from './src/screens/auth/register'
import Forgot from './src/screens/auth/forgot'
import ResetPassword from './src/screens/auth/resetpassword'
import Main from './src/screens/main'
import Voting from './src/screens/voting'
import Redeem from './src/screens/redeem'

import Sell from './src/screens/sell'
import Buy from './src/screens/buy'
import Wallet from './src/screens/wallet'

import CloseEvent from './src/screens/voting/closeEvent'
import LiveEvent from './src/screens/voting/liveEvent'
import PostEvent from './src/screens/voting/postEvent'
import IncludeTop from './src/screens/voting/includeTop'
import Describe from './src/screens/voting/describe'
import CloseResult from './src/screens/voting/closeResult'
import ConfirmVote from './src/screens/voting/confirmVote'
import RedeemInfo from './src/screens/redeem/redeemInfo'
import Send from './src/screens/wallet/send'
import ScanQRCode from './src/screens/wallet/scanQR'
import Received from './src/screens/wallet/received'

import Confirm from './src/screens/buy/confirm'

export default class App extends Component {
  render() {
    const scenes = Actions.create(
      <Scene key="root">
          <Scene key="Signin" component={Signin} type={ActionConst.RESET} hideNavBar/>
          <Scene key="Register" component={Register} hideNavBar/>
          <Scene key="Forgot" component={Forgot} hideNavBar/>
          <Scene key="ResetPassword" component={ResetPassword} hideNavBar/>
          <Scene key="Main" component={Main} type={ActionConst.RESET} hideNavBar/>

          <Scene key="Voting" component={Voting} hideNavBar/>
          <Scene key="Redeem" component={Redeem} hideNavBar/>
          <Scene key="RedeemInfo" component={RedeemInfo} hideNavBar/>
          <Scene key="Sell" component={Sell} hideNavBar/>
          <Scene key="Buy" component={Buy} hideNavBar/>
          <Scene key="Wallet" component={Wallet} hideNavBar/>

          <Scene key="CloseEvent" component={CloseEvent} hideNavBar/>
          <Scene key="LiveEvent" component={LiveEvent} hideNavBar/>
          <Scene key="PostEvent" component={PostEvent} hideNavBar/>
          <Scene key="IncludeTop" component={IncludeTop} hideNavBar/>
          <Scene key="Describe" component={Describe} hideNavBar/>
          <Scene key="CloseResult" component={CloseResult} hideNavBar/>
          <Scene key="ConfirmVote" component={ConfirmVote} hideNavBar/>

          <Scene key="Received" component={Received} hideNavBar/>
          <Scene key="Send" component={Send} hideNavBar/>
          <Scene key="ScanQRCode" component={ScanQRCode} hideNavBar/>

          <Scene key="Confirm" component={Confirm} hideNavBar/>

      </Scene>)
    return (
      <Router hideNavBar scenes={scenes}/>
    );
  }
}
