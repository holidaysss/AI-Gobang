import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js"

export class Avatar extends Sprite {

  constructor() {
    const image = Sprite.getImage('avatar');
    super(image,0,0,
          image.width,image.height,
          DataStore.getInstance().canvas.width-image.width/10, DataStore.getInstance()      .canvas.height-image.height/10,
          image.width/10, image.height/10)
    
  }
}