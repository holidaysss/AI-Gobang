//控制游戏逻辑的导演类
import {DataStore} from "../base/DataStore.js"
import {BlackF} from "./BlackF.js"

export class Director{

  constructor() {
    // console.log('构造器初始化');
    this.xyDict = new Map();
    this.mapKeys = [];
    this.mapValues = [];
    this.a =0;
    this.screenX = null;
    this.screenY = null;
    this.image = wx.createImage();
    this.n = 1;
    this.chessXY = null;
    this.datastore = DataStore.getInstance(); //数据仓库单例0  
    // this.datastore.canvas.width = this.datastore.canvas.width * 2;
    // this.datastore.canvas.height = this.datastore.canvas.height * 2;
  }

  formMap() { //创建存储棋盘坐标，屏幕坐标的Map对象
    const cellSize = 37 / 39 * (this.datastore.canvas.width - 20) / 14 //每个格子的边长
    const edgeSize = 1 / 39 * (this.datastore.canvas.width - 20) //边缘宽度
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        const XY = [11 + edgeSize + cellSize * i,
        (this.datastore.canvas.height - this.datastore.canvas.width + 20) / 2 + edgeSize + cellSize * j,
          0] //屏幕的x,y轴坐标，标记位(记录状态是否有子)
        this.xyDict.set(String([i, j]), XY);
        this.mapKeys.push(String([i, j]));
        this.mapValues.push(XY);
        // console.log([i,j], XY)
      }
    }
    // console.log(this.xyDict)
  }

  getMapKeys() {
    return this.mapKeys;
  }

  findLatestXY(e) { //找到点击最近的 棋盘点屏幕坐标
    Loop1:
    for (var i = 0; i < 15; i++) {
      Loop2:
      for (var j = 0; j < 15; j++) {
        var mapY = null
        if (this.xyDict.get(String(i) + ',' + String(j))) {
          var mapY = this.xyDict.get(String(i) + ',' + String(j))[1]
        } //获取棋盘坐标[i,j]的屏幕y坐标
        else {
          break Loop1;
        }
        const perCellSize = this.xyDict.get("1,0")[0] - this.xyDict.get("0,0")[0] //获取棋盘每格的宽
        if (mapY <= e.touches[0].clientY && e.touches[0].clientY < mapY + perCellSize / 2) { //四舍五入求最近y坐标
          this.screenY = mapY;
          break Loop2;
        }
        else if (mapY + perCellSize / 2 <= e.touches[0].clientY && e.touches[0].clientY < mapY + perCellSize) {
          this.screenY = mapY + perCellSize;
          break Loop2;
        }
      } //Loop2

      var mapX = null
      if (this.xyDict.get(String(i) + ',' + String(j))) {
        var mapX = this.xyDict.get(String(i) + ',' + String(j))[0]
      } //获取棋盘坐标[i,j]的屏幕x坐标
      else {
        break Loop1;
      }
      const perCellSize = this.xyDict.get("1,0")[0] - this.xyDict.get("0,0")[0]
      if (mapX <= e.touches[0].clientX && e.touches[0].clientX < mapX + perCellSize / 2) {
        this.screenX = mapX;
        break Loop1;
      }
      else if (mapX + perCellSize / 2 <= e.touches[0].clientX && e.touches[0].clientX < mapX + perCellSize) {
        this.screenX = mapX + perCellSize;
        break Loop1;
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
    console.log(this.image)
    var screenX = this.xyDict.get(i)[0] //通过棋盘坐标获取屏幕坐标screenX, screenY
    var screenY = this.xyDict.get(i)[1]
    this.datastore.context.drawImage( //落子
      this.image, 0, 0,
      this.image.width, this.image.height,
      screenX - this.image.width / 4, screenY - this.image.height /4,
      this.image.width / 2, this.image.height / 2)
    this.xyDict.set(i, [screenX, screenY, this.n])
    this.n = this.n * -1; //换手
    console.log('draw')
  }

  xyDictInit() { //map重置
    // var newMap = new Map()
    this.n = 1 //黑先
    for (let key of this.mapKeys){
      this.xyDict.get(key)[2]=0
      // console.log(this.xyDict.get(key))
      // newMap.set(String(key), this.xyDict.get(key))
      
    }
    console.log(this.xyDict)
    // this.xyDict=newMap
  }

  static getInstance() { //单例
    if(!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  isYourTurn() { //判断是否轮到玩家下子
    if (this.n == 1) {
      return true
    }
    else {
      return false
    }
  }

  isGameOver() { //this.a=0 即游戏结束
    if(this.a == 0){
      this.a++
      return true
    }
    else{
      return false
    }
  }

  startBefore() { //开始前的界面
    this.datastore.context.font = 'bold 35px Arial';
    this.datastore.context.textAlign = 'center';
    this.datastore.context.textBaseline = 'bottom';
    this.datastore.context.fillStyle = '#FF00FF';
    this.datastore.context.fillText("盲人五子棋",     this.datastore.canvas.width/2, 120);
    this.datastore.get('start').draw(); //绘制开始图标 
    wx.request({ //先清空后台的棋盘
      url: 'https://www.leslie2018.com',
      data: {
        token: 0,   // 微信用户的token标识 前端提供
        apply_game: "0", // 0表示申请开始游戏，1表示不申请  前端提供 
        location: JSON.stringify(0, 0), // 当前用户移动的坐标 
        restart: 1
        //restart: this.restart
      },
      method: "POST",
      dataType: 'json',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        charset: 'UTF-8'
      },
      success: function (res) {
      }
    })
  }

  turnToChessXY(screenX, screenY) { //屏幕坐标转成棋盘坐标
    var mapKeys = this.getMapKeys();
    // console.log(screenX, screenY)
    for (let i of mapKeys) { // 转化为棋盘坐标
      if (String(this.xyDict.get(i)[0]).substr(0, 3) == String(screenX).substr(0, 3) &&
        String(this.xyDict.get(i)[1]).substr(0, 3) == String(screenY).substr(0, 3)) {
        this.x = this.isYourTurn()
        if (this.xyDict.get(i)[2] == 0 && this.x) { //判断位为0且为黑子
          this.chessXY = i;
          console.log("玩家: " + this.chessXY)
          break;
        }
        else { //重复下棋无效
          this.chessXY = null
          
          console.log("不能重复下子！")
        }
      }
      else if (i == "14,14"){ //偶尔会识别不了个别屏幕坐标，需要重新点击
        this.chessXY = null
        console.log('here')
      }
    }
  }

  chessBoardInit() {
    const backgroundSprite = this.datastore.get('chessboard');
    backgroundSprite.draw(); //绘制棋盘
  }

  sleep(n) {
    var start = new Date().getTime();
    console.log('休眠');
    while (true) {
      if (new Date().getTime() - start > n) {
        break;
      }
    }
  }

  run(code, avatarUrl) {
    this.code = code
    const image3 = this.datastore.images.get("music"); //音乐图标
    const image2 = this.datastore.images.get("restart"); //重新开始图标
     //获取棋盘 BackGround对象
    this.datastore.context.drawImage(image3, 0, 0, //绘制音乐图标
      image3.width, image3.height,
      0, 0,//棋盘右下方
      image3.width / 5, image3.height / 5)

    this.datastore.context.drawImage(image2, 0, 0, //绘制重开图标
      image2.width, image2.height,
      this.datastore.canvas.width-image2.width/5, (this.datastore.canvas.height+this.datastore.canvas.width-20)/2,//棋盘右下方
      image2.width/5, image2.height/5)

    this.chessBoardInit() //初始化棋盘
    var image = null
    if (!avatarUrl) {
      image = this.datastore.images.get("avatar") //圆形头像
      console.log(image)
    } 
    else {
      image = wx.createImage()
      console.log(typeof(image))
      image.src = avatarUrl + "?aaa=aa.jpg"
      // wx.setStorage({
      //   key: "image",
      //   data: image
      // })
      // image = wx.getStorage('image')
      
      // var image = avatarUrl + "?aaa=aa.jpg"
      console.log(image)

    }
    this.datastore.context.save();
    this.datastore.context.beginPath();
    this.datastore.context.arc(
      42+this.datastore.canvas.width-84,
      42+this.datastore.canvas.height-84,
      42,0,2*Math.PI);
    this.datastore.context.clip(); 
    this.datastore.context.drawImage(
      image,0,0,
      image.width,image.height,
      this.datastore.canvas.width-84,
      this.datastore.canvas.height-84,
      84,84);
    this.datastore.context.restore();

    wx.onTouchStart((e, n = this.n, code=this.code) => { //点击，交替落子
      console.log(this.code)
      var [screenX, screenY] = this.findLatestXY(e) //获取点击的最近棋盘点屏幕坐标 
      this.turnToChessXY(screenX, screenY)      
      if (this.x && this.chessXY != null) { //玩家执黑，AI执白
        this.drawChess(this.chessXY)
        
        console.log("chessXY: " + this.chessXY)
        // this.sleep(100) //休眠1秒
        var that = this
        wx.request({ //把坐标传给后台
          url: 'https://www.leslie2018.com',
          data: {
            token: JSON.stringify(this.code),   // 微信用户的token标识 前端提供
            apply_game: "0", // 0表示申请开始游戏，1表示不申请  前端提供        
            location: JSON.stringify(this.chessXY), // 当前用户移动的坐标 
          },
          method: "POST",
          dataType: 'json',
          header: {
            "content-type": "application/x-www-form-urlencoded",
            charset: 'UTF-8'
          },
          success: function (res) { //接收
            if (res.data == '0') {              
              console.log('很遗憾，你输了')
              that.datastore.context.font = 'bold 35px Arial';
              that.datastore.context.textAlign = 'center';
              that.datastore.context.textBaseline = 'bottom';
              that.datastore.context.fillStyle = '#FF00FF';
              that.datastore.context.fillText("哎呀，你输了", that.datastore.canvas.width/2, that.datastore.canvas.height/2);
            }
            else if (res.data == '1') {
              console.log('哟 不错哦！你赢了')
              that.datastore.context.font = 'bold 35px Arial';
              that.datastore.context.textAlign = 'center';
              that.datastore.context.textBaseline = 'bottom';
              that.datastore.context.fillStyle = '#FF00FF';
              that.datastore.context.fillText("哟 不错哦！你赢了", that.datastore.canvas.width / 2, that.datastore.canvas.height / 2);
            }
            else if (res.data == '-1'){}
            else {           
              that.drawChess(res.data)
              console.log('小阿尔法出棋：' + res.data)
            }
          },
          fail: function (res) {
            console.log('submit fail');
          }
        })
      }
    })
  }

}