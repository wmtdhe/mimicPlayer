import React, {useState,useEffect,createRef} from "react";
import {Link} from 'react-router-dom';
import '../css/search_result.css';
import {toastShow} from "./SongList";
import {Pagination} from "./CurrentSong";

const axios = require('axios');
const toastRef = createRef()

function SearchType(props) {

}
function computeDuration(t) { //transfer time into readable
    let seconds = t/1000
    let min=parseInt(seconds/60)
    let sec=Math.floor(seconds-min*60) //toFixed() will round to next / carry
    return `${min<10?('0'+min):min}:${sec<10?('0'+sec):sec}`
}

/**
 * 判断是否可听
 * @param songs
 * @returns an array of promise instances 一个promise实例数组
 */
function validate(songs) {
    let ret = songs.map((v,i)=>{
        return axios.get(`/check/music?id=${v.id}`).then(res=>200).catch(err=>404) //有自己的catch不会触发promise.all的catch
    })
    // console.log('validate is: ',ret)
    return ret
}

function Search(props) {
    let [result,setResult]=useState([])
    let [focus,setFocus]=useState(null)
    let [page,setPage]=useState(1)
    let [count,setCount]=useState(0)
    useEffect(function () {
        // console.log(`/search${props.location.query}`)
        let page = Number(props.location.hash?props.location.hash.slice(1):1)
        console.log(page,'------------')
        axios.get(`/search${props.location.search}&limit=100&offset=${(page-1)*100}`,{withCredentials:true})
            .then(res=>{
                let songs = res.data.result.songs
                axios.all(validate(songs)).then(axios.spread(function () {
                    // console.log('hahahahaha')
                    // console.log(arguments)
                    let ret = []
                    for(let i=0;i<arguments.length;i++){
                        ret[i]=Object.assign({},songs[i],{valid:arguments[i]})
                    }
                    // console.log(ret)
                    setResult(ret)
                    setCount(res.data.result.songCount) // only first 5 pages are shown
                    setPage(page)
                })).catch((err)=>{console.log(err)})
                // setResult(ret)

            }).catch(err=>console.log(err))
    },[props.location.search,props.location.hash])
    function focused(e,index) {
        setFocus(index)
        e.stopPropagation()
    }
    function playSong(e,index) {
        let song = result[index]
        if(song.valid===404){
            toastShow(toastRef)
            return;
        }
        let i = props.songList.length
        console.log('length is ',i)
        let dupIndex;
        let noduplicate = props.songList.every((v,ii)=>{
            if(v.id!==song.id){
                return true
            }else{
                dupIndex = ii //歌曲已在列表中存在但不是当前播放曲目
                return false
            }
        })
        if(noduplicate){
            let songObj = {
                id:song.id,
                name:song.name,
                duration:song.duration,
                singer:song.artists[0].name,
                albumId:song.album.id
            }
            props.dbClick(songObj,i)//add song to playlist
        }else{
                if(dupIndex!==props.playing){
                    props.playExistingSong(dupIndex)
                }else{
                    alert('已经开始播放')
                }
        }
    }
    function switchPage(e) {
        let count = Math.ceil((count>500?500:count)/100) //page counts
        let newPage = Number(e.target.getAttribute('index'));
        let nav= e.target.getAttribute('nav')
        console.log(e.target)
        console.log(nav)
        if(nav==='p'){
            if(page===1){return}
            else{
                setPage(page-1)
                props.history.push(`/search?keywords=s#${page-1}`)
                return
            }
        }
        if(nav==='n'){
            if(page===count){return}
            else{
                setPage(page+1)
                props.history.push(`/search?keywords=s#${page+1}`)
                return
            }
        }
        if(newPage<1 || newPage>(count)){
            return;
        }
        setPage(newPage)
        props.history.push(`/search?keywords=s#${newPage}`)
    }
    return <div className='search-result-frame'>
        <div className='toast-frame' ref={toastRef}>因合作方要求，您所在的地区暂时无法播放</div>
        <div className='result-box'>
            {result?(<div className='results'>
                <div className='result-row-flex' >
                    <div className='result-row-flex-item flex1'></div>
                    <div className='result-row-flex-item flex1'>操作</div>
                    <div className='result-row-flex-item flex2'>音乐标题</div>
                    <div className='result-row-flex-item flex3'>歌手</div>
                    <div className='result-row-flex-item flex4'>专辑</div>
                    <div className='result-row-flex-item flex5'>时长</div>
                    <div className='result-row-flex-item flex6'>热度</div>
                </div>
                {
                    result.map((v,i)=>{
                        return <div key={i} className={`result-row-flex ${i%2!==0?'even':''} ${focus==i?'focused':''}`} onClick={(e)=>focused(e,i)} onDoubleClick={(e)=>playSong(e,i)}>
                            <div className='flex1' style={{textAlign:'right'}}>{`${i+1<=9?((page-1)>0?(page-1)+'0'+(i+1):'0'+(i+1)):(page-1>0?(i+1===100?page*100:(page-1)+''+(i+1)):i+1)}`}</div>
                            <div className='flex1'>{}</div>
                            <div className={`flex2 ${v.valid===404?'restricted':''}`}>{v.name}</div>
                            <div className='flex3'>{v.artists[0].name}</div>
                            <div className='flex4'>{v.album.name}</div>
                            <div className='flex5'>{computeDuration(v.duration)}</div>
                            <div className='flex6'>{}</div>
                        </div>
                    })
                }
                <div className='pagination' onClick={switchPage}>
                    <div nav='p' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginRight:'0.5em'}} className={page===1?'disabled':'on-hover'}>&lt;</div>
                    <Pagination page={page} count={count} limit={100} max={count>500?500:count}/>
                    <div nav='n' style={{boxSizing:'border-box',border:'1px solid rgb(194,194,196)',padding:'0 0.5em 0 0.5em',marginLeft:'0.5em'}} className={page===Math.ceil((count>500?500:count)/100)?'disabled':'on-hover'}>&gt;</div>
                </div>
            </div>):(<div>很抱歉，未能找到与{props.location.search.slice(10)}相关的任何单曲</div>)}
        </div>
    </div>
}

export default Search

export {validate};
