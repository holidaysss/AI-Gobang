//初始化游戏的精灵，游戏的入口(初始化)
import {ResourceLoader} from "../base/ResourceLoader.js";
import {Director} from "./Director.js"
import {BackGround} from "./BackGround.js"
import {DataStore} from "../base/DataStore.js"
import {Avatar} from "./Avatar.js"
import {BlackF} from "./BlackF.js"
import {StartButton} from "../player/StartButton.js"

export class main {

  constructor() {
    this.n=1;
    this.restart=false; //重启标志
    this.director = Director.getInstance();  //导演单例
    this.canvas= wx.createCanvas();
    this.image = wx.createImage();
    this.screenX=null;
    this.screenY=null;
    this.chessXY=null;
    this.map = this.director.getXY()
    this.context = this.canvas.getContext('2d'); //2d画布
    this.datastore = DataStore.getInstance(); //创建数据仓库单例
    this.datastore.canvas = this.canvas; //储存画布属性
    const loader = ResourceLoader.create();
    this.context.fillStyle = 'white';
    this.context.fillRect(0,0, 10000, 10000);
    var imgB = wx.createImage();
    this.context.fill();
    loader.onLoaded(map => this.onResourceFirstLoaded(map)) //资源加载后执行
  }

  backGroundMusic() { //背景音乐
    const bgm = wx.createInnerAudioContext();
    
    bgm.loop=true;
    bgm.obeyMuteSwitch = false;
    bgm.src ='music/爱在从前.mp3';
    bgm.play();
    setTimeout(function(){
      bgm.pause();
    },200000) //ms后停止
  }

  findLatestXY(e) { //找到点击最近的 棋盘点屏幕坐标
    Loop1:
    for (var i = 0; i < 15; i++) {
      Loop2:
      for (var j = 0; j < 15; j++) {
        var mapY = null
        if (this.director.getXY().get(String(i) + ',' + String(j))){
          var mapY = this.director.getXY().get(String(i) + ',' + String(j))[1]
          } //获取棋盘坐标[i,j]的屏幕y坐标
        else {
          break Loop1;
        }
        const perCellSize = this.director.getXY().get("1,0")[0] - this.director.getXY().get("0,0")[0] //获取棋盘每格的宽
        if (mapY <= e.touches[0].clientY && e.touches[0].clientY < mapY + perCellSize / 2) { //四舍五入求最近y坐标
          this.screenY = mapY;
          break Loop2;
        }
        else if (mapY + perCellSize / 2 <= e.touches[0].clientY && e.touches[0].clientY < mapY + perCellSize) {
          this.screenY = mapY + perCellSize;
          break Loop2;
        }
        else if(j==14){
          console.log('y')
          console.log('请在棋盘内下棋')    
        }
      } //Loop2

      var mapX = null
      if(this.director.getXY().get(String(i) + ',' + String(j))) {
        var mapX = this.director.getXY().get(String(i) + ',' + String(j))[0]
        } //获取棋盘坐标[i,j]的屏幕x坐标
      else {
        break Loop1;
      }
      const perCellSize = this.director.getXY().get("1,0")[0] - this.director.getXY().get("0,0")[0]
      if (mapX <= e.touches[0].clientX && e.touches[0].clientX < mapX + perCellSize / 2) {
        this.screenX = mapX;
        break Loop1;
      }
      else if (mapX + perCellSize / 2 <= e.touches[0].clientX && e.touches[0].clientX < mapX + perCellSize) {
        this.screenX = mapX + perCellSize;
        break Loop1;
      }
      else if (i==14) {
        console.log('x')
        console.log('请在棋盘内下棋')
      }
    }
    return [this.screenX, this.screenY]
  }

  drawChess(i) { //参数为落子的棋盘坐标 i: 'x,y' 
    if (this.n < 0) { //黑先
      this.image.src = 'images/white.png'
    }
    else {
      this.image.src = 'images/black.png'
    }
    var screenX = this.map.get(i)[0] //通过棋盘坐标获取屏幕坐标screenX, screenY
    var screenY = this.map.get(i)[1]
    this.context.drawImage( //落子
      this.image, 0, 0,
      this.image.width, this.image.height,
      screenX - this.image.width/2.6, screenY - this.image.height/2.6,
      this.image.width/1.3, this.image.height/1.3)
    this.map.set(i, [screenX, screenY, this.n])
    this.n = this.n * -1; //换手
    // console.log(screenX,screenY)
    // console.log(this.map.get(i))
  }

  onResourceFirstLoaded(map) { //资源第一次加载后执行
    this.director.formMap();
    this.datastore.context = this.context; //数据仓库单例例增加画布属性
    this.datastore.images = map; //实例增加类属性images 存放图片集合map 
    this.datastore
      .put( //从类属性images获取数据，放进类属性map
        'chessboard',
        new BackGround()
      )
      .put( //注册头像数据
        'avatar',
        new Avatar()
      )
      .put('start', new StartButton())
    this.director.startBefore() //开始游戏前的画面
    
    this.registerEvent();
    wx.onAudioInterruptionEnd(function () {//中断结束后重开BGM
      bgm.play()
    })
  }

  registerEvent() { //开始游戏，初始化
    this.canvas.addEventListener('touchend', e=> {
      // console.log(this.director.isGameOver())
      if (this.director.isGameOver()) {
        // console.log(this.director.isGameOver())
        console.log('游戏开始')
        this.init();
        this.backGroundMusic(); //播放背景音乐
      }
    })
  }

  init() {
    this.director.run(); //导演："Action!"   
    wx.onTouchStart((e, n = this.n) => { //点击，交替落子
      var [screenX, screenY] = this.findLatestXY(e) //获取点击的最近棋盘点屏幕坐标  
      var mapKeys = this.director.getMapKeys();
      for (let i of mapKeys) { // 转化为棋盘坐标
        if (String(this.map.get(i)[0]).substr(0, 3) == String(screenX).substr(0, 3) &&
          String(this.map.get(i)[1]).substr(0, 3) == String(screenY).substr(0, 3)) {
          if (this.map.get(i)[2]==0 && this.n==1) { //判断位为0且为白子
            this.chessXY = i;
            console.log("chessXY: " + this.chessXY)
            
            this.drawChess(i)
            break;
          }
          else { //重复下棋无效
            this.chessXY=null
            console.log("chessXY: " + this.chessXY)
            console.log("不能重复下子！")
          }
        }
      }
      if (this.n==-1 && this.chessXY != null) { //玩家执白，AI执黑
        var that=this
        wx.request({
          url: 'https://www.leslie2018.com',
          data: {
            token: 0,   // 微信用户的token标识 前端提供
            apply_game: "0", // 0表示申请开始游戏，1表示不申请  前端提供
            location: JSON.stringify(this.chessXY), // 当前用户移动的坐标 
          },
          method: "POST",
          dataType: 'json',
          
          header: {
            "content-type": "application/x-www-form-urlencoded",
            charset: 'UTF-8'
          },
          success: function(res){ //接收
            console.log('success');
            console.log(res.data);
            if (res.data == '0'){
              console.log('很遗憾，你输了')
            }
            else if (res.data == '1'){
              console.log('恭喜，你赢了！！！')
            }
            else {
              that.drawChess(res.data)
              console.log('AI小阿尔法出棋：' + res.data)
            }
          },

          fail: function (res) {
            console.log('submit fail');
          },
          // complete: function (res) {
          //   console.log('submit complete');
          // }
        })

      }
    })
  wx.onTouchEnd((e) =>{
    if ((this.datastore.canvas.width-this.datastore.images.get('restart').width/5)<e.changedTouches[0].clientX && 
      (this.datastore.canvas.height+this.datastore.canvas.width-20)/2<e.changedTouches[0].clientY) {    
      // this.n=1
      // this.restart=true
      console.log('重开')
      // this.init()
      // this.datastore.destroy()
      
    }
  })
  if(this.restart) {
    console.log(this.n)
    return
  }
  }
}