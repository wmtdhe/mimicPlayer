import {connect} from 'react-redux';
import Home from "../components/Home";
import {addSong,playsong} from "../action/action";

const mapStateToProps = (state,ownProps)=>({
    songList:state.songList
})

const mapDispatchToProps = (dispatch,ownProps)=>({
        dbClick:(songObj,i)=>{
            dispatch(addSong(songObj))
            dispatch(playsong(i))
        }
})

export default connect(mapStateToProps,mapDispatchToProps)(Home)