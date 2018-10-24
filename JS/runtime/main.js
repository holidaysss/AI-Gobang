//初始化游戏的精灵，游戏的入口(初始化)
import {ResourceLoader} from "../base/ResourceLoader.js";
import {Director} from "./Director.js"
import {BackGround} from "./BackGround.js"
import {DataStore} from "../base/DataStore.js"
import {Avatar} from "./Avatar.js"
import {BlackF} from "./BlackF.js"

export class main {

  constructor() {
    window.n = 1; //全局变量n
    this.convas= wx.createCanvas();
    this.context = this.convas.getContext('2d'); //2d画布
    this.datastore = DataStore.getInstance(); //创建数据仓库单例
    const loader = ResourceLoader.create();

    const xy = BackGround.getXY("1,0") //获得棋盘坐标对应的屏幕坐标
    // console.log("xy: "+xy)

    this.context.fillStyle = 'white';
    this.context.fillRect(0,0, 10000, 10000); //测试坐标位置
    var imgB = wx.createImage();
    this.context.fill();

    loader.onLoaded(map => this.onResourceFirstLoaded(map)) //资源加载后执行
  }

  onResourceFirstLoaded(map) {
    this.datastore.context = this.context; //数据仓库单例例增加画布属性
    this.datastore.images = map; //实例增加类属性images 存放图片集合map
    this.init(); //执行init部分

    var image = wx.createImage()
    wx.onTouchStart ((e,n=window.n)=> { //交替落子
      // console.log(n)
      console.log("实际点击坐标： "+e.touches[0].clientX, e.touches[0].clientY) //实际点击屏幕坐标
      Loop1:
      for(var i=0;i<15;i++) {
        Loop2:
        for(var j=0;j<15;j++){
          const mapY = BackGround.getXY(String(i)+','+String(j))[1] //获取棋盘坐标[i,j]的屏幕y坐标
          const perCellSize = BackGround.getXY("1,0")[0]-BackGround.getXY("0,0")[0] //获取棋盘每格的宽
          if (mapY<e.touches[0].clientY && e.touches[0].clientY < mapY+perCellSize/2){ //四舍五入求最近y坐标
            var screenY = mapY;
            break Loop2;
          }
          else if (mapY+perCellSize/2 < e.touches[0].clientY && e.touches[0].clientY < mapY+perCellSize){
            var screenY = mapY+perCellSize;
            break Loop2;
          }
        }
        const mapX = BackGround.getXY(String(i) + ',' + String(j))[0] //获取棋盘坐标[i,j]的屏幕x坐标
        const perCellSize = BackGround.getXY("1,0")[0] - BackGround.getXY("0,0")[0]
        if (mapX < e.touches[0].clientX && e.touches[0].clientX < mapX+perCellSize/2) {
          var screenX = mapX;
          break Loop1;
        }
        else if (mapX + perCellSize / 2 < e.touches[0].clientX && e.touches[0].clientX < mapX+perCellSize) {
          var screenX = mapX + perCellSize;
          break Loop1;
        }
      }

      console.log(screenX,screenY) //距离最近的棋盘落子点
      this.context.drawImage( //落子
        image, 0, 0,
        image.width,image.height,
        screenX-image.width / 2.6, screenY-image.height/2.6,
        // BackGround.getXY("8,8")[0] - image.width/2.6, BackGround.getXY("8,8")[1] - image.height/2.6,
        image.width/1.3, image.height/1.3)
      // image.src = 'images/white.png'
      if (n>0) { //白先
        image.src = 'images/white.png'
      }
      else{
        image.src = 'images/black.png'
      }
      window.n=window.n*-1; //换手

    })
    
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
    Director.getInstance().run(); //导演："Action!"
    
  }
}