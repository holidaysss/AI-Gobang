import {Sprite} from "../base/Sprite.js";

export class BlackF extends Sprite {

  constructor() {
    
    const image = Sprite.getImage('black');
    super(image,0,0,
      image.width,image.height,
      50, 50,
      image.width/2, image.height/2)
  }

}
