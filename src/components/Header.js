import React, {useState, useEffect, createRef} from 'react';
import {Input, Form, Icon, Avatar} from "antd";
import {NavLink,Link} from 'react-router-dom';
import '../css/header.css';
import {generatePath} from 'react-router';
import '../css/logSign.css';

const axios = require('axios')

const submitref = createRef()
const telRef = createRef()
const passRef = createRef()
const checkRef = createRef()
const codeRef = createRef()


const NeteaseSvg = ()=>(
    <svg t="1581083609599" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="2668" width="1em" height="1em">
        <path
            d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m-46.336-445.098667c10.24-35.84 45.866667-65.749333 84.906667-70.314667 7.978667 29.610667 16.554667 58.581333 23.253333 88.021334 2.261333 9.813333 1.578667 21.12-0.768 31.018666-9.088 38.058667-53.248 52.992-84.394667 29.226667-22.613333-17.28-31.658667-47.786667-22.997333-77.952z m162.858667-8.405333c-5.333333-19.84-10.922667-39.552-16.768-60.586667 21.333333 5.546667 38.741333 15.36 53.546666 29.781333 53.632 52.096 59.093333 140.8 12.544 201.856-48.426667 63.573333-134.613333 91.050667-214.528 68.48-98.218667-27.733333-162.474667-125.952-146.816-226.816 11.690667-75.434667 54.186667-128.170667 123.733334-159.274666 17.365333-7.765333 24.746667-23.893333 17.92-39.68-6.698667-15.530667-23.04-21.504-40.277334-14.634667-116.096 46.464-184.32 176.384-156.586666 298.112 30.421333 133.034667 149.12 220.288 284.8 207.317333 73.898667-7.04 134.997333-40.448 179.882666-100.138666 64.256-85.418667 55.338667-204.074667-19.754666-277.290667-28.416-27.733333-62.762667-43.434667-101.973334-49.194667-3.541333-0.554667-9.258667-2.218667-9.898666-4.522666-3.712-13.354667-7.68-26.965333-8.789334-40.704-1.237333-15.232 12.373333-27.306667 27.733334-27.52 10.794667-0.128 18.517333 5.546667 25.728 12.8 12.928 12.8 30.037333 13.738667 42.154666 2.645333 12.373333-11.264 12.629333-28.928 0.768-43.008-24.149333-28.672-67.669333-38.016-103.68-22.314667-36.138667 15.786667-56.362667 50.645333-51.2 89.301334 1.621333 11.946667 4.693333 23.765333 7.125334 35.925333l-11.093334 3.072a164.821333 164.821333 0 0 0-89.514666 60.330667c-39.296 52.053333-39.936 120.661333-1.749334 168.405333 54.357333 68.010667 159.872 54.784 192.981334-24.234667 12.117333-28.842667 11.733333-58.368 3.712-88.106666z"
            p-id="2669" fill="#ffffff"></path>
    </svg>)
const NeteaseIcon = (props)=>(<Icon component={NeteaseSvg} {...props}/>)

function Header(props) {
    let [keywords,setKey]=useState('')
    let [show,setShow]=useState(false)// 调出登录界面
    let [loaded,setLoad]=useState(false)
    let [hisP,setHistory]=useState(1) //starting from the second history entry
    useEffect(function () {
        setHistory(props.history.length-1)
    },[props.history.length])
    function tickSubmit() {
        console.log('hihi===')
        if(!keywords){
            return;
        }
        submitref.current.click()
    }
    function handleSubmit(e) {
        e.preventDefault()
        props.history.push(`/search?keywords=${keywords}`)
    }
    function recordInput(e) {
        setKey(e.target.value)
    }
    function handleLogIn(e) {
        // console.log(e.target)
        let tel = telRef.current.value
        let pas = passRef.current.value
        let checked = checkRef.current.checked
        let code = codeRef.current.value
        console.log(tel,pas,checked,code)
        axios.get(`/login/cellphone?phone=${tel}&password=${pas}&countrycode=${code}`,{withCredentials:true})
            .then(res=>{
                //200 501 - no existing account
                let code = res.data.code//wrong password
                if(code===502){
                    alert('密码错误')
                    passRef.current.value=''
                }else if(code===200){
                    props.logIn({
                        account:res.data.account,
                        token:res.data.token,
                        profile:res.data.profile
                    })
                    setShow(false)
                    axios.get(`/user/playlist?uid=${res.data.account.id}`,{withCredentials: true})
                        .then(res=>{
                            let lists = res.data.playlist
                            lists.forEach((v,i)=>{
                                props.subscribe(v)
                            })
                        })
                        .catch(err=>{console.log(err)})
                }
            // console.log(res)

        }).catch(err=>{
            console.log(err.message)
            let len = 'Request failed with status code '.length
            let code = Number(err.message.slice(len))
            if(code===501){
                alert('账号不存在')
            }else if(code===509){
                alert('密码错误超过限制')
            }
            }
        )
        e.preventDefault()
    }
    function handleLogOut(e) {
        console.log('??')
        axios.get('/logout',{withCredentials:true}) //async requests don't request with cookie infos by defaults
            .then(res=>{
                console.log(res.data)
                props.logOut()
                setLoad(false)
                props.logout_unsubscribe()
                // props.history
                // while (props.history.length){
                //     props.history.action.pop()
                // }
                console.log('--------------------')
                console.log(props.history.location)
                console.log(props.history.length)
                console.log(props.history.action)
            })
            .catch(err=>console.log(err))
    }
    function handleNav(e,dir) {
        console.log(props.history)
        console.log(props.history.location)
        if(dir===0){
            if(hisP===1){
                return
            }
            else {
                setHistory(hisP-1)
                props.history.goBack()
            }
        }else if(dir===1){
            if(hisP===props.history.length-1){
                return
            }
            else {
                setHistory(hisP+1)
                props.history.goForward()
            }
        }
    }
    return(<div className='header-frame'>
        <Link to='/'><h1><NeteaseIcon style={{ color: '#fff' }}/>网易云音乐</h1></Link>
        <div className='search-section'>
            <span className='input-nav'>
                <span className='left-nav' style={hisP!==1?{color:'#fff'}:{color:'rgb(209,88,88)'}} onClick={(e)=>handleNav(e,0)}><Icon type="left"/></span>
                <span className='right-nav' style={hisP!==props.history.length-1?{color:'#fff'}:{color:'rgb(209,88,88)'}} onClick={(e)=>handleNav(e,1)}><Icon type="right"/></span>
            </span>
            <form action="/" onSubmit={handleSubmit}>
            <span className='input-frame'>
            <input type="text" placeholder='搜索音乐，视频，歌词，电台' id='search-area' autoComplete='off' name='keyword' onInput={recordInput}/>
            <input type="submit" ref={submitref} style={{height:0,width:0}}/>
            <div onClick={tickSubmit} className='search'><Icon type="search" style={{color:"rgb(200,119,119)"}} id='search'/></div>
            </span>
            </form>

        </div>
        <div className='log-section'>
            <div>
                <Avatar shape='circle' src={`${props.status?props.status.profile.avatarUrl:''}`} icon={<Icon type='user'/>}></Avatar>
            </div>
            <div className='dropdown'>
                {props.status?<div onClick={(e)=>{setLoad(!loaded)}} className='temp'>&nbsp;&nbsp;{props.status.profile.nickname}&nbsp;<Icon type="caret-down" /></div>:<div onClick={(e)=>{setShow(!show)}} className='temp'>&nbsp;&nbsp;未登录</div>}
                <div className={`login-box ${show?'show':''}`}>
                    <div onClick={(e)=>{setShow(false)}} className='l-close'>X</div>
                    <div className='l-main-part'>
                        <form action="/" onSubmit={handleLogIn}>
                            <div style={{borderRadius:'5px 5px 0 0',border:'1px solid rgb(217,217,217)'}}><Icon type='mobile'/>
                            <select style={{border:'none',outlineStyle:'none'}} name="countryCode" ref={codeRef}>
                                <option value="86">+86</option>
                                <option value="852">+852</option>
                            </select>
                                <input required autoComplete='off' ref={telRef} style={{marginLeft:'0.5em',width:'75%'}} type="text" name='tel' placeholder='请输入手机号'/></div>
                            <div style={{borderRadius:'0 0 5px 5px',borderLeft:'1px solid rgb(217,217,217)',borderRight:'1px solid rgb(217,217,217)',borderBottom:'1px solid rgb(217,217,217)'}}><Icon type='lock'></Icon><input required ref={passRef} style={{marginLeft:'0.5em'}} type="password" name='pas' placeholder='请输入密码' autoComplete='off'/></div>
                            <div style={{backgroundColor:'transparent'}}><input type="checkbox" ref={checkRef}/>自动登录</div>
                            <div style={{padding:0,borderRadius:'5px'}}><input type="submit" value='登录' className='login'/></div>
                        </form>
                    </div>
                    {/*<div><a href="">注册</a></div>*/}
                </div>
                {
                    props.status && loaded &&
                    <div className='profile-brief'>
                        <div className='t'>
                            <Avatar shape='circle' size='large' src={props.status.profile.avatarUrl}></Avatar>
                            <span>&nbsp;&nbsp;{props.status.profile.nickname}</span>
                        </div>
                        <div className='personal-detail'>
                            <div style={{borderRight:'1px solid rgb(240,240,240)'}}><strong>{props.status.profile.eventCount}</strong><br/>动态</div>
                            <div style={{borderRight:'1px solid rgb(240,240,240)'}}><strong>{props.status.profile.follows}</strong><br/>关注</div>
                            <div><strong>{props.status.profile.followeds}</strong><br/>粉丝</div>
                        </div>
                        <div className='logout' onClick={handleLogOut}><Icon type='poweroff'/>&nbsp;&nbsp;退出登录</div>
                    </div>
                }
            </div>
        </div>
    </div>)
}

export default Header