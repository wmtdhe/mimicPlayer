# mimicPlayer
## 基本介绍
用React做的仿网易云音乐播放器。
## 使用工具
* <code>React</code>
* <code>React-Router</code>
* <code>Redux</code>
* <code>axios</code>
* <code>antd - Icon, Avatar</code>
* server-side来自于https://github.com/Binaryify/NeteaseCloudMusicApi
## 实现功能
* pages - 歌单/专辑/搜索(歌曲&歌单)/主页(banners&歌单&最新歌曲)/歌曲评论/
* 音乐播放/暂停/切歌/调试音量&进度/歌词界面
* 搜索歌曲
* 登录/登出
* 登录后创建/收藏/删除歌单
* 歌单,专辑 - 播放全部/添加/关键字搜索
* 播放列表 - 播放/收藏(需要登录)&删除歌曲/查看评论/本地保存播放列表中的歌曲
## 使用方法
<code>server-side</code>请参考上述使用工具中的repository
```
git clone https://github.com/wmtdhe/mimicPlayer.git
development mode: 
npm run dev
production mode:
npm run build
```
