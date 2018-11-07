//初始化游戏的精灵，游戏的入口(初始化)
import {ResourceLoader} from "../base/ResourceLoader.js";
import {Director} from "./Director.js"
import {BackGround} from "./BackGround.js"
import {DataStore} from "../base/DataStore.js"
import {StartButton} from "../player/StartButton.js"
import {API} from "../runtime/API.js"
import {Button} from "./Button.js"


export class main {

  constructor() {
    this.doFirst()
  }

  doFirst() {
    this.restart = false; //重启标志
    this.musicOff = true; //bgm暂停标志
    this.button = new Button()
    this.director = Director.getInstance();  //导演单例
    this.canvas = wx.createCanvas();
    this.image = wx.createImage();
    this.context = this.canvas.getContext('2d'); //2d画布
    this.datastore = DataStore.getInstance(); //创建数据仓库单例
    this.datastore.canvas = this.canvas; //储存画布属性
    const loader = ResourceLoader.create();
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, 10000, 10000);
    this.context.fill();
    loader.onLoaded(map => this.onResourceFirstLoaded(map)) //资源加载后执行
  }

  onResourceFirstLoaded(map) { //资源第一次加载后执行
    console.log('onResourceFirstLoaded')
    this.director.formMap();
    this.datastore.context = this.context; //数据仓库单例例增加画布属性
    this.datastore.images = map; //实例增加类属性images 存放图片集合map 
    this.datastore
      .put( //从类属性images获取数据，放进类属性map
        'chessboard',
        new BackGround()
      )
      
      .put('start', new StartButton())
    this.director.startBefore() //开始游戏前的画面
    const user = new API(); //用户接口
    user.getUserInfo(); //用户授权
    user.login(); //获取用户登陆信息
    user.getSetting();
    this.registerEvent();
    
  }

  registerEvent() { //开始游戏，初始化
    console.log('registerEvent')
    wx.onTouchEnd((e) => {
      if (this.director.isGameOver()) {
        // console.log(this.director.isGameOver())
        console.log('游戏开始')
        this.init();
        this.button.playMusic(); //播放背景音乐
      }
    })
  }

  init() {
    console.log('init')
    this.director.run(); //导演："Action!"   
    this.button.musicButton() //音乐开关
    this.button.reStartButton() //重开按钮
    // this.director.xyDictInit()
  }
}