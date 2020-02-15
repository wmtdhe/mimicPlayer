export const PLAY_SONG = 'PLAY_SONG' //add song
export const DELETE_ALL = 'DELETE_ALL'
export const DELETE_SONG = 'DELETE_SONG'
export const ADD_ALL = 'ADD_ALL'
export const ADD_SONG = 'ADD_SONG'
export const OPEN_SONGPAGE = 'OPEN_SONGPAGE'
export const CLOSE_SONGPAGE = 'CLOSE_SONGPAGE'
export const SWITCH = 'SWITCH' //play/pause
export const TIME_UPDATE = 'TIME_UPDATE'
export const LOG_IN = 'LOG_IN' //log status changes
export const LOG_OUT = 'LOG_OUT'
export const SUBSCRIBE = 'SUBSCRIBE'
export const UNSUBSCRIBE = 'UNSUBSCRIBE'
export const LOGOUT_UNSUBSCRIBE = 'LOGOUT_UNSUBSCRIBE'

//action
function playsong(index){
    return {
        type:PLAY_SONG,
        // id:id,
        index:index //id---song id, index ---- position in song list
    }
} //play a song
function addSong(songObj) {
    return {
        type:ADD_SONG,
        songObj:songObj
    }
} //add a song to playlist
function deleteSong(i){
    return {
        type:DELETE_SONG,
        index:i
    }
}
function deleteAll() {
    return{
        type:DELETE_ALL
    }
} //delete songs in playlist
function addAll(songs,i=null) {
    return{
        type:ADD_ALL,
        songs:songs, //[songObj,]
        i:i
    }
} //add all playable songs in a songlist to playlist

function openSongPage() {
    return {
        type:OPEN_SONGPAGE
    }
}

function closeSongPage() {
    return {
        type:CLOSE_SONGPAGE
    }
}
function switchStatus(status) {
    return{
        type:SWITCH,
        status:status
    }
}

function timeUpdate(t) {
    return{
        type:TIME_UPDATE,
        t:t
    }
}

function logIn(info) {
    return {
        type:LOG_IN,
        info:info
    }
}
function logOut() {
    return {
        type:LOG_OUT
    }
}

function subscribe(playlist,f=false,c=false) {
    return {
        type:SUBSCRIBE,
        playlist:playlist,
        f:f, //add from before/after t - before, f - after
        c:c //if create a playlist?
    }
}
function unsubscribe(id) {
    return {
        type:UNSUBSCRIBE,
        id:id
    }
}
function logout_unsubscribe() {
    return{
        type:LOGOUT_UNSUBSCRIBE
    }
} //clean sublists reducer

export {
    playsong, //add a song
    deleteAll,
    addAll,
    addSong,
    deleteSong,
    openSongPage,
    closeSongPage,
    switchStatus,
    timeUpdate,
    logIn,
    logOut,
    subscribe,
    unsubscribe,
    logout_unsubscribe
}