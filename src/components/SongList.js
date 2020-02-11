import React,{useState, createRef} from 'react';
import {Link, Switch,Route} from 'react-router-dom';
import '../css/songlist.css';
import {Icon} from "antd";
import {validate} from "./Search";
import Toast from "./Toast";

const axios = require('axios')


function computeDuration(t) { //transfer time into readable
    let min=parseInt(t/60)
        let sec=Math.floor(t-min*60) //toFixed() will round to next / carry
        return `${min<10?('0'+min):min}:${sec<10?('0'+sec):sec}`
}
/*
------
 */
const toastRef = createRef()
export function toastShow(ref){
    let toast = ref.current
    toast.style.display = 'block'
    setTimeout(function () {
        toast.style.opacity = 0.7
        setTimeout(function () {
            toast.style.opacity = 0
            setTimeout(function () {
                toast.style.display = 'none'
            },500)
        },1000)
    },0)
}

function highlightKeywords(index,arr,str,ret,rlen) {
    let lstr = str.toLowerCase()
    while(index!==-1){
        let pivot = lstr.indexOf(ret,index)
        if(pivot===-1){
            arr.push({char:str.slice(index),h:false})
            index = -1
        }else{
            if(index<pivot){
                arr.push({char:str.slice(index,pivot),h:false}) //push in un-highlighted str
                arr.push({char:str.slice(pivot,pivot+rlen),h:true}) //highlighted
                index = pivot+rlen
            }else if(index===pivot){
                arr.push({char:str.slice(pivot,pivot+rlen),h:true})
                index = pivot+rlen
            }
        }
    }
}

function List(props) {
    let [focus,setFocus]=useState(null)
    function focused(e,index) {
        setFocus(index)
        e.stopPropagation()
    }
    function dbClick(e,i,id) {
        //播放歌单中的歌曲替换播放列表
        //only add playable songs
        if(props.songs[i].valid===404){
            toastShow(toastRef)
            return;
        }
        let index = 0 //for clicked song
        let flag = false //
        let playable = props.songs.filter((v,ii)=>{
            if(v.valid===200){
                if(i===ii){flag=true}
                if(!flag){index++}
                return true
            }
            else{return false}
        })
        props.cleanList()
        props.playAll(playable,index)
    }
    return (<div>
        <div className='toast-frame' ref={toastRef}>因合作方要求，您所在的地区暂时无法播放</div>
        <div className='result-row-flex'>
            <div className='result-row-flex-item flex1'></div>
            <div className='result-row-flex-item flex1'>操作</div>
            <div className='result-row-flex-item flex2'>音乐标题</div>
            <div className='result-row-flex-item flex3'>歌手</div>
            <div className='result-row-flex-item flex4'>专辑</div>
            <div className='result-row-flex-item flex5'>时长</div>
        </div>
        {   props.songs[0] && !props.searching &&
            props.tracks.map((v,i)=>{
                return <div key={i} className={`result-row-flex ${i%2!==0?'even':''} ${focus==i?'focused':''}`} onClick={(e)=>focused(e,i)} onDoubleClick={(e)=>dbClick(e,i,v.id)}>
                    <div className='flex1' style={{textAlign:'right'}}>{`${i+1<=9?'0'+(i+1):i+1}`}</div>
                    <div className='flex1'>{}</div>
                    <div className={`flex2 ${props.songs[i].valid===404?'restricted':'valid-song'}`}>{v.name}</div>
                    <div className='flex3'>{v.ar[0].name}</div>
                    <div className='flex4'>{v.al.name}</div>
                    <div className='flex5'>{computeDuration(v.dt/1000)}</div>
                </div>
            })
        }
        {
            props.songs[0] && props.searching &&
            props.searched.map((v,i)=>{
            return <div key={i} className={`result-row-flex ${i%2!==0?'even':''} ${focus==i?'focused':''}`} onClick={(e)=>focused(e,i)} onDoubleClick={(e)=>dbClick(e,v.rid,v.rid)}>
            <div className='flex1' style={{textAlign:'right'}}>{`${i+1<=9?'0'+(i+1):i+1}`}</div>
            <div className='flex1'>{}</div>
            <div className={`flex2 ${v.valid===404?'restricted':'valid-song'}`}>
                {v.na.map((obj,i)=>{if(obj.h){return <span>{obj.char}</span>}else{return obj.char}})}
            </div>
            <div className='flex3'>{v.sa.map((obj,i)=>{if(obj.h){return <span>{obj.char}</span>}else{return obj.char}})}</div>
            <div className='flex4'>{v.aa.map((obj,i)=>{if(obj.h){return <span>{obj.char}</span>}else{return obj.char}})}</div>
            <div className='flex5'>{computeDuration(v.duration/1000)}</div>
            </div>
        })
        }
    </div>)
}
function Comments(props) {
    return <div>
        Comments
    </div>
}
function Archived(props) {
    return <div>
        Archived
    </div>
}
//${props.songs[i].valid===404?'restricted':''}
function toDate(t) {
    let date = new Date(t)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    // console.log(`${year}-${month+1}-${day}`)
    return(`${year}-${month+1}-${day}`)
}
function toCount(count) {
    return count>100000?`${Math.floor(count/10000)}万`:count
}

let tId = null
class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songListObj: null,
            dropdown:false,
            songs:[],
            search:'',
            t:null, //subscribe type0
            searchSongs:[],
            searching:false
        }
        this.changeDropdown = this.changeDropdown.bind(this);
        this.playAllSong = this.playAllSong.bind(this);
        this.addAllSong = this.addAllSong.bind(this);
        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.handleSearch = this.handleSearch.bind(this)
    }
    playAllSong(e){
        e.preventDefault();
        let reply = confirm("'播放全部' 将会替换当前的播放列表，是否继续？")
        if(reply){
            let playable = this.state.songs.filter((v,ii)=>{
                if(v.valid===200){
                    return true
                }
                else{return false}
            });
            this.props.dbClick(playable,0)
        }else{
            return
        }
    }
    addAllSong(e){ //remove duplicates
        e.preventDefault();
        let playable = this.state.songs.filter((v,ii)=>{
            if(v.valid===200){
                return true
            }
            else{return false}
        });
        let nodup = [];
        let slen = this.props.songList.length
        for(let i=0;i<playable.length;i++){
            let dup = false
            for(let j=0;j<slen;j++){
                if(playable[i].id===this.props.songList[j].id){
                    dup = true
                    break
                }
            }
            if(!dup){
                nodup.push(playable[i])
            }
        }
        this.props.addAllSong(nodup,this.props.playing)
    }
    handleSearch(e){

        let ret = e.target.value.toString().toLowerCase();
        let rlen = ret.length;
        console.log(ret);
        if(!ret){
            this.setState({searching:false});
            return
        }
        clearTimeout(tId);
        tId = setTimeout(()=> {
            let temp = [];
            for(let i=0;i<this.state.songs.length;i++){
                let [nindex,sindex,aindex] = [0,0,0]
                let [na,sa,aa] = [[],[],[]];
                highlightKeywords(nindex,na,this.state.songs[i].name,ret,rlen)
                highlightKeywords(sindex,sa,this.state.songs[i].singer,ret,rlen)
                highlightKeywords(aindex,aa,this.state.songs[i].albumName,ret,rlen)
                if(na.length>1 || sa.length>1 || aa.length>1){
                    //rid - real id in the whole list,
                    // na, sa, aa --- matching array
                    temp.push(Object.assign({},this.state.songs[i],{rid:i},{na:na},{sa:sa},{aa:aa}))
                }
            }
            this.setState({searchSongs:temp,searching:true})
        },300)
    }
    handleSubscribe(e){
        e.preventDefault()
        console.log('subscribe')
        let listId = this.state.songListObj.id
        //t: 1 - subscribe, 2 - unsubscribe
        let tt = this.state.t?2:1
        axios.get(`/playlist/subscribe?t=${tt}&id=${listId}`,{withCredentials:true})
            .then(res=>{
            console.log(res.data)
                if (tt===1){
                    this.props.subscribe(Object.assign({},this.state.songListObj,{subscribed:true}),true)
                    this.setState({t:true})
                }else {
                    let i = 0
                    for(let j=0;j<this.props.sublist.length;j++){
                        if(listId===this.props.sublist[j].id)break
                        else{
                            i++
                        }
                    }
                    this.props.unsubscribe(i)
                    this.setState({t:false})
                }

        }).catch(err=>{
            console.log(err.message)
            alert('need log in') //toast later
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps.location.search,' ----componentUpdate里面的 ',this.props.location.search)
        if(prevProps.location.search!==this.props.location.search){
            axios.get(`/playlist/detail${this.props.location.search}`,{withCredentials:true})
                .then(res=>{
                    let songs = res.data.playlist.tracks
                    let ret = []
                    let that = this
                    axios.all(validate(res.data.playlist.trackIds))
                        .then(axios.spread(function () { //=> equal to .then(result=>{})? result is an array
                                for(let i=0;i<arguments.length;i++){
                                    ret[i]=Object.assign({},
                                        {name:songs[i].name,id:songs[i].id,duration:songs[i].dt,singer:songs[i].ar[0].name,albumId:songs[i].al.id,albumName:songs[i].al.name},
                                        {valid:arguments[i]})
                                }
                            if(that.props.status){
                                let unsub = that.props.sublist.every((v,i)=>{
                                    return v.id !== res.data.playlist.id
                                })
                                if(unsub){
                                    that.setState({songs:ret,songListObj:res.data.playlist,t:false})
                                }else{
                                    that.setState({songs:ret,songListObj:res.data.playlist,t:true})
                                }
                            }
                            else{
                                that.setState({songs:ret,songListObj:res.data.playlist,t:false})
                            }
                            })
                        ).catch(err=>console.log(err))
                })
                .catch(err=>{console.log(err)})
        }
        if(prevProps.sublist!==this.props.sublist){
            if(!this.props.status){this.setState({t:false})}
            else{
                axios.get(`/playlist/detail${this.props.location.search}`,{withCredentials:true})
                    .then((res)=>{
                        let unsub = this.props.sublist.every((v,i)=>{
                            return v.id !== res.data.playlist.id
                        })
                        console.log('unsub is ',unsub)
                        if(unsub){this.setState({t:false})}
                        else{this.setState({t:true})}
                    })
                    .catch(err=>{console.log(err)})
            }
        }
    }

    componentDidMount() {
        // this.setState({search:'a'})
        axios.get(`/playlist/detail${this.props.location.search}`,{withCredentials:true})
            .then(res=>{
                let songs = res.data.playlist.tracks
                let ret = []
                let that = this
                axios.all(validate(res.data.playlist.trackIds))
                    .then(axios.spread(function () { //=> equal to .then(result=>{})? result is an array
                            for(let i=0;i<arguments.length;i++){
                                ret[i]=Object.assign({},
                                    {name:songs[i].name,id:songs[i].id,duration:songs[i].dt,singer:songs[i].ar[0].name,albumId:songs[i].al.id,albumName:songs[i].al.name},
                                    {valid:arguments[i]})
                            }
                            if(that.props.status){
                                let unsub = that.props.sublist.every((v,i)=>{
                                    return v.id !== res.data.playlist.id
                                })
                                if(unsub){
                                    that.setState({songs:ret,songListObj:res.data.playlist,t:false})
                                }else{
                                    that.setState({songs:ret,songListObj:res.data.playlist,t:true})
                                }
                            }
                            else{
                                that.setState({songs:ret,songListObj:res.data.playlist,t:false})
                            }
                        })
                    ).catch(err=>console.log(err))
            })
            .catch(err=>{console.log(err)})

    }
    changeDropdown(){
        this.setState({dropdown:!this.state.dropdown})
    }
    render(){
            let currentLocation = this.props.location.pathname+this.props.location.search
            let location = `/${this.props.location.hash.slice(1)}`
        console.log('render里面的',this.props.location.hash)
        // console.log(location)
            return((this.state.songListObj && this.state.songs)?<div className='songlist-frame'>
                <div className='songlist-top' style={{padding:'2em 2em 0 2em',position:'relative'}}>
                    <div className='listinfo'>
                        <span style={{paddingRight:'1em'}}><div>歌曲数</div><div style={{textAlign:'right'}}><strong>{this.state.songListObj.trackCount}</strong></div></span>
                        <span style={{borderLeft:'1px solid #eee',paddingLeft:'1em'}}><div>播放数</div><div style={{textAlign:'right'}}><strong>{toCount(this.state.songListObj.playCount)}</strong></div></span>
                    </div>
                    <div style={{display:'flex',flexFlow:'row nowrap'}}>
                        <div style={{width:'15.6em',height:'15.6em',flex:'0 0 22%'}}>
                            <img src={this.state.songListObj.coverImgUrl} alt="" style={{height:'100%',width:'100%'}}/>
                        </div>
                        <div className='songlist-headline'>
                            <h2 style={{paddingLeft:'2em',width:'80%'}}>&nbsp;{this.state.songListObj.name}</h2>
                            <div >
                                <Link to='/'><img src={this.state.songListObj.creator.avatarUrl} alt="" style={{width:'2em',height:'2em',borderRadius:'50%',marginRight:'1em'}}/></Link>
                                <span style={{color:'rgb(102,102,102)',marginRight:'1em'}}><Link to='/'>{this.state.songListObj.creator.nickname}</Link></span>
                                <span>{toDate(this.state.songListObj.createTime)}创建</span>
                            </div>
                            <div className='operations'>
                                <div style={{backgroundColor:'rgb(198,47,47)',borderRadius:'3px'}}>
                                    <span id='playall'><Link to='/' style={{color:'white'}} onClick={this.playAllSong}><Icon type="play-circle" style={{paddingRight:'0.3em'}}/><span>播放全部</span></Link></span>
                                    <span id='addall'><Link to='/' style={{color:'white'}} onClick={this.addAllSong}><Icon type="plus"/></Link></span>
                                </div>
                                <div id='archive'><Link to='/' style={{color:'black'}} onClick={this.handleSubscribe}><Icon type="folder-add"style={{paddingRight:'0.3em'}} /><span>{this.state.t&&<span>已</span>}收藏{`(${this.state.songListObj.subscribedCount})`}</span></Link></div>
                                <div id='share'><Link to='/' style={{color:'black'}}><Icon type="export" style={{paddingRight:'0.3em'}}/><span>分享{`(${this.state.songListObj.shareCount})`}</span></Link></div>
                                <div id='download'><Link to='/' style={{color:'black'}}><Icon type="download" style={{paddingRight:'0.3em'}}/><span>下载全部</span></Link></div>
                            </div>
                            <div className='tags'>
                                <span>标签：</span>{this.state.songListObj.tags.map((tag,i,arr)=>{
                                    if(i===arr.length-1){
                                        return <span key={i}><Link to='/'>{tag}</Link></span>
                                    }
                                    return <span key={i}><Link to='/'>{tag}</Link> / </span>
                            })}
                            </div>
                            <div className='descriptions'>
                                <div onClick={this.changeDropdown} id='dropdown'>
                                    {this.state.dropdown?<Icon type='up'/>:<Icon type='down'/>  }
                                </div>
                                <span id={this.state.dropdown?'':'jianjie'}>简介：{this.state.songListObj.description.split(/\s/).map((v,i)=>{
                                return (<div key={i}>{v}<br/></div>)
                            })}</span></div>
                        </div>
                    </div>
                    <div className='songlist-nav'>
                            <span className='songlist-search'><input type="text" placeholder='搜索歌单音乐' onChange={this.handleSearch}/><Icon type='search'/></span>
                            <div className={this.props.location.hash==''?'nav-active':''}><Link to={currentLocation} >歌曲列表</Link></div>
                            <div className={this.props.location.hash=='#comments'?'nav-active':''}><Link to={currentLocation+'#comments'}>评论({this.state.songListObj.commentCount})</Link></div>
                            <div className={this.props.location.hash=='#archived'?'nav-active':''}><Link to={currentLocation+'#archived'} >收藏者</Link></div>
                    </div>
                </div>
                <div className='songlist-bottom'>
                    <Switch location={{pathname:location}}>
                        <Route path='/'  exact ><List tracks={this.state.songListObj.tracks} playAll={this.props.dbClick} songs={this.state.songs} len={this.props.songListLen} cur={this.props.playing} playExisting={this.props.playExistingSong} songList={this.props.songList} cleanList={this.props.cleanList} searched={this.state.searchSongs} searching={this.state.searching}/></Route>
                        <Route path='/comments' exact component={Comments}></Route>
                        <Route path='/archived'   exact component={Archived}></Route>
                    </Switch>
                </div>
            </div>:(<div style={{textAlign:'center',position:'absolute',top:'50%',left:'50%',transform:'translate(0,-50%)',fontSize:'3em'}}>
               <Icon type='loading' />加载中
            </div>))
        }
}


export default SongList