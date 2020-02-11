import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'antd';
import '../css/side.css'

const axios = require('axios')

function SongList(props) {
    return (<div></div>)
}
const RadioSvg = ()=>{
    return(
        <svg t="1581082284930" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="1394" width="1em" height="1em">
            <path
                d="M512 640c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z m0-170.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666667 42.666667-17.066667 42.666667-42.666667-17.066667-42.666667-42.666667-42.666667zM814.933333 857.6c-12.8 0-21.333333-4.266667-29.866666-12.8-17.066667-17.066667-17.066667-42.666667 0-59.733333 149.333333-149.333333 149.333333-392.533333 0-541.866667-17.066667-17.066667-17.066667-42.666667 0-59.733333 17.066667-17.066667 42.666667-17.066667 59.733333 0 183.466667 183.466667 183.466667 482.133333 0 665.6-8.533333 4.266667-21.333333 8.533333-29.866667 8.533333z m-605.866666 0c-12.8 0-21.333333-4.266667-29.866667-12.8-183.466667-183.466667-183.466667-482.133333 0-665.6 17.066667-17.066667 42.666667-17.066667 59.733333 0 17.066667 17.066667 17.066667 42.666667 0 59.733333-149.333333 149.333333-149.333333 392.533333 0 541.866667 17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 12.8-17.066667 17.066667-29.866666 17.066667z m482.133333-119.466667c-8.533333 0-12.8 0-17.066667-4.266666-21.333333-8.533333-29.866667-34.133333-17.066666-55.466667l12.8-12.8c81.066667-81.066667 81.066667-217.6-4.266667-298.666667-17.066667-17.066667-17.066667-42.666667 0-59.733333s42.666667-17.066667 59.733333 0c115.2 115.2 115.2 307.2 0 422.4-8.533333 0-21.333333 8.533333-34.133333 8.533333z m-358.4-4.266666c-12.8 0-21.333333-4.266667-29.866667-12.8-115.2-115.2-115.2-307.2 0-422.4 17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 17.066667 17.066667 42.666667 0 59.733333-42.666667 42.666667-64 98.133333-64 153.6 0 55.466667 21.333333 110.933333 64 149.333333 17.066667 17.066667 17.066667 42.666667 0 59.733334-8.533333 8.533333-21.333333 12.8-29.866667 12.8z"
                p-id="1395"></path>
        </svg>)
};
const MusicSvg = ()=>{return(
    <svg t="1581082614049" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="2348" width="1em" height="1em">
        <path
            d="M405.333333 270.933333l366.933334-91.733333c14.933333-6.4 27.733333-6.4 36.266666 0s12.8 14.933333 12.8 27.733333v473.6c0 21.333333-8.533333 38.4-23.466666 53.333334-14.933333 14.933333-36.266667 27.733333-64 36.266666-29.866667 8.533333-57.6 10.666667-83.2 2.133334-25.6-8.533333-42.666667-21.333333-49.066667-42.666667-6.4-21.333333-2.133333-42.666667 14.933333-64 17.066667-21.333333 40.533333-36.266667 70.4-46.933333 27.733333-8.533333 53.333333-10.666667 78.933334-4.266667v-296.533333l-341.333334 87.466666v345.6c0 14.933333-8.533333 32-25.6 51.2-17.066667 19.2-38.4 32-61.866666 38.4-29.866667 10.666667-57.6 10.666667-83.2 2.133334-25.6-8.533333-42.666667-21.333333-49.066667-42.666667-6.4-21.333333-2.133333-42.666667 14.933333-64 17.066667-21.333333 40.533333-36.266667 70.4-46.933333 27.733333-8.533333 53.333333-10.666667 78.933334-4.266667v-362.666667c0-14.933333 2.133333-25.6 8.533333-34.133333 4.266667-6.4 12.8-12.8 27.733333-17.066667z"
            p-id="2349"></path>
    </svg>)};

const RadioIcon = (props)=>(<Icon component={RadioSvg} />);
const MusicIcon = (props)=>(<Icon component={MusicSvg}/>);

function Side(props) {
    let [dropdown,switchList] = useState(true)
    let [subDrop,switchSubList] = useState(true)
    let [lists,activeList] = useState([1,0,0,0,0,0,0,0]) //default 7 categories
    let [subs,setSubs] = useState([])
    let [owns,setOwn] = useState([])
    useEffect(function () {
                    let s = []
                    let o = []
                    let list = props.sublists
                    console.log('list is: ',list)
                    for(let i=0;i<list.length;i++){
                        if(list[i].subscribed){
                            s.push(list[i])
                        }else{
                            o.push(list[i])
                        }
                    }
                    setSubs(s)
                    setOwn(o)
                    let extra = props.sublists.length-1
                    if(extra>0){
                        let newL = new Array(7+extra).fill(0)
                        newL[0]=1
                        activeList(newL)
                    }
                    // console.log('自己的 ',o)
                    // console.log('别人的 ',s)
        console.log('sublists now is: ', props.sublists)
        console.log('s now is: ', s)
                    if(props.playing){
                        let side = document.querySelector('.side-frame')
                        let preview = document.querySelector('.preview-frame')
                        let shorten = preview.getBoundingClientRect().height
                        // side.style.height = side.getBoundingClientRect().height-shorten+1 < 77+'vh'?77+'vh':side.getBoundingClientRect().height-shorten+1+'px'
                        side.style.height = 77+'vh'
                        console.log('shorten is ',shorten)
                    }else{
                        let side = document.querySelector('.side-frame')
                        side.style.height = ''
                    }
    },[props.sublists.length,props.playing]) //should be playlists

    function toggleList() {
        switchList(!dropdown)
    }
    function activeSec(e) {
        let activated = e.target.id
        let newLists = lists.map((list,i)=>{
            if(activated==i){
                return 1
            }
            return 0
        })
        console.log('target is: ', e.target.id)
        // console.log(newLists)
        activeList(newLists)

    }
    // console.log('sub is ', subs)
    return(
        <div className='side-frame'>
            <div className='recommend'>
                <span>推荐</span>
                <ul onClick={activeSec}>
                    <Link to='/'><li className={lists[0]===1?'active':''} id={0}><Icon type="customer-service"/>&nbsp;&nbsp;发现音乐</li></Link>
                    <Link to='/personalFm'><li className={lists[1]===1?'active':''}id={1}><RadioIcon/>&nbsp;&nbsp;私人FM</li></Link>
                    <Link to='/video'><li className={lists[2]===1?'active':''}id={2}><Icon type="video-camera" />&nbsp;&nbsp;视频</li></Link>
                    <Link to='/friends'><li className={lists[3]===1?'active':''}id={3}><Icon type="team" />&nbsp;&nbsp;朋友</li></Link>
                </ul>
            </div>
            <div className='my-music'>
                <span>我的朋友</span>
                <ul onClick={activeSec}>
                    <Link to='/local'><li className={lists[4]===1?'active':''}id={4}><MusicIcon/>&nbsp;&nbsp;本地音乐</li></Link>
                    <Link to='download'><li className={lists[5]===1?'active':''}id={5}><Icon type="download" />&nbsp;&nbsp;下载管理</li></Link>
                </ul>
            </div>
            <div className='create-new'>
                <div className='create-action'>
                    <span>创建新的歌单</span>
                    <span>
                        <span style={{paddingRight:'0.2em'}}  id='add-list'>
                            <Icon type="plus-circle"   id='p'/>
                        </span>
                        <span onClick={toggleList} id='toggle-list' >
                            <Icon type="down-circle"  id='d'/>
                        </span>
                    </span>
                </div>
                <ul style={{display:dropdown?"block":"none"}} onClick={activeSec}>
                    <Link to='/lists/fav'><li className={lists[6]===1?'active':''} id={6}><Icon type="heart"/>&nbsp;&nbsp;我喜欢的音乐</li></Link>
                </ul>
            </div>
            {props.status && <div className='subscribed-songlist'>
                <div className='create-action'>
                    <span>收藏的歌单</span>
                    <span>
                        <span onClick={(e)=>{switchSubList(!subDrop)}} id='sub-toggle' >
                            <Icon type="down-circle"  id='d'/>
                        </span>
                    </span>
                </div>
                <ul style={{display:subDrop?"block":"none"}} onClick={activeSec}>
                    {/*<Link to='/lists/fav'><li className={lists[6]===1?'active':''}id={6}><Icon type="heart"/>我喜欢的音乐</li></Link>*/}
                    {subs && subs.map((sublist,i)=>{
                        return <Link to={`/songlist/detail?id=${sublist.id}`} key={i} ><li className={`${lists[owns.length-1+6+i+1]===1?'active':''} ellipsis`} id={owns.length-1+6+i+1} title={sublist.name}><Icon type='unordered-list'/>&nbsp;&nbsp;{sublist.name}</li></Link>
                    })}
                </ul>
            </div>}
        </div>
    )
}

export default Side;