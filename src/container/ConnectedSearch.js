import {connect} from 'react-redux';
import {addSong, playsong} from "../action/action";
import Search from "../components/Search";

const mapStateToProps = (state,ownProps)=>({
        songList:state.songList,
        playing:state.playing
})

const mapDispatchToProps = (dispatch,ownProps)=>(
    {
        dbClick:(songObj,i)=>{
            dispatch(addSong(songObj))
            dispatch(playsong(i))
        },
        playExistingSong:(i)=>{
            dispatch(playsong(i))
        }
    }
)

export default connect(mapStateToProps,mapDispatchToProps)(Search)