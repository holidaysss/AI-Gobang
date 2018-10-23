import {Sprite} from "../base/Sprite.js";

export class Avatar extends Sprite {

  constructor() {
    const image = Sprite.getImage('avatar');
    super(image,0,0,
          image.width,image.height,
          window.innerWidth-image.width/10, window.innerHeight-image.height/10,
          image.width/10, image.height/10)
    
  }
}