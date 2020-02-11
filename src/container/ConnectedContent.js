import {connect} from 'react-redux';
import Content from "../components/Content";
import {openSongPage} from "../action/action";


const mapStateToProps = (state,ownProps)=>({
    openPage:state.open
})

const mapDispatchToProps = (dispatch,ownProps)=>({
    // openPage:()=>{dispatch(openSongPage())}
})


export default connect(mapStateToProps,mapDispatchToProps)(Content)