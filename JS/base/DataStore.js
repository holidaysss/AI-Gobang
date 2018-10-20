//变量缓存器，方便访问和修改不同类中的变量
export class DataStore {

  static getInstance() { //单例
    if(!DataStore.instance){
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  constructor() {
    this.map = new Map();
  }

  put(key, value) { //添加map集合
    this.map.set(key, value);
    return this;
  }

  get(key) {
    return this.map.get(key);
  }

  destroy() {
    for(let value of this.map.values()) {
      value = null;
    }
  }
}