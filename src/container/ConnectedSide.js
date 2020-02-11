import {connect} from 'react-redux'
import Side from '../components/Side'

const mapStateToProps = (state,ownProps)=>{
    return {
        sublists:state.sublists,
        status:state.logStatus?true:false,
        playing:state.playing!==null?true:false
    }
}

const mapDispatchToProps = (dispatch,ownProps)=>{
    return {

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Side)