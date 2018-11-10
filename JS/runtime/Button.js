import { DataStore } from "../base/DataStore.js"
import {main} from "../runtime/main.js"
import {Director} from "../runtime/Director.js"

export class Button {
  constructor(){
    this.datastore = DataStore.getInstance();
    this.musicOff = false;
    this.director = Director.getInstance()
    
    // this.main = new main();
  }
  playMusic() { //背景音乐
    console.log('bgm')
    const bgm = wx.createInnerAudioContext();
    this.bgm = bgm
    bgm.loop = true;
    bgm.obeyMuteSwitch = false;
    bgm.src = 'music/Flamingo.mp3';
    bgm.play();
    wx.onAudioInterruptionEnd(function () {//中断结束后重开BGM
      bgm.play();
    })

  }
  musicButton() { //音乐开关
    let Button = wx.createUserInfoButton({
      type: 'text',
      text: '',
      style: {
        left: 0,
        top: 0,
        width: this.datastore.images.get('music').width / 5,
        height: this.datastore.images.get('music').height / 5,
      }
    })
    Button.show()
    Button.onTap((res) => {
      if (!this.musicOff) {
        console.log('关闭bgm')
        this.bgm.pause();
        this.musicOff = true;
      }
      else {
        console.log('播放bgm')
        this.bgm.play();
        this.musicOff = false;
      }
    })
  }

  reStartButton() { //重开按钮
    let Button = wx.createUserInfoButton({
      type: 'text',
      text: '',
      style: {
        left: this.datastore.canvas.width-this.datastore.images.get('restart').width/5,
        top: (this.datastore.canvas.height+this.datastore.canvas.width-20)/2,
        width: this.datastore.images.get('restart').width/5,
        height: this.datastore.images.get('restart').height/5,
      }
    })
    Button.show()
    Button.onTap((res) => {     
      console.log('重开')
      this.director.xyDictInit() //map重置
      this.datastore.context.clearRect(11.5, (this.datastore.canvas.height - this.datastore.canvas.width+20)/2,
      this.datastore.canvas.width-20,
      this.datastore.canvas.width-20)
      this.director.chessBoardInit() //棋盘重置
      wx.request({
        url: 'https://www.leslie2018.com',
        data: {
          token: 0,   // 微信用户的token标识 前端提供
          apply_game: "0", // 0表示申请开始游戏，1表示不申请  前端提供        
          location: JSON.stringify(0,0), // 当前用户移动的坐标 
          restart: 1
          //restart: this.restart
        },
        method: "POST",
        dataType: 'json',

        header: {
          "content-type": "application/x-www-form-urlencoded",
          charset: 'UTF-8'
        },
        success: function (res) { //接收
          // console.log(res)
        }
      })
    })
  }
}