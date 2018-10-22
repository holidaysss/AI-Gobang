//初始化游戏的精灵，游戏的入口(初始化)
import {ResourceLoader} from "../base/ResourceLoader.js";
import {Director} from "./Director.js"
import {BackGround} from "./BackGround.js"
import {DataStore} from "../base/DataStore.js"

export class main {
  constructor() {
    this.convas= wx.createCanvas();
    this.context = this.convas.getContext('2d'); //2d画布
    this.datastore = DataStore.getInstance(); //创建数据仓库单例
    const loader = ResourceLoader.create();
    console.log(loader.map);

    const xy = BackGround.getXY("1,0") //获得棋盘坐标对应的屏幕坐标
    console.log("xy: "+xy)

    this.context.fillStyle = 'white';
    this.context.fillRect(xy[0], xy[1], 10000, 10000); //测试坐标位置
    loader.onLoaded(map => this.onResourceFirstLoaded(map)) //资源加载后执行

  }

  onResourceFirstLoaded(map) {
    this.datastore.context = this.context; //数据仓库单例例增加画布属性
    this.datastore.images = map; //实例增加类属性images 存放图片集合map
    this.init();
    // let background = new BackGround(this.context, map.get('chessboard')); //布置棋盘
    // background.draw();
  }

  init() {
    this.datastore
    .put( //从类属性images获取数据，放进类属性map
      'chessboard',
      new BackGround()
    );
    console.log(this.datastore.map)
    Director.getInstance().run(); //导演："Action!"
  }
}