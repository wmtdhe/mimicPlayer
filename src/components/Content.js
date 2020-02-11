import React from "react";
import Home from "./Home";
import Side from "./Side";
import ConnectedSearch from "../container/ConnectedSearch";
import {Switch, Route} from "react-router-dom";
import '../css/content.css';
import ConnectedCurrentSong from "../container/ConnectedCurrentSong";
import SongList from "./SongList";
import ConnectedSongList from "../container/ConnectedSongList";
import ConnectedSide from "../container/ConnectedSide";
import ConnectedHome from "../container/ConnectedHome";

function Content(props) {
    return(
        <div className='content-frame'>
            {props.openPage && <ConnectedCurrentSong/>}
           <ConnectedSide/>
           <Switch>
                   <Route path='/' exact component={ConnectedHome}></Route>
                    <Route path='/search'  component={ConnectedSearch}></Route>
               <Route path='/songlist/detail' exact component={ConnectedSongList}></Route>
           </Switch>
        </div>
    )
}
export default Content;