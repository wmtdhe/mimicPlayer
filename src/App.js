import React, {useEffect, useState} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Header from "./components/Header";
import ConnectedPlayer from "./container/ConnectedPlayer";
import './css/main.css';
import ConnectedContent from "./container/ConnectedContent";
import ConnectedHeader from "./container/ConnectedHeader";




function App(props) {
    let firstOpen = useState(true)
    useEffect(function () {
        document.title = 'Music Player'
    },[])
    return(
        //pass location props to searchBar
        <Router>
        <div className='layout'>
            <Route path='/' component={ConnectedHeader}></Route>
            <ConnectedContent/>
            <ConnectedPlayer/>
        </div>
        </Router>
    )
}

export default App;