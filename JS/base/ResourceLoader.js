//等资源加载完再进行渲染
import {Resources} from "./Resources.js"

export class ResourceLoader{
  constructor() {
    this.map = new Map(Resources); //创建资源的map集合

    for(let [key, value] of this.map){ //let：区作用域
      const image = wx.createImage(); //创建图片实例
      image.src = value; //图片路径赋值
      this.map.set(key, image); //修改键值对
    }
  }
  onLoaded(callback) { //加载全部结束（回调函数，异步编程）
    let loadedCount = 0;
    for (let value of this.map.values()) {
      value.onload = () => { //箭头函数内部的this
        loadedCount++;
        if (loadedCount >= this.map.size) {
          callback(this.map); //执行回调函数
        }
      }
    }
  }

  static create() { //静态工厂
    return new ResourceLoader();
  }
}