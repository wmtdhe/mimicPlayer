import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from "redux";
import App from './App.js';
import musicBase from "./reducer/reducer";
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000'; //global setting
axios.defaults.withCredentials = true;

const store = createStore(musicBase)
Storage.prototype.setArr = function (key,arr) {
    this.setItem(key,JSON.stringify(arr))
}
Storage.prototype.getArr = function (key) {
    let ret = this.getItem(key)
    return ret && JSON.parse(ret)
}

let unsub = store.subscribe(()=>{console.log(store.getState())})
render(<Provider store={store}>
    <App/>
</Provider>,document.getElementById('root'))
