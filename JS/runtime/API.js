export class API {

constructor() {
  this.canvas = wx.createCanvas();
  
}

  getUserInfo(){
    this.button = wx.createUserInfoButton({
      type: 'text',
      text: '点击提供昵称头像信息',
      style: {
        left: 0,
        top: 150,
        width: this.canvas.width,
        height: 40,
        lineHeight: 40,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    })
    this.button.show()
    this.button.onTap((res) => {
      this.button.destroy()
      console.log(res.userInfo)
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country
      console.log("昵称："+nickName)
      console.log("头像："+avatarUrl)
    })

  }

  destroyButton() { //销毁按钮
    this.button.destroy()
  }

  login() {
    var that=this
    wx.login({
      success: function (res) {      
        that.code=res.code
        console.log(that.code)
       
        that.getCode(res.code)        
      },
      
    })
  }
  

  getSetting() {
    wx.getSetting({
      success: function (res) {
        console.log(res)
        // console.log(JSON.stringify(res))
      }
    })
  }
} 