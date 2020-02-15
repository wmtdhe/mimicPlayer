import React, {useState,useEffect} from 'react';
import '../css/player.css';
import {Icon} from 'antd';
import {Link} from 'react-router-dom';


const axios = require('axios')

const ref = React.createRef()
const vref = React.createRef()
const songRef = React.createRef()

function Preview(props){
    let [img,setImg]=useState('')
    useEffect(function () {
        if(props.info){
            axios.get(`/album?id=${props.info.albumId}`,{withCredentials:true})
                .then(res=>{
                    console.log(res.data)
                    let url = res.data.album.picUrl
                    setImg(url)


                }).catch(err=>{console.log(err)})

            // let side = document.querySelector('.side-frame')
            // let preview = document.querySelector('.preview-frame')
            // let shorten = preview.getBoundingClientRect().height
            // side.style.height = side.style.height-shorten+'px'
            // console.log('shorten is ',shorten)
        }

    },[props.info])
    return <div className='preview-frame' style={{display:'flex',flexFlow:'row nowrap',width:'20.5%',boxSizing:'border-box',left:'0'}}>
        {props.info && <>
            <div className='specific' onClick={()=>{props.openSongPage()}}><div className='mask'></div><img src={`${img}?param=50y50`} alt=""/></div>
            <div style={{paddingLeft:'0.5em',width:'75%'}}>
                <div  className='preview-song-name' >
                    <Link to='/' title={props.info.name}>{props.info.name}</Link>
                </div>
                <div className='preview-singer-name' >
                    <Link to='/'>{props.info.singer}</Link>
                </div>
            </div>
        </>}
    </div>
}

function Player(props) {
    let [play,switchStatus]=useState(false)//t for playing
    let [volume,setVolume]=useState(1)
    let [played,setPlay]=useState(0) //进度
    let [currentTime,setCurrent]=useState('0:00')
    let [duration,setDuration]=useState('0:00')
    let [storeVolume,setStoreVolume]=useState(1) //memorize volume before muted
    let [songSrc,setSrc]=useState('')//current playing/paused song
    let [open,setOpen]=useState(false)// f for none
    let [section,setSection]=useState(0) // 0 for playlist, 1 for history
    let [once,expired]=useState(true)//播放列表第一次因为display为none不定位
    let [localUsed,setLocalUsed]=useState(false)
    let [contextOn,setContext]=useState(false) //右键菜单
    let [view,setView]=useState(null)//当前右键选中的歌曲 - 播放列表中
    let [pos,setPos]=useState([])
    let [count,setCount]=useState(null)//右键查看的歌曲的评论数
    let [showList,setShow]=useState(false)
    useEffect(function () {
        if(props.songSrc){
            axios.get(`/song/url?id=${props.songSrc.id}`)
                .then(res=>{
                    let url = res.data.data[0].url
                    setSrc(url)
                })
                .catch(err=>{console.log(err)})
            if(!localUsed){
                props.addAll(localStorage.getArr('local'))
                setLocalUsed(true)
            }
        }else{
            if(!localUsed){
                props.addAll(localStorage.getArr('local'))
                setLocalUsed(true)
            }
            setSrc('')
        }
    },[props.songSrc])
    function changeStatus(){
        if(!props.songSrc){return}
        if(play){
            songRef.current.pause()
            props.playPause(false)
        }else{
            songRef.current.play()
            props.playPause(true)
        }
        switchStatus(!play)

    }
    function computeDuration(t,flag) { //transfer time into readable
        let min=parseInt(t/60)
        if(flag){
            let sec=Math.floor(t-min*60) //toFixed() will round to next / carry
            return `${min}:${sec<10?('0'+sec):sec}`
        }
        else{
            let sec=t-min*60
            return `${min<10?('0'+min):min}:${sec<10?('0'+sec):sec}`
        }
    }
    function volumeChange(e) {
        let max = vref.current.getBoundingClientRect().width
        let vol = e.clientX - vref.current.getBoundingClientRect().x
        let percentage = vol/max;
        console.log('volume now ',percentage*100)
        if(percentage*100<3){
            setVolume(0)
            songRef.current.volume=0
        }
        else if((100-percentage*100)<1){
            setVolume(1)
            songRef.current.volume = 1
        }
        else{
            setVolume(percentage)
            songRef.current.volume=percentage
        }
    }
    function currentTimeChange(e) { //by hand
        // console.log(e.currentTarget.offsetX)
        //     let cur = e.nativeEvent.offsetX; <------node causing trouble
        //alternative --- use clientX- current starting position of max-bar
        let max = ref.current.getBoundingClientRect().width
        let cur = e.clientX-ref.current.getBoundingClientRect().x
            // console.log(max,cur)
            setPlay(cur/max)
            songRef.current.currentTime=songRef.current.duration*(cur/max)

    }
    function Playing() { //audio itself ticks
        // console.log('playing')
        let c = songRef.current.currentTime //current time
        let d = songRef.current.duration //duration
        let cur = computeDuration(c,true)
        setCurrent(cur)
        setPlay(c/d)
        props.newProgress(computeDuration(c))
    }
    function setUp() {
        setDuration(computeDuration(songRef.current.duration,true))
    }
    function handleEnd() {
        // setCurrent(computeDuration(0))
        if(props.songList.length===1){
            songRef.current.currentTime = 0
            switchStatus(!play)
        }
        else{
            let next = (props.songIndex===props.songList.length-1)?0:(props.songIndex+1)
            props.playSong({},next)
        }
    }
    function handleVolume(e) {
        let id = e.currentTarget.id
        if(id==='sound'){
            setStoreVolume(volume)
            setVolume(0)
            songRef.current.volume=0
        }else{
            setVolume(storeVolume)
            songRef.current.volume=storeVolume
        }
    }
    function load(e) {
        switchStatus(true)
        e.target.play()
    }
    /**
     * 定位播放曲目
     * @param e
     */
    function locateCurrent(e) {
        // if(!open){
            setOpen(!open)
            setContext(false)
            let cur = document.querySelector(`#p${props.songIndex}`)
            if(cur){
                console.log('hi')
                if(once){
                    document.querySelector('.playlist').style.display = 'block'
                    expired(false)
                }
                // console.log() //first time open its display is none
                cur.scrollIntoView({block:'center'})
            }
            // cur.scrollTo()

            // console.log(cur)
        // }

    }
    function handleNextSong(e) {
        if(!props.songSrc){return}
        let ni = (props.songIndex+1)===props.songList.length?0:props.songIndex+1
        props.playSong(null,ni)
    }
    function handleRightClick(e,id) {
        e.preventDefault();
        setContext(true)
        setView(Number(e.currentTarget.id.slice(1)))
        let playlist = document.querySelector('.playlist-songs')
        let x = e.clientX - playlist.getBoundingClientRect().x + 10
        let y = e.clientY - playlist.getBoundingClientRect().y - 10
        axios.get(`/comment/music?id=${id}`).then(res=>{
            setCount(res.data.total)
        }).catch(err=>{console.log(err)})
        setPos([x,y])
    }
    function deleteOne(e,i) {
        if(i<props.songIndex){
            props.deleteSong(i)
            props.playSong(null,props.songIndex-1)
            return;
        }else if(i>props.songIndex){
            props.deleteSong(i)
            return
        }
        if(props.songList.length===1){
            props.deleteSong(i)
            props.playSong(null,null)
            return
        }
        else if(props.songList.length-1===i){
            props.deleteSong(i)
            props.playSong(null,i-1)
            return
        }else{
            props.deleteSong(i)
            return
        }
    }
    function addToPlaylist(e) {
        let pid = e.target.getAttribute('pid')
        let tracks = e.target.getAttribute('tracks')
        axios.get(`/playlist/tracks?op=add&pid=${pid}&tracks=${tracks}`)
            .then(res=>{
                console.log(res.data)
            })
            .catch(err=>{console.log(err)})
    }
    return (<div className='player-frame'>
        {props.songSrc && <Preview info={props.songSrc} url={songSrc} openSongPage={props.openSongPage}/>}
        <audio ref={songRef} onTimeUpdate={Playing} onCanPlay={setUp} onEnded={handleEnd} onCanPlayCapture={load} id='current-song' src={songSrc}>
        </audio>
        <div className='play-button'>
            <div onClick={changeStatus}>{play?<Icon type='pause'/>:<Icon type='caret-right' /> }</div>
            <div onClick={handleNextSong}><Icon type='step-forward'/></div>
        </div>
        <div className='progress'>
            <span>{currentTime}</span>
            <div className='max-bar' onClick={currentTimeChange} ref={ref}>
                <div className='played-bar' style={{width:`${played*100}%`}} >
                    <div className='node'></div>
                </div>
            </div>
            <span>{duration}</span>
        </div>
        <div className='volume'>
            {volume?<span id='sound' onClick={handleVolume}><Icon type='sound' theme='filled' style={{cursor:'pointer'}}></Icon></span>:<Icon type="filter" theme="filled" style={{transform:'rotate(90deg)',cursor:"pointer"}} onClick={handleVolume}/>}
            <div className='max-vol' onClick={volumeChange} ref={vref}>
                <div className="cur-vol"  style={{width:`${volume*100}%`}}></div>
            </div>
        </div>
        <div className='playlist-button' style={{cursor:'pointer'}} onClick={locateCurrent}>
            <Icon type="unordered-list" />
        </div>
        <div className='playlist' style={{display:open?'block':'none'}} onClick={(e)=>{setContext(false)}}>
            <div className='playlist-nav'>
                <div style={{cursor:'pointer',borderRadius:'5px 0 0 5px',color:'rgb(124,125,133)',backgroundColor:'white',padding:'0.5em 2em 0.5em 2em'}} className={`${section===0?'active-playlist-nav':''}`}>播放列表</div>
                <div style={{cursor:'pointer',borderRadius:'0 5px 5px 0',color:'rgb(124,125,133)',backgroundColor:'white',padding:'0.5em 2em 0.5em 2em'}} className={`${section===1?'active-playlist-nav':''}`}>历史记录</div>
                <div onClick={locateCurrent} style={{cursor:'pointer',position:'absolute',right:'1em'}}><Icon type="close" /></div>
            </div>
            <div className='playlist-summary' style={{borderBottom:'1px solid rgb(238,238,238)'}}>
                <div><span>总{props.songList.length}首</span></div>
                <div>
                    <span style={{borderRight:'1px solid rgb(238,238,238)',cursor:'pointer',paddingRight:'1em'}}><Icon type="folder-add"  /> 收藏全部</span>
                    <span style={{cursor:'pointer',paddingLeft:'1em'}} onClick={(e)=>{props.deleteAll(); props.newProgress(0); setPlay(0); setDuration('0:00')}}><Icon type="delete" /> 清空</span>
                </div>
            </div>
            <div className='playlist-songs'>
                {props.songList.map((v,i)=>{
                    return <div className='playlist-summary hoverable' key={i} onDoubleClick={(e)=>{props.playSong(props.songList[i],i)}} id={`p${i}`} onContextMenu={(e)=>handleRightClick(e,props.songList[i].id)}>
                        {contextOn && view===i && <div className='contextmenu-box' style={{top:`${pos[1]}px`,left:`${pos[0]}px`}}>
                            <div><Link to={`/songcomment?id=${v.id}`}><Icon type="message" style={{marginRight:'1em'}}/>查看评论({count})</Link></div>
                            <div onClick={(e)=>{props.playSong(null,i)}} style={{borderBottom:'1px solid rgb(238,238,238)'}}><Icon type="play-circle" style={{marginRight:'1em'}}/>播放</div>
                            <div><Icon type="customer-service" style={{marginRight:'1em'}}/>专辑</div>
                            <div style={{borderBottom:'1px solid rgb(238,238,238)'}}><Icon type="user" style={{marginRight:'1em'}}/>歌手</div>
                            <div onMouseEnter={(e)=>setShow(true)} onMouseLeave={(e)=>setShow(false)} style={{position:'relative'}}>
                                <Icon type='folder-add' style={{marginRight:'1em'}}/>收藏到歌单
                                { showList && <div className='available-list' onClick={addToPlaylist}>
                                    {props.ownList.map((list,index)=>{
                                        return <div key={index} style={{borderTop:`${i!==0?'1px solid rgb(238,238,238)':''}`}} pid={list.id} tracks={v.id}>
                                            <Icon type='unordered-list' style={{marginRight:'1em'}}/>{list.name}
                                        </div>
                                    })}

                                </div>}
                            </div>
                            <div onClick={(e)=>deleteOne(e,i)}><Icon type="delete" style={{marginRight:'1em'}}/>从列表中删除</div>
                        </div>}
                        <div style={{position:'relative'}}>
                            {props.songIndex===i && play && <Icon type="caret-right" style={{position:'absolute',left:'-1.6em',color:'rgb(200,56,56)'}}/>}
                            {props.songIndex===i && !play && <Icon type="pause" style={{position:'absolute',left:'-1.6em',color:'rgb(200,56,56)'}}/>}
                            <span>{v.name}</span></div>
                        <div style={{color:'rgb(150,136,136)'}} className='name-tag'>
                            <span>{v.singer}</span>
                            <span style={{marginLeft:'2em'}}>{computeDuration(v.duration/1000,true)}</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>)
}

export default Player