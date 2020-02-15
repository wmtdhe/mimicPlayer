import React, {useState, useEffect, createRef} from 'react';
import {Link} from 'react-router-dom'
import Carousel from "./Carousel";
import '../../css/personalrec.css'
const axios = require('axios')

//requests
function getBanner(){
    return axios.get('/banner',{withCredentials:true})
}
function getPersonalizedList() {
    return axios.get('/personalized?limit=10',{withCredentials:true})
}
function getPrivateContent() {
    return axios.get('/personalized/privatecontent',{withCredentials:true})
}

const flex = createRef()
class PersonalRec extends React.Component{
    constructor(props){
        super(props)
        this.state={
            banners:[],
            recSongLists:[],
            privateContent:[],
            newSong:[],
            personalizedMv:[],
            djProgram:[],
            djShows:5
        };
        this.showEditor = this.showEditor.bind(this)
        this.newSongPlay = this.newSongPlay.bind(this)
    }
    componentDidMount() {
        axios.get('/banner', {
            withCredentials: true,
        })
            .then(res => {
                console.log(res.data)
                this.setState({banners:res.data.banners})
            })
            .catch(err => {
                console.log(err)
            })
        axios.get('/personalized?limit=10',{withCredentials: true})
            .then(res=>{
                this.setState({recSongLists:res.data.result})
            })
            .catch(err=>console.log(err))
        axios.get('/personalized/privatecontent',{withCredentials:true})
            .then(res=>{this.setState({privateContent:res.data.result})}).catch(err=>console.log(err))
        axios.get('/personalized/newsong',{withCredentials:true})
            .then(res=>{console.log(res.data.result.length); this.setState({newSong:res.data.result})})
            .catch(err=>{console.log(err)})
        axios.get('/personalized/mv',{withCredentials:true})
            .then(res=>{this.setState({personalizedMv:res.data.result})}).catch(err=>{console.log(err)})
        axios.get('/personalized/djprogram',{withCredentials:true})
            .then(res=>{this.setState({djProgram:res.data.result})}).catch(err=>{console.log(err)})

        let w = flex.current.getBoundingClientRect().width
        if(w>1000){
            this.setState({djShows:6})
        }else{
            this.setState({djShows:5})
        }
        console.log('w is ',w)

        //concurrency
        // axios.all([getBanner(),getPersonalizedList(),getPrivateContent()])
        //     .then(axios.spread(function (acct,perms) {
        //         console.log(acct)
        //         // console.log(perms)
        //     }))
    }
    showEditor(){

    }
    newSongPlay(e,id){
        axios.get(`/song/detail?ids=${id}`,{withCredentials:true})
            .then(res=>{
                let song = res.data.songs[0]
                axios.get(`/check/music?id=${song.id}`)
                    .then(res=>{
                        let dup = false
                        for(let i=0;i<this.props.songList.length;i++){
                            if(song.id===this.props.songList[i].id){
                                dup=true
                                break
                            }
                        }
                        if(!dup){
                            let obj ={name:song.name,id:song.id,duration:song.dt,singer:song.ar[0].name,albumId:song.al.id,albumName:song.al.name}
                            this.props.dbClick(obj,this.props.songList.length)
                        }else{
                            console.log('duplicate')
                        }
                    })
                    .catch(err=>404)
            }).catch(err=>{console.log(err)})
    }
    render(){

        return <div className='personal-frame'>
            <Carousel banners={this.state.banners} dbClick={this.props.dbClick} songList={this.props.songList}/>
            <div className='reclist-frame'>
                <div className='headline1'><span className='hl1'><strong>推荐歌单</strong></span><Link to='/playlist' className='hl2'><span>更多></span></Link></div>
                <hr/>
                <div className='list-box' onMouseOver={this.showEditor}>
                    {this.state.recSongLists && this.state.recSongLists.map((v,i)=>{
                        return <div className='rec-songlist' key={i}>
                                <Link to={`/songlist/detail?id=${v.id}`}>
                                <div className='watch-count'>{`${Math.floor(v.playCount/10000)}万`}</div>
                                <div className='editor-rec'>{v.copywriter}</div>
                                <img src={v.picUrl} alt=""/>
                                </Link>
                                <Link to={`/songlist/detail?id=${v.id}`}><div><span>{v.name}</span></div></Link>
                        </div>
                    })}
                </div>
            </div>
            <div className='private-frame'>
                <div className='headline1'><span className='hl1'><strong>独家放送</strong></span><Link to='/' className='hl2'><span>更多></span></Link></div>
                <hr/>
                <div className='private-item-box'>
                    {this.state.privateContent && this.state.privateContent.map((v,i)=>{
                        return <div className='private-item' key={i}>
                            <img src={v.sPicUrl} alt=""/>
                            <div><span>{v.name}</span></div>
                        </div>
                    })}
                </div>
            </div>
            <div className='new-song-frame'>
                <div className='headline1'><span className='hl1'><strong>最新音乐</strong></span><Link to='/' className='hl2'><span>更多></span></Link></div>
                <hr/>
                <div className='new-song-box'>
                    {this.state.newSong && this.state.newSong.map((v,i)=>{
                        return <div className='new-song' key={i} onDoubleClick={(e)=>this.newSongPlay(e,v.id)}>
                            <span>{`${i<9?'0'+(i+1):10}`}</span>
                                <Link to='/'><img src={v.picUrl} alt=""/></Link>
                            <div className='name-sec'>
                                <div><span>{v.name}</span></div>
                                <Link to='/'><span>{v.song.artists[0].name}</span></Link>
                            </div>
                        </div>
                    })}
                </div>
            </div >
            <div className='personalizedmv-frame'>
                <div className='headline1'><span className='hl1'><strong>推荐MV</strong></span><Link to='/' className='hl2'><span>更多></span></Link></div>
                <hr/>
                <div className='personalmv-box'>
                    {this.state.personalizedMv && this.state.personalizedMv.map((v,i)=>{
                        return <div className='mv-item' key={i}>
                            <div className='watch-count'>{v.playCount>100000?`${Math.floor(v.playCount/10000)}万`:v.playCount}</div>
                            <div className='editor-rec'>{v.copywriter}</div>
                            <img src={v.picUrl} alt=""/>
                            <div><span>{v.name}</span></div>
                            <div><span>{v.artistName}</span></div>
                        </div>
                    })}
                </div>
            </div>
            <div className='dj-frame'>
                <div className='headline1'><span className='hl1'><strong>主播电台</strong></span><Link to='/' className='hl2'><span>更多></span></Link></div>
                <hr/>
                <div className='dj-box' ref={flex}>
                    {this.state.djProgram && this.state.djProgram.map((v,i)=>{
                        if(i>=this.state.djShows){return}
                        return <div className='dj-item' key={i}>
                            <img src={v.picUrl} alt=""/>
                        <div><span>{v.name}</span></div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}

export default PersonalRec;