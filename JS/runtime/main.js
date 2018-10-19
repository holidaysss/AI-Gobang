//初始化游戏的精灵，游戏的入口
import {ResourceLoader} from "../base/ResourceLoader.js";
import {Director} from "./Director.js"

export class main {
  constructor() {
    this.convas= wx.createCanvas();
    this.context = this.convas.getContext('2d');
    const loader = ResourceLoader.create();
    loader.onLoaded(map => this.onResourceFirstLoaded(map))
    let image = wx.createImage();
    image.src = "./images/1.jpg";
    image.onload = () =>{ //最后执行
      console.log('last')
      this.context.drawImage(image, 0, 0,
       20000, 20000,
        0, 0, 2200, image.height);
    }
    Director.getInstance();
  }

  onResourceFirstLoaded(map) {
    console.log(map);
  }
}