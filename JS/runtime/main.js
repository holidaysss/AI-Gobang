//初始化游戏的精灵，游戏的入口(初始化)
import {ResourceLoader} from "../base/ResourceLoader.js";
import {Director} from "./Director.js"
import {BackGround} from "./BackGround.js"
import {DataStore} from "../base/DataStore.js"
import {Avatar} from "./Avatar.js"
import {BlackF} from "./BlackF.js"

export class main {

  constructor() {
    this.n=1;
    this.director = Director.getInstance();  //导演单例
    this.canvas= wx.createCanvas();
    this.image = wx.createImage();
    this.screenX=null;
    this.screenY=null;
    this.context = this.canvas.getContext('2d'); //2d画布
    this.datastore = DataStore.getInstance(); //创建数据仓库单例
    this.datastore.canvas = this.canvas; //储存画布属性
    const loader = ResourceLoader.create();
    // console.log("xy: "+xy)

    this.context.fillStyle = 'white';
    this.context.fillRect(0,0, 10000, 10000); //测试坐标位置
    var imgB = wx.createImage();
    this.context.fill();

    loader.onLoaded(map => this.onResourceFirstLoaded(map)) //资源加载后执行
  }

  findLatestXY(e) { //找到点击最近的 棋盘点屏幕坐标
    Loop1:
    for (var i = 0; i < 15; i++) {
      Loop2:
      for (var j = 0; j < 15; j++) {
        const mapY = this.director.getXY().get(String(i) + ',' + String(j))[1] //获取棋盘坐标[i,j]的屏幕y坐标
        const perCellSize = this.director.getXY().get("1,0")[0] - this.director.getXY().get("0,0")[0] //获取棋盘每格的宽
        if (mapY < e.touches[0].clientY && e.touches[0].clientY < mapY + perCellSize / 2) { //四舍五入求最近y坐标
          this.screenY = mapY;
          break Loop2;
        }
        else if (mapY + perCellSize / 2 < e.touches[0].clientY && e.touches[0].clientY < mapY + perCellSize) {
          this.screenY = mapY + perCellSize;
          break Loop2;
        }
      }
      const mapX = this.director.getXY().get(String(i) + ',' + String(j))[0] //获取棋盘坐标[i,j]的屏幕x坐标
      const perCellSize = this.director.getXY().get("1,0")[0] - this.director.getXY().get("0,0")[0]
      if (mapX < e.touches[0].clientX && e.touches[0].clientX < mapX + perCellSize / 2) {
        this.screenX = mapX;
        break Loop1;
      }
      else if (mapX + perCellSize / 2 < e.touches[0].clientX && e.touches[0].clientX < mapX + perCellSize) {
        this.screenX = mapX + perCellSize;
        break Loop1;
      }
    }
    return [this.screenX, this.screenY]
  }

  drawChess() {
    this.context.drawImage( //落子
      this.image, 0, 0,
      this.image.width, this.image.height,
      this.screenX - this.image.width / 2.6, this.screenY - this.image.height / 2.6,
      this.image.width / 1.3, this.image.height / 1.3)
    if (this.n > 0) { //白先
      this.image.src = 'images/white.png'
    }
    else {
      this.image.src = 'images/black.png'
    }
    this.n = this.n * -1; //换手
  }

  onResourceFirstLoaded(map) { //资源加载后执行
    this.director.formMap();
    this.datastore.context = this.context; //数据仓库单例例增加画布属性
    this.datastore.images = map; //实例增加类属性images 存放图片集合map
    

    wx.onTouchStart ((e,n=this.n)=> { //点击，交替落子
      console.log("实际点击坐标： "+e.touches[0].clientX, e.touches[0].clientY) //实际点击屏幕坐标
      var [screenX, screenY] = this.findLatestXY(e) //获取点击的最近棋盘点屏幕坐标  
      console.log("最近的棋盘落子点: "+screenX,screenY) //距离最近的棋盘落子点
      for (let i=0;i<225;i++) {
        // console.log(this.director.getMapValues()[i])
        if (this.director.getMapValues()[i][2]== 0 && 
          this.director.getMapValues()[i][0]==screenX && 
          this.director.getMapValues()[i][1]==screenY){
          console.log('111111111111111')
        }
      }
      this.drawChess()    
    })
    this.init(); //执行init部分
  }

  init() {
    this.datastore
    .put( //从类属性images获取数据，放进类属性map
      'chessboard',
      new BackGround()
    )
    .put( //注册头像数据
      'avatar',
      new Avatar()
    )
    .put(
      'blackF',
      new BlackF()
    );
    this.director.run(); //导演："Action!"
    
  }
}