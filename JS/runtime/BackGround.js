import {Sprite} from "../base/Sprite.js";

export class BackGround extends Sprite { //背景类 继承精灵基类
  constructor() {
      const image = Sprite.getImage("chessboard");
      super(image,0,0,
            image.width,image.height,
            11.5, (window.innerHeight-window.innerWidth+20)/2, //棋盘中心为屏幕中点
            window.innerWidth-20, window.innerWidth-20); // 屏幕上棋盘的长宽(正方形)
  }

  static getXY(a) { //输入相对坐标获得屏幕坐标 ex:a="0,1"
    const cellSize = 37 / 39 * (window.innerWidth - 20) / 14 //每个格子的边长
    const edgeSize = 1 / 39 * (window.innerWidth - 20) //边缘宽度
    const xyDict = new Map()
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        const XY = [11+edgeSize+cellSize*i,
        (window.innerHeight-window.innerWidth+20)/2 + edgeSize+cellSize*j,
        0] //屏幕的x,y轴坐标，标记位(记录状态是否有子)
        xyDict.set(String([i, j]), XY)
        // console.log([i,j], XY)
      }
    }
    this.Dict = xyDict //棋盘坐标，对应的绝对坐标
    return this.Dict.get(a) //返回屏幕坐标的二维数组
  }
}


