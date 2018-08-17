import {
    AsyncStorage,
    Platform,
    Alert
} from 'react-native';
import * as async from 'async';
const backendURL = 'http://108.161.151.117:3000/api/';
const API_KEY = "ATHA_API_KEY_1.0";
import UtilService from '../utils/utils';
import Cache from '../utils/cache';

module.exports = {
    async Init(cb) {
        //check if current user exists or not
        var email = await UtilService.getLocalStringData('email');
        var password = await UtilService.getLocalStringData('password');

        if (password) {
            this.login(email, password, (err, user) => {
                cb(err, user)
            })
        } else {
            cb(null)
        }
    },
    Login(email, password, cb) {
        this.baseApi('login', 'POST', { email, password }, (err, res) => {
            if (err == null) {
                Cache.currentUser = res.user;
                UtilService.saveLocalStringData('email', email);
                UtilService.saveLocalStringData('password', password);
            }
            cb(err, res)
        });
    },
    Logout() {
        Cache.currentUser = null;
        UtilService.removeLocalObjectData('email')
        UtilService.removeLocalObjectData('password')
    },
    Register(name, email, password,  phone_number, country, cb) {
      this.baseApi('register', 'POST', {name, email, password,  phone_number, country}, (err, res) => {
            if (err == null) {
                Cache.currentUser = res.user;
                UtilService.saveLocalStringData('email', email);
                UtilService.saveLocalStringData('password', password);
            }
            cb(err, res)
      });
    },
    ResetPassword(user_id, password, cb){
      this.baseApi('resetpassword', 'POST', {user_id, password}, cb);
    },
    Forgot(email, cb){
      this.baseApi('forgot', 'POST', {email}, cb);
    },
    getEthTransactions(user_id, cb){
      this.baseApi('get_transaction_history', 'POST', {user_id}, cb);
    },
    getEventLogs(user_id, action, cb){
      this.baseApi('get_logs', 'POST', {user_id, action}, cb);
    },
    getEthBalance(user_id, cb){
      this.baseApi('get_eth_balance', 'POST', {user_id}, cb);
    },
    getAthaBalance(user_id, cb){
      this.baseApi('get_atha_balance', 'POST', {user_id}, cb);
    },
    getGasFee(user_id, cb){
      this.baseApi('get_gas', 'POST', {user_id}, cb);
    },
    getEvents(status, keyword, sport, cb){
      this.baseApi('get_events', 'POST', {status, keyword, sport}, cb);
    },
    getParticipants(event_id, cb){
      this.baseApi('get_participants', 'POST', {event_id}, cb);
    },
    getTopAthletes(event_id, cb){
      this.baseApi('get_top_athletes', 'POST', {event_id}, cb);
    },
    getTopFans(event_id, cb){
      this.baseApi('get_top_fans', 'POST', {event_id}, cb);
    },
    getSellingRequest(user_id, cb){
      this.baseApi('get_selling_request', 'POST', {user_id}, cb);
    },
    sendEth(user_id, to_address, to_amount, cb){
      this.baseApi('send_eth', 'POST', {user_id, to_address, to_amount}, cb);
    },
    sendATHA(user_id, to_address, to_amount, cb){
      this.baseApi('send_atha', 'POST', {user_id, to_address, to_amount}, cb);
    },
    getGas(user_id, cb){
      this.baseApi('get_gas', 'POST', {user_id}, cb);
    },
    submitVote(fan_id, part_id, event_id, vote_amount, cb){
      this.baseApi('submit_vote', 'POST', {fan_id, part_id, event_id, vote_amount}, cb);
    },
    setSellingRequest(seller_id, selling_amount, selling_price, cb){
      this.baseApi('set_selling_request', 'POST', {seller_id, selling_amount, selling_price}, cb);
    },
    setBuyingRequest(buyer_id, request_id, cb){
      this.baseApi('set_buying_request', 'POST', {buyer_id, request_id}, cb);
    },
    sent_redeems(user_id, cb){
      this.baseApi('sent_redeems', 'POST', {user_id}, cb);
    },
    received_redeems(user_id, cb){
      this.baseApi('received_redeems', 'POST', {user_id}, cb);
    },
    give_redeem(user_id, atha_amount, eth_amount, title, description, cb){
      this.baseApi('give_redeem', 'POST', {user_id, atha_amount, eth_amount, title, description}, cb);
    },
    get_redeem(user_id, redeem_code, cb){
      this.baseApi('get_redeem', 'POST', {user_id, redeem_code}, cb);
    },
    get_winner_fan_amount_by_event(event_id, cb){
      this.baseApi('get_winner_fan_amount_by_event', 'POST', {event_id}, cb);
    },
    get_winner_part_amount_by_event(event_id, cb){
      this.baseApi('get_winner_part_amount_by_event', 'POST', {event_id}, cb);
    },
    async getEthPrice(cb){
      try {
            let request = {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
            }
            let response = await fetch('https://api.coinmarketcap.com/v1/ticker/ethereum', request);
            let responseJson = await response.json();

            if (response.status == 200) {
                if (responseJson.status == 'failed'){
                  cb(response.status, null)
                } else {
                  cb(null, responseJson);
                }
            } else {
                cb(response.status);
            }
        } catch (error) {
            cb(error)
        }
    },
    async uploadFile(file, cb) {
        try {
            let image = {
                uri: file,
                type: 'image/jpeg',
                name: 'file.jpeg'
            }

            let formData = new FormData();
            formData.append('avatar', image);
            let response = await fetch(backendURL + '/upload/image',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        //'Authorization': 'Bearer ' + Cache.currentUser['token'],
                    },
                    body: formData
            });

            let status = response.status

            let responseJson = await response.json();
            if (status == 200) {
                cb(null, responseJson);
            } else {
                cb(responseJson.message)
            }
        } catch (error) {
            cb(error)
        }
    },
    async baseApi(sub_url, method, json_data, cb) {
        try {
            let request = {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
            }
            if (method == 'POST' || method == 'PUT') {
                json_data['api_key'] = API_KEY;
                request['body'] = JSON.stringify(json_data);
            }
            let response = await fetch(backendURL + sub_url, request);
            let responseJson = await response.json();

            if (response.status == 200) {
                if (responseJson.status == 'failed'){
                  cb(responseJson.message, null)
                } else {
                  cb(null, responseJson);
                }
            } else {
                cb(responseJson.message);
            }
        } catch (error) {
            cb(error)
        }
    },
}
