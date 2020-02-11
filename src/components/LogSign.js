import React from "react";
import '../css/logSign.css'

class LogSign extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount() {
    }

    render() {
        return(<div className='login-box'>
            <form action="">
                <input type="text" placeholder='请输入手机号'/>
                <input type="password" placeholder='请输入密码'/>
                <input type="checkbox"/>
                <input type="button"/>
            </form>
        </div>)
    }
}

export default LogSign