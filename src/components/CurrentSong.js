import React, {useEffect,useState} from 'react';
import '../css/current_song.css';
import {Link} from 'react-router-dom';
import backImg from '../../static/changpian.jpg';
import {Icon} from 'antd';

const axios = require('axios')

let songPage = React.createRef()

function timeTransfer(t){
    let d = new Date(t)
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let day = d.getDate();
    let h = d.getHours();
    let m = d.getMinutes();
    return(`${year}年${month}月${day}日 ${h}:${m}`)
}

function Comments(props){
    return(<div>
        {props.comments.map((v,i)=>{
            return <div key={i} style={{borderTop:'1px solid rgb(225,225,226)',padding:'1.2em 0 1.2em 0',display:'flex',flexFlow:'row nowrap'}}>
                <div style={{borderRadius:'50%',width:'41px',height:'41px',overflow:'hidden',flex:'0 0 41px'}}>
                    <Link to='/'><img src={v.user.avatarUrl} alt="" style={{width:'100%',height:'100%'}}/></Link>
                </div>
                <div style={{marginLeft:'1em',flex:'1'}}>
                    <div><Link to='/'>{v.user.nickname}</Link>：{v.content}</div>
                    <div style={{display:'flex',flexFlow:'row wrap',justifyContent:'space-between',marginTop:'0.5em'}}>
                        {timeTransfer(v.time)}
                        <div style={{display:'flex'}}>
                            <div style={{borderRight:'1px solid #000',paddingRight:'1em'}}><Link to='/'><Icon type='like'/>&nbsp;({v.likedCount})</Link></div>
                            <div style={{borderRight:'1px solid #000',padding:'0 1em 0 1em'}}><Link to='/'>分享</Link></div>
                            <div style={{paddingLeft:'1em'}}><Link to='/'>回复</Link></div>
                        </div>
                    </div>
                </div>
                </div>
        })}
    </div>)
}
function Pagination(props) {
    let limit = props.limit || 20
    let max = props.max || props.count
    let pageNum = Math.ceil(max/limit)//total pages
    let pageArr = new Array(8).fill(0)
    useEffect(function () {

    },[max,limit])
    console.log('current page num',props.page)
    if(pageNum<10){
        let pageArr = new Array(pageNum).fill(0)
        return <div className='pagination-frame'>
            {pageArr.map((v,i)=>{
                return <div key={i+1} className={props.page===i+1?'page-on':'page-off'} index={i+1}>{i+1}</div>
            })}
        </div>
    }else if(pageNum>=10 && props.page-1<5){
     return <div className='pagination-frame'>
         {pageArr.map((v,i)=>{
             return <div key={i+1} className={props.page===i+1?'page-on':'page-off'} index={i+1}>{i+1}</div>
         })}
         <div>...</div>
         <div className={props.page===pageNum?'page-on':'page-off'} index={pageNum}>{pageNum}</div>
     </div>
    }
    else if(pageNum>=10 && pageNum-props.page<5){
        return <div className='pagination-frame'>
            <div className={props.page===1?'page-on':'page-off'} index={1}>{1}</div>
            <div>...</div>
            {pageArr.map((v,i)=>{
                return <div key={pageNum-7+i} className={props.page===pageNum-7+i?'page-on':'page-off'} index={pageNum-7+i}>{pageNum-7+i}</div>
            })}
        </div>
    }
    else{
        return <div className='pagination-frame'>
            <div className={props.page===1?'page-on':'page-off'} index={1}>{1}</div>
            <div>...</div>
            <div className='page-off' index={props.page-3}>{props.page-3}</div>
            <div className='page-off' index={props.page-2}>{props.page-2}</div>
            <div className='page-off' index={props.page-1}>{props.page-1}</div>
            <div index={props.page} className='page-on'>{props.page}</div>
            <div className='page-off' index={props.page+1}>{props.page+1}</div>
            <div className='page-off' index={props.page+2}>{props.page+2}</div>
            <div className='page-off' index={props.page+3}>{props.page+3}</div>
            <div>...</div>
            <div className={props.page===pageNum?'page-on':'page-off'}>{pageNum}</div>
        </div>
    }
}

let st
function CurrentSong(props) {
    let [song,setSong]=useState(null)
    let [lyric,setLyric]=useState([])
    let [comment,setComment]=useState(null)
    let [page,setPage]=useState(1)//offset 偏移
    let [pauseFocus,setPause]=useState(false)
    useEffect(function () {
        axios.get(`/lyric?id=${props.current.id}`,{withCredentials:true})
            .then(res=>{
                //console.log(res.data.lrc.lyric) //(d{2}):(d{2}).(d{3})
                // setLyric(res.data.lrc.lyric.split(/[\[]{1}.*]{1}/))
                let result = res.data.lrc.lyric
                let timeSpots = result.match(/[\[]{1}.*]{1}/g)
                let lyricArr = [];
                let len = timeSpots.length
                for(let i=0;i<len-1;i++){
                    let s = result.indexOf(timeSpots[i])
                    let e = result.indexOf(timeSpots[i+1])
                    let line = result.slice(s+timeSpots[i].length,e)
                    lyricArr.push([timeSpots[i].slice(1,timeSpots[i].length-1),line])
                }
                lyricArr.push([timeSpots[len-1].slice(1,timeSpots[len-1].length-1),result.slice(result.indexOf(timeSpots[len-1])+timeSpots[len-1].length)])
                // console.log(lyric)
                setLyric(lyricArr)
                // console.log(lyricArr)
            })
            .catch(err=>{console.log(err)})
        axios.get(`/song/detail?ids=${props.current.id}`,{withCredentials:true})
            .then(res=>{
                setSong(res.data.songs[0])
            })
            .catch(err=>{console.log(err)})
        axios.get((page>1?`/comment/music?id=${props.current.id}&offset=${(page-1)*20}`:`/comment/music?id=${props.current.id}`),{withCredentials:true})
            .then(res=>{
                setComment(res.data)
            })
            .catch(err=>{console.log(err)})

    },[props.current,page])
    function close() {
        songPage.current.style.width = 0;
        songPage.current.style.height = 0;
        props.closePage()
    }
    function switchPage(e) {
        let count = Math.ceil(comment.total/20)
        let newPage = Number(e.target.getAttribute('index'));
        let nav= e.target.getAttribute('nav')
        console.log(e.target)
        console.log(nav)
         if(nav==='p'){
             if(page===1){return}
             else{
                 setPage(page-1)
                 document.querySelector('.latest-c').scrollIntoView()
             }
         }
         if(nav==='n'){
             if(page===count){return}
             else{setPage(page+1)}
             document.querySelector('.latest-c').scrollIntoView()
         }
        if(newPage<1 || newPage>(count)){
            return;
        }
        setPage(newPage)
        document.querySelector('.latest-c').scrollIntoView()
    }
    function handleScroll(e){

        // document.querySelector('.whited')?document.querySelector('.whited').scrollIntoView({block:'center',behavior:'smooth'}):'';
        setPause(true)
        clearTimeout(st)
        st = setTimeout(function () {
            setPause(false)
        },200)
    }
    if(!pauseFocus){
        let el = document.querySelector('.whited')
        if(el){
            let parent = document.querySelector('.lyric')
            let scroll = el.getBoundingClientRect().top-el.offsetParent.getBoundingClientRect().top // current
            let offset = el.offsetTop
            let half = parent.getBoundingClientRect().height / 2
            parent.scrollTop = offset - 5*el.getBoundingClientRect().height - half >0? offset - 6*el.getBoundingClientRect().height - half : offset - 6*el.getBoundingClientRect().height
            // console.log('scroll is',el.offsetTop)
            // console.log('compute is ',scroll)
        }

    }
    return(song && <div className='current-frame' ref={songPage}>
        <div className='close' onClick={close} >X</div>
        <div className='top-songpage' style={{backgroundImage:`url(${song.al.picUrl})`,backgroundSize:'0',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
            <div className='animated' style={{animationPlayState:`${props.playing?'running':'paused'}`,backgroundImage:`url(${backImg})`,backgroundSize:'contain',backgroundPosition:'center',borderRadius:"50%",width:'403px',height:'403px',overflow:'hidden',position:'relative'}}>
                <img src={song.al.picUrl} alt="" style={{width:'75%',height:'75%',borderRadius:"50%",position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
            </div>
            <div className='lyric-box'>
                <h2>{song.name}</h2>
                <div style={{display:'flex',flexFlow:'row nowrap',justifyContent:'space-between'}}>
                    <span>专辑：<Link to='/'>{song.al.name}</Link></span>
                    <span>歌手：<Link to='/'>{song.ar[0].name}</Link></span>
                </div>
                <div className='lyric' onScroll={handleScroll}>{lyric.map((v,i,arr)=>{
                    // style={{color:`${(v[0]>=props.progress && arr[i+1][0]<props.progress)?'white':''}`}}
                    let within = false
                    if(i===arr.length-1){
                        if(props.progress>=v[0]){
                            within=true
                        }
                    }
                    else{
                        if(v[0]<=props.progress && arr[i+1][0]>props.progress)
                        within = true
                    }
                    return <div key={i} style={{color:`${within?'white':''}`,height:`${(v[1].trim())?'':'3em'}`}} className={within?'whited':''}>
                        {v[1]}
                    </div>
                })}</div>
            </div>
        </div>
        {comment?<div className='bot-songpage'>
            <div style={{fontSize:'2em',display:'inline-block',marginBottom:'0.3em'}}>听友评论</div><span>&nbsp;&nbsp;&nbsp;(已有{comment.total}条评论)</span>
            <hr/>
            <div className='comment-box'>comment box</div>
            {comment.hotComments && <div className='hot-c'>
                <div style={{marginBottom:'0.5em'}}>精彩评论</div>
                <Comments comments={comment.hotComments.slice(0,10)}/>
            </div>}
            <div className='latest-c'>
                <div style={{marginBottom:'0.5em'}}>最新评论（{comment.total}）</div>
                <Comments comments={comment.comments}/>
            </div>
            <div className='pagination' onClick={switchPage}>
                <div nav='p' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginRight:'0.5em'}} className={page===1?'disabled':'on-hover'}>&lt;</div>
                <Pagination count={comment.total} page={page}/>
                <div nav='n' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginLeft:'0.5em'}} className={page===Math.ceil(comment.total/20)?'disabled':'on-hover'}>&gt;</div>
            </div>
        </div>:(<div>Loading</div>)}
    </div>)
}

export default CurrentSong;
export {Pagination,Comments}