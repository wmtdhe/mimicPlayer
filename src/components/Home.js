import React,{useState,useEffect} from 'react';
import {Switch, Link, Route} from "react-router-dom";
import '../css/home.css';
import PersonalRec from "./home_components/PersonalRec";
import Playlist from './home_components/Playlist'

function HomeNav(props) {
    return(
        <div className='home-nav'>
            <ul>
                <Link to='/'><li className={props.location.pathname==='/'?'nav-active':''}>个性推荐</li></Link>
                <Link to='/playlist'><li className={props.location.pathname==='/playlist'?'nav-active':''}>歌单</li></Link>
                <Link to='/podcast'><li className={props.location.pathname==='/podcast'?'nav-active':''}>主播电台</li></Link>
                <Link to='/ranking'><li className={props.location.pathname==='/ranking'?'nav-active':''}>排行榜</li></Link>
                <Link to='/singer'><li className={props.location.pathname==='/singer'?'nav-active':''}>歌手</li></Link>
                <Link to='/latest'><li className={props.location.pathname==='/latest'?'nav-active':''}>最新音乐</li></Link>
            </ul>
        </div>
    )
}

function Home(props) {
    return(
        <div className='home-frame'>
            <Route path='/' component={HomeNav}></Route>
            <Switch>
                <Route path='/' exact><PersonalRec dbClick={props.dbClick} songList={props.songList}/></Route>
                <Route path='/playlist' exact component={Playlist}></Route>
            </Switch>
        </div>
    )
}
export default Home