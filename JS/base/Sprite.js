//精灵基类
import {DataStore} from "./DataStore.js"

export class Sprite{
  constructor(img=null, srcX=0, srcY=0, srcW=0, srcH=0, x=0, y=0, width=0, height=0){
    this.datastore = DataStore.getInstance(); //数据仓库单例
    this.ctx = this.datastore.context
    this.img = img;
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcW = srcW;
    this.srcH = srcH;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  } //初始化属性

  static getImage(key) {
    return DataStore.getInstance().images.get(key);
  }

  draw(img=this.img,
       srcX=this.srcX,
       srcY=this.srcY,
       srcW=this.srcW,
       srcH=this.srcH,
       x=this.x,
       y=this.y,
       width=this.width,
       height=this.height){
    this.ctx.drawImage(
      img,
      srcX,
      srcY,
      srcW,
      srcH,
      x,
      y,
      width,
      height
    );
  }
}