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
    this.isLogin=false
  }

  doFirst() {
    this.restart = false; //重启标志
    this.musicOff = true; //bgm暂停标志
    // this.api=new API();
    this.button = new Button()
    this.director = Director.getInstance();  //导演单例
    this.canvas = wx.createCanvas();
    // this.canvas.width = this.canvas.width*2;
    // this.canvas.height = this.canvas.height*2;
    this.image = wx.createImage();
    this.context = this.canvas.getContext('2d'); //2d画布
    this.datastore = DataStore.getInstance(); //创建数据仓库单例
    this.datastore.canvas = this.canvas; //储存画布属性
    const loader = ResourceLoader.create();
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, 1000, 1000);
    this.context.fill();
    loader.onLoaded(map => this.onResourceFirstLoaded(map)) //资源加载后执行
  }

  onResourceFirstLoaded(map) { //资源第一次加载后执行
    // console.log('onResourceFirstLoaded')
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
    // this.user = new API(); //用户接口
    this.getUserInfo(); //用户授权按钮
    // this.user.login()
    this.registerEvent()
    // this.user.getSetting();
    // this.registerEvent();
    
  }

  getUserInfo() {
    this.button2 = wx.createUserInfoButton({
      type: 'text',
      text: '点击提供昵称头像信息',
      style: {
        left: 0,
        top: 150,
        width: this.canvas.width,
        height: 40,
        lineHeight: 40,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    })
    this.button2.show()
    this.button2.onTap((res) => {
      this.button2.destroy()
      console.log(res.userInfo)
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country
      this.login(userInfo.avatarUrl)
      this.isLogin=true
    })
  }

  destroyButton() { //销毁按钮
    this.button2.destroy()
  }

  login(avatarUrl) {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code
        that.director.run(code, avatarUrl);
      },

    })
  }

  registerEvent() { //开始游戏，初始化
    // console.log('registerEvent')
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
    this.destroyButton()
    // this.context.fill();
    if (!this.isLogin) {
      this.login()
    }
    // this.director.run(code); //导演："Action!"   
    this.button.musicButton() //音乐开关
    this.button.reStartButton() //重开按钮
    // this.director.xyDictInit()
  }
}