# AI-Gobang
AI五子棋小程序
## 程序简介
AlphaGo Zero在世界舞台上取得的巨大成功体现了人工智能算法的快速发展和其蕴含着的应用价值，本团队借鉴AlphaGo Zero算法思想和架构，简单实现五子棋的人工智能棋手，通过人工智能自我的不断下棋，不断训练，并且不断迭代更新自身-自训练模式，从而训练一个水平极高的人工智能棋手，让广大玩家体验一把与“AlphaGo Zero”的感觉。本团队提出的程序-AI五子棋不仅加入人工智能元素，并且以微信小程序的方式部署，为所有微信用户提供简洁方便的模式风格轻松进行五子棋游戏。
## 参考资料
AlphaGo Zero的主要论文文献，互联网上的AlphaGo Zero算法研究文章，AlphaGo Zero 相关的知识文章，微信小程序游戏类型开发知识文章，python后端开发知识文章，服务器搭建配置知识文章，python必要运行环境搭建配置知识文章。
AlphaZero: Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm
AlphaGo Zero: Mastering the game of Go without human knowledge
## 程序架构
### 前端设计
AI五子棋前端设计主要从两个角度进行编程开发：游戏设计，信息处理。 

#### 游戏设计：
  1. 五子棋棋盘，棋子等图像界面的设计
  2. 五子棋基础规则设定
    a. 棋子可以根据玩家的指定位置落到棋盘的指定位置-坐标
    b. 玩家只可以按照规则下棋，不存在连续下棋，未同意下撤回棋子，同个位置下两遍等异常情况
  3. 游戏基础功能设定，比如开始游戏，再来一菊，放弃下棋等
  4. 可以根据后端指示的游戏状态执行对应操作，特别地，棋盘的胜负状态是由后端判断的。

#### 信息处理：
  1. 可以为每一个微信用户生成一个唯一的Token或者标识
  2. 可以与后端进行正确的信息通信，并且执行后端要求的请求。同时也可以正常地向后端发送信息
  3. 以JSON格式作为数据规范格式,当前数据格式
### 后端开发
后端开发主要从两个角度入手：游戏开发，Web开发
#### 游戏开发：
  1. 完整编程开发五子棋游戏，可以正常生成棋盘，并且可以进行三种游戏模式：人机模式，人人模式，机机模式。
  1. 初步理解AlphaGo Zero的算法思想和技术，并且尝试实现算法，训练人工智能模型。
  2. 整合训练好的模型和算法逻辑称为一个可实例化的对象 - 称人工智能棋手(AI棋手)
#### Web开发：
  1. 正确与前端进行信息交流
  2. 准确每一个用户生成临时棋盘环境，每个用户的棋盘游戏环境互不干扰。
  3. 合理存放用户的token标识等数据
  4. 同个用户标识可以在不同时间段内生成多个棋盘，但是每一个时间段只能对应一个棋盘环境
  5. 服务器web框架的部署，性能，效率，安全和稳定等方面的测试
