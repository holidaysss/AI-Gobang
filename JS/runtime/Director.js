//控制游戏逻辑的导演类
import {DataStore} from "../base/DataStore.js"
import {BlackF} from "./BlackF.js"

export class Director{
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

  getMapValues() {
    return this.mapValues;
  }

  getMapKeys() {
    return this.mapKeys;
  }

  getXY() { //输入相对坐标获得屏幕坐标 ex:a="0,1"
    return this.xyDict //棋盘坐标，对应的绝对坐标，判断位（Map对象）
  }

  constructor() {
    // console.log('构造器初始化');
    this.xyDict = new Map();
    this.mapKeys = [];
    this.mapValues = [];
    this.n = 0;
    this.datastore = DataStore.getInstance(); //数据仓库单例
    
  }

  static getInstance() { //单例
    if(!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  

  isGameOver() { //this.n=0 即游戏结束
    if(this.n == 0){
      this.n++
      return true
    }
    else{
      return false
    }
    
  }
  run() {
    const image3 = this.datastore.images.get("music");
    const image2 = this.datastore.images.get("restart"); //重新开始图标
    console.log(image2)
    this.datastore.context.drawImage(image3, 0, 0,
      image3.width, image3.height,
      this.datastore.canvas.width - image3.width / 5, 0,//棋盘右下方
      image3.width / 5, image3.height / 5)
    this.datastore.context.drawImage(image2, 0, 0,
      image2.width, image2.height,
      this.datastore.canvas.width-image2.width/5, (this.datastore.canvas.height+this.datastore.canvas.width-20)/2,//棋盘右下方
      image2.width/5, image2.height/5)
    this.datastore.get('start').draw();
    const backgroundSprite = this.datastore.get('chessboard'); //获取棋盘 BackGround对象
    const avatarSprite = this.datastore.get('avatar');
    backgroundSprite.drawRestart()
    backgroundSprite.draw(); //调用精灵基类的draw方法
    avatarSprite.draw();
    
  }
  startBefore(){
    
    this.datastore.get('start').draw();
  }
}