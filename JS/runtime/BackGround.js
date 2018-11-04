import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js"


export class BackGround extends Sprite { //背景类 继承精灵基类

  constructor() {
      const image = Sprite.getImage("chessboard");
      super(image,0,0,
            image.width,image.height,
        11.5, (DataStore.getInstance().canvas.height - DataStore.getInstance().canvas.width+20)/2, //棋盘中心为屏幕中点
        DataStore.getInstance().canvas.width-20, DataStore.getInstance().canvas.width-20
      ); // 屏幕上棋盘的长宽(正方形)
  }
  drawRestart() {
    const image2 = Sprite.getImage("restart");

    console.log(image2)
  }
}


