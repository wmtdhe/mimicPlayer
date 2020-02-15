import React,{useState,useEffect} from 'react'
import '../../css/playlist.css'
import {Pagination} from "../CurrentSong";
import {Link} from "react-router-dom";
import {Icon} from "antd";

const axios = require('axios')

function Playlist(props) {
    let [playlists,setLists] = useState(null)
    let [page,setPage] = useState(1)
    let [len,setLen] =useState(null)
    let [hot,setHot] = useState(null)
    let [current,setCurrent] = useState('全部')
    let [catList,switchCatList] = useState(false)
    let [subs,setSub] = useState(null)
    useEffect(function () {
        setLists(null)
        axios.get(`/playlist/hot`,{withCredentials:true})
            .then(res=>setHot(res.data.tags))
            .catch(err=>console.log(err))
        axios.get(`/top/playlist?limit=${props.location.hash.slice(1)!==1?100:99}&offset=${(props.location.hash.slice(1)-1)*100}&${props.location.search?props.location.search.slice(1):''}`)
            .then(res=>{
                console.log(`/top/playlist?${props.location.search}&limit=${props.location.hash.slice(1)!==1?100:99}&offset=${(props.location.hash.slice(1)-1)*100}`)
                setLists(res.data.playlists)
                setLen(res.data.total)
                setPage(Number(props.location.hash.slice(1))?Number(props.location.hash.slice(1)):1)
            })
            .catch(err=>console.log(err))

    },[props.location.hash,props.location.search])
    function switchPage(e) {
        let count = Math.ceil(len/100)
        let newPage = Number(e.target.getAttribute('index'));
        let nav= e.target.getAttribute('nav')
        if(nav==='p'){
            if(page===1){return}
            else{
                setPage(page-1)
                props.history.push(`${props.location.pathname+props.location.search}#${page-1}`)
                // document.querySelector('.latest-c').scrollIntoView()
            }
        }
        if(nav==='n'){
            if(page===count){return}
            else{
                setPage(page+1)
                props.history.push(`${props.location.pathname+props.location.search}#${page+1}`)
            }
            // document.querySelector('.latest-c').scrollIntoView()
        }
        if(newPage<1 || newPage>(count)){
            return;
        }
        setPage(newPage)
        props.history.push(`${props.location.pathname+props.location.search}#${newPage}`)
        // document.querySelector('.latest-c').scrollIntoView()
    }
    function showCat(e) {
        switchCatList(!catList)
        axios.get(`/playlist/catlist`,{withCredentials: true})
            .then(res=>{
                let sub = res.data.sub
                let ret = []
                for(let i=0;i<5;i++){ //0-语种 1-风格 2-场景 3-情感 4-主题
                    let temp = sub.filter((v,ii)=>{
                        return v.category===i
                    })
                    ret.push(temp)
                }
                setSub(ret)
                console.log(ret)
            })
            .catch(err=>console.log(err))
    }
    console.log(props.location.search.slice(5))
    return (playlists?<div className='playlist-frame-box'>
        <div className='tag-select' onClick={showCat}>
            {props.location.search?decodeURI(props.location.search.slice(5)):'全部歌单'}<Icon type={`${!catList?'down':''}${(catList && !subs)?'loading':''}${(catList && subs)?'down':''}`} style={{marginLeft:'0.2em',fontSize:'0.8em'}}/>
        </div>
        {catList && subs &&<div><div className='arrow'></div><div className='specific-cat'>
            <div className={`${props.location.search==''?'selected':''}`} style={{width:'100%',textAlign:'center',border:'1px solid rgb(225,225,225)',padding:'0.6em 0',fontSize:'0.9em',position:'relative'}}><Link to='/playlist'>全部歌单</Link></div>
            <div style={{display:'flex',flexFlow:'row nowrap'}}><div className='main-tag'><Icon style={{color:'rgb(224,148,148)',marginRight:'1em'}} type='global'/>语种</div>
                <div className='tag-inside'>{subs[0].map((tag,i)=>{
                    return <div key={i} className={`${props.location.search.slice(5)===encodeURI(tag.name)?'selected':''} ${tag.hot?'hot-tag':''}`}><Link to={`/playlist?cat=${tag.name}`}>{tag.name}</Link></div>
                })}</div>
            </div>
            <div style={{display:'flex',flexFlow:'row nowrap'}}><div className='main-tag'><Icon style={{color:'rgb(224,148,148)',marginRight:'1em'}} type='book'/>风格</div>
                <div className='tag-inside'>{subs[1].map((tag,i)=>{
                    return <div key={i} className={`${props.location.search.slice(5)===encodeURI(tag.name)?'selected':''} ${tag.hot?'hot-tag':''}`}><Link to={`/playlist?cat=${tag.name}`}>{tag.name}</Link></div>
                })}</div>
            </div>
            <div style={{display:'flex',flexFlow:'row nowrap'}}><div className='main-tag'><Icon style={{color:'rgb(224,148,148)',marginRight:'1em'}} type='coffee'/>场景</div>
                <div className='tag-inside'>{subs[2].map((tag,i)=>{
                    return <div key={i} className={`${props.location.search.slice(5)===encodeURI(tag.name)?'selected':''} ${tag.hot?'hot-tag':''}`}><Link to={`/playlist?cat=${tag.name}`}>{tag.name}</Link></div>
                })}</div></div>
            <div style={{display:'flex',flexFlow:'row nowrap'}}><div className='main-tag'><Icon style={{color:'rgb(224,148,148)',marginRight:'1em'}} type='smile'/>情感</div>
                <div className='tag-inside'>{subs[3].map((tag,i)=>{
                    return <div key={i} className={`${props.location.search.slice(5)===encodeURI(tag.name)?'selected':''} ${tag.hot?'hot-tag':''}`}><Link to={`/playlist?cat=${tag.name}`}>{tag.name}</Link></div>
                })}</div></div>
            <div style={{display:'flex',flexFlow:'row nowrap'}}><div className='main-tag'><Icon style={{color:'rgb(224,148,148)',marginRight:'1em'}} type='appstore'/>主题</div>
                <div className='tag-inside'>{subs[4].map((tag,i)=>{
                    return <div key={i} className={`${props.location.search.slice(5)===encodeURI(tag.name)?'selected':''} ${tag.hot?'hot-tag':''}`}><Link to={`/playlist?cat=${tag.name}`}>{tag.name}</Link></div>
                })}</div></div>
        </div>
            </div>}
        <div className='hot-tags'>热门标签 : {hot.map((tag,i)=>{return <span key={i} style={i!==0?{borderLeft:'1px solid rgb(200,200,200)'}:{}}><Link to={`/playlist?cat=${tag.name}`}>{tag.name}</Link></span>})}</div>
        <div className='playlist-frame'>
            {playlists && playlists.map((v,i)=>{
                return <div className='playlist-item' key={i}>
                    <Link to={`/songlist/detail?id=${v.id}`}>
                        <div className='watch-count'>{v.playCount<10000?v.playCount:Math.floor(v.playCount/10000)+'万'}</div>
                        <img src={v.coverImgUrl} alt=""/>
                    </Link>
                    <Link to={`/songlist/detail?id=${v.id}`}><div><span>{v.name}</span></div></Link>
                </div>
            })}
        </div>
        <div className='pagination' onClick={switchPage}>
            <div nav='p' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginRight:'0.5em'}} className={page===1?'disabled':'on-hover'}>&lt;</div>
            <Pagination count={len} page={page} limit={100}/>
            <div nav='n' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginLeft:'0.5em'}} className={page===Math.ceil(len/100)?'disabled':'on-hover'}>&gt;</div>
        </div>
    </div>:(<div style={{textAlign:'center',position:'absolute',top:'50%',left:'50%',transform:'translate(0,-50%)',fontSize:'3em'}}>
        <Icon type='loading' />加载中
    </div>))
}

export default Playlist;