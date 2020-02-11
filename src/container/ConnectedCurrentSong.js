import {connect} from 'react-redux'
import {closeSongPage} from "../action/action";
import CurrentSong from "../components/CurrentSong";

const mapStateToProps = (state,ownProps) =>({
    current:state.songList[state.playing], //song information
    playing:state.playStatus,//play or pause
    progress:state.progress
})

const mapDispatchToProps = (dispatch,ownProps)=>({
    closePage:()=>{dispatch(closeSongPage())}
})


export default connect(mapStateToProps,mapDispatchToProps)(CurrentSong)