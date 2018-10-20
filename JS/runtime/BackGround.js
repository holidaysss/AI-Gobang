import {Sprite} from "../base/Sprite.js";

export class BackGround extends Sprite { //背景类继承精灵基类
  constructor() {
      const image = Sprite.getImage("chessboard");
      super(image,0,0,
      image.width,image.height,
      10,200,window.innerWidth-20,window.innerWidth-20);
  }
}