import {connect} from 'react-redux';
import Player from "../components/Player";
import {deleteAll, playsong, openSongPage, switchStatus, timeUpdate,addAll,deleteSong} from "../action/action";

const mapStateToProps = (state,ownProps)=>{
    // let saved = localStorage.getArr('local')
    let ownList,user
    user = state.logStatus?state.logStatus.account.id:null
    ownList = state.sublists?state.sublists.filter((v,i)=>{
        return v.userId == user
    }):null
    return{
    songSrc:state.playing!==null?state.songList[state.playing]:'',
    songList:state.songList,
    songIndex:state.playing,
    user:user,
    ownList:ownList
}}

const mapDispatchToProps = (dispatch,ownProps)=>({
    deleteAll:()=>{dispatch(deleteAll()); dispatch(playsong(null))},
    playSong:(obj,i)=>{dispatch(playsong(i))}, //put the song to the bottom of the list
    openSongPage:()=>{dispatch(openSongPage())},
    playPause:(status)=>{dispatch(switchStatus(status))},
    newProgress:(t)=>{dispatch(timeUpdate(t))},
    addAll:(songs)=>{dispatch(addAll(songs))},// for first time load retrieving local history?/\/\
    deleteSong:(i)=>{dispatch(deleteSong(i))}
})

export default connect(mapStateToProps,mapDispatchToProps)(Player)