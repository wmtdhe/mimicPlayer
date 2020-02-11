import React,{useState,useEffect} from 'react';
import {Switch, Link, Route} from "react-router-dom";
import '../css/home.css';
import PersonalRec from "./home_components/PersonalRec";

function HomeNav(props) {
    return(
        <div className='home-nav'>
            <ul>
                <Link to='/'><li className='nav-active'>个性推荐</li></Link>
                <Link to='/songlist'><li>歌单</li></Link>
                <Link to='/podcast'><li>主播电台</li></Link>
                <Link to='/ranking'><li>排行榜</li></Link>
                <Link to='/singer'><li>歌手</li></Link>
                <Link to='/latest'><li>最新音乐</li></Link>
            </ul>
        </div>
    )
}

function Home(props) {
    return(
        <div className='home-frame'>
            <HomeNav/>
            <Switch>
                <Route path='/' ><PersonalRec dbClick={props.dbClick} songList={props.songList}/></Route>
            </Switch>
        </div>
    )
}
export default Home