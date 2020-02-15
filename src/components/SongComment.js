import React,{useEffect,useState} from "react";
import {Comments,Pagination} from "./CurrentSong";
import {Link} from "react-router-dom";
import '../css/songcomment.css'
import {Icon} from "antd";

const axios = require('axios')

function SongComment(props) {
    let [comment,setComment] = useState(null)
    let [page,setPage] = useState(1)
    let [info,setInfo] = useState(null)
    useEffect(function () {
        setComment(null)
        setInfo(null)
        axios.get(`/song/detail?ids=${props.location.search.slice(4)}`)
            .then(res=>{
                let song = res.data.songs[0]
                setInfo({name:song.name,album:song.al,artists:song.ar})
            })
            .catch(err=>{console.log(err)})
        axios.get(`/comment/music${props.location.search}&offset=${((!props.location.hash?1:Number(props.location.hash.slice(1)))-1)*20}`)
            .then(res=>{
                setComment(res.data)
            }).catch(err=>console.log(err))
        console.log(props.location.hash)
    },[props.location.search,props.location.hash])
    function switchPage(e) {
        let count = Math.ceil(comment.total/20)
        let newPage = Number(e.target.getAttribute('index'));
        let nav= e.target.getAttribute('nav')
        if(nav==='p'){
            if(page===1){return}
            else{
                setPage(page-1)
                document.querySelector('.latest-c').scrollIntoView()
                props.history.push(props.location.search+`#${page-1}`)
            }
        }
        if(nav==='n'){
            if(page===count){return}
            else{setPage(page+1)}
            document.querySelector('.latest-c').scrollIntoView()
            props.history.push(props.location.search+`#${page+1}`)
        }
        if(newPage<1 || newPage>(count)){
            return;
        }
        setPage(newPage)
        document.querySelector('.latest-c').scrollIntoView()
        props.history.push(props.location.search+`#${newPage}`)
    }

    return info && comment ?
         <div className='songlist-frame'>
             <div className='songcomment-top'>
                 <img src={info.album.picUrl+'?param=90y90'} alt=""/>
                 <div style={{padding:'1em'}}>
                     <div style={{fontSize:'1.5em',marginBottom:'0.5em'}}><strong>{info.name}</strong></div>
                     <div style={{display:'flex',flexFlow:'row nowrap',fontSize:'0.9em'}}>
                         <div style={{marginRight:'2em'}}>专辑 : <Link to={`/album?id=${info.album.id}`}>{info.album.name}</Link></div>
                         <div>歌手 : {info.artists.map((v,i,arr)=>{return <span key={i}><Link to={`/singer?id=${v.id}`}>{v.name}</Link> {i!==arr.length-1?'/':''} </span>})}</div>
                     </div>
                 </div>
             </div>
        {comment.hotComments && <div className='hot-c' style={{padding:'0 2em 0'}}>
            <div style={{marginBottom:'0.5em'}}>精彩评论</div>
            <Comments comments={comment.hotComments.slice(0,10)}/>
        </div>}
        <div className='latest-c' style={{padding:'0 2em 0'}}>
            <div style={{marginBottom:'0.5em'}}>最新评论（{comment.total}）</div>
            <Comments comments={comment.comments}/>
        </div>
        <div className='pagination' onClick={switchPage}>
            <div nav='p' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginRight:'0.5em'}} className={page===1?'disabled':'on-hover'}>&lt;</div>
            <Pagination count={comment.total} page={page}/>
            <div nav='n' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginLeft:'0.5em'}} className={page===Math.ceil(comment.total/20)?'disabled':'on-hover'}>&gt;</div>
        </div>
    </div>:(<div style={{textAlign:'center',position:'absolute',top:'50%',left:'50%',transform:'translate(0,-50%)',fontSize:'3em'}}>
            <Icon type='loading' />加载中
        </div>)
}

export default SongComment;