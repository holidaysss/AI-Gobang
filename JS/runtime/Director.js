//控制游戏逻辑的导演类
import {DataStore} from "../base/DataStore.js"

export class Director{
  constructor() {
    console.log('构造器初始化');
    this.datastore = DataStore.getInstance(); //数据仓库单例
  }

  static getInstance() { //单例
    if(!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  run() {
    const backgroundSprite = this.datastore.get('chessboard'); //获取棋盘 BackGround对象
    console.log(backgroundSprite);
    backgroundSprite.draw(); //调用精灵基类的draw方法
  }

}