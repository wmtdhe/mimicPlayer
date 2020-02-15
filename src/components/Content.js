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
import SongComment from "./SongComment";

function Content(props) {
    return(
        <div className='content-frame'>
            {props.openPage && <ConnectedCurrentSong/>}
           <ConnectedSide/>
           <Switch>
                   <Route path='/search'  component={ConnectedSearch}/>
                <Route path='/songlist/detail' exact component={ConnectedSongList}/>
               <Route path='/songcomment' exact component={SongComment}/>
               <Route path='/album' exact component={ConnectedSongList}/>
               <Route path='/' component={ConnectedHome}/>
           </Switch>
        </div>
    )
}
export default Content;