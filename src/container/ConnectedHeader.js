import {connect} from 'react-redux';
import Header from "../components/Header";
import {logIn,logOut,subscribe,logout_unsubscribe} from "../action/action";

const mapStateToProps = (state,ownProps)=>{
    return {
        status:state.logStatus //null or info
    }
}

const mapDispatchToProps = (dispatch,ownProps)=>{
    return {
        logIn:(info)=>{dispatch(logIn(info))},
        logOut:()=>{dispatch(logOut())},
        subscribe:(playlist)=>{dispatch(subscribe(playlist))},
        logout_unsubscribe:()=>{dispatch(logout_unsubscribe())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header)