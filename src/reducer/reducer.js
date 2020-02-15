import {combineReducers} from "redux";

import {PLAY_SONG,DELETE_ALL,DELETE_SONG,ADD_SONG,ADD_ALL,OPEN_SONGPAGE,CLOSE_SONGPAGE,SWITCH,TIME_UPDATE,LOG_IN,LOG_OUT,SUBSCRIBE,UNSUBSCRIBE,LOGOUT_UNSUBSCRIBE} from "../action/action";


//one state tree--- store
function logStatus(state=null,action) {
    switch (action.type) {
        case LOG_IN:
            return action.info
        case LOG_OUT:
            return null
        default:
            return state
    }
}

function songList(state=[],action) {
    switch (action.type) {
        case ADD_SONG:
            let newArr = [...state,
                {
                    name:action.songObj.name,
                    id:action.songObj.id,
                    duration:action.songObj.duration,
                    singer:action.songObj.singer,
                    albumId:action.songObj.albumId
                }
            ]
            localStorage.setArr('local',newArr)
            return newArr
        case ADD_ALL:
            if(action.i===null){
                // window.localStorage.setItem('local',JSON.stringify([...state,...action.songs]))
                localStorage.setArr('local',[...state,...action.songs])
                return [...state,...action.songs]
            }
            else{
                // --- need to remove duplicates
                let newArr = state.slice(0,action.i+1).concat([...action.songs]).concat(state.slice(action.i+1))
                localStorage.setArr('local',newArr)
                return newArr
            }
        case DELETE_ALL:
            localStorage.setArr('local',[])
            return []
        case DELETE_SONG:
            let newA = state.slice(0)
            newA.splice(action.index,1)
            localStorage.setArr('local',newA)
            return newA
        default:
            return state
    }
}

function playing(state=null,action) {
    switch (action.type) {
        case PLAY_SONG:
            return action.index
        default:
            return state;
    }
}

function open(state=false,action) {
    if(action.type===OPEN_SONGPAGE){
        return true
    }
    else if(action.type===CLOSE_SONGPAGE){
        return false
    }
    return state
}

function playStatus(state=true,action) {
    if(action.type===SWITCH){
        return action.status
    }
    return state
}
function progress(state=0,action) {
    if(action.type===TIME_UPDATE){
        return action.t //new progress
    }
    return state
}

function sublists(state=[],action) {
    switch (action.type) {
        case (SUBSCRIBE):
            if(action.f){ //f here means new subscribed songs -- will be added from start
                let arr = state.map((v,i)=>v)
                let p = 0
                for(let j=0;j<arr.length;j++){
                    if(!arr[j].subscribed){
                        p++
                    }else{
                        break
                    }
                }
                arr.splice(p,0,action.playlist)
                return arr
            }
            else if(action.c){
                let arr = state.map((v)=>v)
                arr.splice(1,0,action.playlist)
                return arr
            }
            else{
                return [...state,action.playlist];
            }
        case (UNSUBSCRIBE):
            let newlist = []
            for(let i=0;i<state.length;i++){
                if(action.id===i)continue;
                else{
                    newlist.push(state[i])
                }
            }
            return newlist;
        case(LOGOUT_UNSUBSCRIBE):
            return [];
        default:
            return state
    }
}
const musicBase = combineReducers({
    songList, //in the play pod
    playing,
    open,
    playStatus,
    progress,
    logStatus,
    sublists
})


export default musicBase