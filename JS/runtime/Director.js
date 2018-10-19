//控制游戏逻辑的导演类
export class Director{ //单例
  constructor() {
    console.log('构造器初始化');
  }

  static getInstance() {
    if(!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }
}