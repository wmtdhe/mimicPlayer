import {connect} from 'react-redux'
import Side from '../components/Side'
import {subscribe,unsubscribe,addAll,playsong,deleteAll} from "../action/action";

const mapStateToProps = (state,ownProps)=>{
    return {
        sublists:state.sublists,
        status:state.logStatus?true:false,
        playing:state.playing!==null?true:false,
        userId:state.logStatus?state.logStatus.account.id:null,
        songList:state.songList
    }
}

const mapDispatchToProps = (dispatch,ownProps)=>{
    return {
        create:(playlist,f,c)=>{dispatch(subscribe(playlist,f,c))},
        delete:(index)=>{dispatch(unsubscribe(index))},
        play:(songs)=>{ // same as playAll in songlist page
            dispatch(deleteAll())
            dispatch(addAll(songs))
            dispatch(playsong(0))
        },
        nextPlay:(songs,i)=>{ //same as + in songlist page
            dispatch(addAll(songs,i))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Side)