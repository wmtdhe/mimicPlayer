import React from 'react';
import {Link} from 'react-router-dom';
import {Icon} from "antd";
//<img src={item.imageUrl} alt=""/>

const axios = require('axios')

function toWhere(targetType,id) {
    switch (targetType) {
        case (1000): //songlist
            return `/songlist/detail?id=${id}`
        case(1): //song /song/detail?ids=
            return '/';
        case(10): //album
            return `/album?id=${id}`;
        case(100): //singer
            return `/`
        default:
            return '/'
    }
}
function ItemList(props) {
    let a = props.activated
    let len = props.items.length
    function handleClick(e,item,on){
        if(!on){
            return
        }
        if(item.targetType===1){
            e.preventDefault()
            axios.get(`/song/detail?ids=${item.targetId}`,{withCredentials:true})
                .then(res=>{
                    let song = res.data.songs[0]
                    axios.get(`/check/music?id=${song.id}`)
                        .then(res=>{
                            let dup = false
                            for(let i=0;i<props.songList.length;i++){
                                if(song.id===props.songList[i].id){
                                    dup=true
                                    break
                                }
                            }
                            if(!dup){
                                let obj ={name:song.name,id:song.id,duration:song.dt,singer:song.ar[0].name,albumId:song.al.id,albumName:song.al.name}
                                props.dbClick(obj,props.songList.length)
                            }else{
                                console.log('duplicate')
                            }
                        })
                        .catch(err=>404)
                }).catch(err=>{console.log(err)})
        }else{
            console.log('my type is ',item.targetType)
        }
    }
    return(props.items.map((item,index)=>{
        if(a-1<0 && len-1===index){
            return <Link key={index} onClick={(e)=>handleClick(e,item,false)} to={toWhere(item.targetType,item.targetId)}><li className='before-mid' style={{backgroundImage:`url(${item.imageUrl})`}}><div className='banner-tag' style={{backgroundColor:`${item.titleColor==='red'?'rgb(204,74,74)':'rgb(74,121,204)'}`}}>{item.typeTitle}</div></li></Link>
        }
        if(a+1===len && index===0){
            return <Link key={index} onClick={(e)=>handleClick(e,item,false)} to={toWhere(item.targetType,item.targetId)}><li className='after-mid' style={{backgroundImage:`url(${item.imageUrl})`}}><div className='banner-tag' style={{backgroundColor:`${item.titleColor==='red'?'rgb(204,74,74)':'rgb(74,121,204)'}`}}>{item.typeTitle}</div></li></Link>
        }
        if(a-1===index){
            return <Link key={index} onClick={(e)=>handleClick(e,item,false)} to={toWhere(item.targetType,item.targetId)}><li className='before-mid' style={{backgroundImage:`url(${item.imageUrl})`}}><div className='banner-tag' style={{backgroundColor:`${item.titleColor==='red'?'rgb(204,74,74)':'rgb(74,121,204)'}`}}>{item.typeTitle}</div></li></Link>
        }
        else if(a===index){
            return <Link key={index} onClick={(e)=>handleClick(e,item,true)} to={toWhere(item.targetType,item.targetId)}><li className='mid-image' style={{backgroundImage:`url(${item.imageUrl})`}}><div className='banner-tag' style={{backgroundColor:`${item.titleColor==='red'?'rgb(204,74,74)':'rgb(74,121,204)'}`}}>{item.typeTitle}</div></li></Link>
        }
        else if(a+1===index){
            return <Link key={index} onClick={(e)=>handleClick(e,item,false)} to={toWhere(item.targetType,item.targetId)}><li className='after-mid' style={{backgroundImage:`url(${item.imageUrl})`}}><div className='banner-tag' style={{backgroundColor:`${item.titleColor==='red'?'rgb(204,74,74)':'rgb(74,121,204)'}`}}>{item.typeTitle}</div></li></Link>
        }
        else{
            return <Link key={index} onClick={(e)=>handleClick(e,item,false)} to={toWhere(item.targetType,item.targetId)}><li><img src={item.imageUrl} alt=""/></li></Link>
        }
    }))
}
function NavList(props) {
    let arr = new Array(props.len).fill(0) //create render list
    return(arr.map((v,i)=>{
        if(i===props.active){
            return <li key={i} className='dot-active'>{i}</li>
        }else{
            return <li key={i}>{i}</li>
        }

    }))
}
class Carousel extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            activated:0,
            timer:null
        }
        this.showNav = this.showNav.bind(this)
        this.hideNav = this.hideNav.bind(this)
        this.NavTo = this.NavTo.bind(this)
        this.autoTick = this.autoTick.bind(this)
    }
    showNav(){
        this.setState({show:true})
        clearInterval(this.state.timer)
    }
    hideNav(){
        let t = this.autoTick()
        this.setState({timer:t,show:false})
    }
    NavTo(e){
        if(e.target.tagName!=='LI')return
        console.log(e.target.innerText)
        this.setState({activated:Number(e.target.innerText)})
        e.stopPropagation()
    }
    autoTick(){
         return setInterval(()=>{
            let len = this.props.banners.length
            this.setState({activated:(this.state.activated+1===len)?0:this.state.activated+1})
        },3000)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // clearInterval(prevState.timer)
        // let t = this.autoTick()
        // this.setState({timer:t})
    }

    componentDidMount() {
        let t = this.autoTick()
        this.setState({timer:t})
    }
    componentWillUnmount() {
        clearInterval(this.state.timer)
        // clearInterval(t)
    }


    render(){
        let len = this.props.banners.length
        return(<div className='carousel-frame' >
            <div className='main-carousel' onMouseEnter={this.showNav} onMouseLeave={this.hideNav}>
                <div className='prev' style={{opacity:`${this.state.show?1:0}`}} onClick={(e)=>{this.setState({activated:this.state.activated-1>0?this.state.activated-1:len-1})}}><Icon type='left' style={{color:'rgb(200,200,200)',width:'2em',height:'2em'}}/></div>
                <ul className='carousel-img'>
                    {
                        this.props.banners && <ItemList items={this.props.banners} activated={this.state.activated} dbClick={this.props.dbClick} songList={this.props.songList}/>
                    }
                </ul>
                <div className='next' style={{opacity:`${this.state.show?1:0}`}} onClick={(e)=>{this.setState({activated:this.state.activated+1<len?this.state.activated+1:0})}}><Icon type='right' style={{color:'rgb(200,200,200)',width:'2em',height:'2em'}}/></div>
            </div>
            <div className='dot-nav'>
                <ul onMouseOver={this.NavTo}>
                    {
                        this.props.banners && <NavList len={this.props.banners.length} active={this.state.activated}></NavList>
                    }
                </ul>
            </div>
        </div>)
    }
}

export default Carousel;