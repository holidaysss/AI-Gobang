import {Sprite} from "../base/Sprite.js";
import { DataStore } from "../base/DataStore.js"

export class StartButton extends Sprite {
  constructor() {
    const image = Sprite.getImage('start')

    super(
      image,
      0,0,
      image.width,image.height,
      (DataStore.getInstance().canvas.width-image.width/2)/2,
      (DataStore.getInstance().canvas.height-image.height/2)/2,
      image.width/2,image.height/2
    );
  }

}