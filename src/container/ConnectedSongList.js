import {connect} from 'react-redux'
import {playsong, addAll, addSong,deleteAll,subscribe,unsubscribe} from "../action/action"; //addSong/addAll ---- 添加到播放列表, playsong --- 播放
import SongList from "../components/SongList";


const mapStateToProps = (state,ownProps)=>({
    songListLen:state.songList.length,
    playing:state.playing,
    songList:state.songList, //播放列表
    status:state.logStatus,
    sublist:state.sublists, //订阅
}) // ret is an obj

const mapDispatchToProps = (dispatch,ownProps)=>({
    addAllSong:(songs,i)=>{dispatch(addAll(songs,i))},// +, i - entry point, currently playing song's index
    dbClick:(songs,i)=>{ //播放全部
        dispatch(addAll(songs))
        dispatch(playsong(i))
    },
    playExistingSong:(i)=>{
        dispatch(playsong(i))
    },
    cleanList:()=>{
        dispatch(deleteAll())
    },
    subscribe:(list,f)=>{dispatch(subscribe(list,f))},
    unsubscribe:(id)=>{dispatch(unsubscribe(id))}
})

export default connect(mapStateToProps,mapDispatchToProps)(SongList)