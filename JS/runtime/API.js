export class API {
constructor() {
  this.canvas = wx.createCanvas();
}

  getUserInfo(){
    let button = wx.createUserInfoButton({
      type: 'text',
      text: '点击提供昵称头像信息',
      style: {
        left: 0,
        top: 0,
        width: this.canvas.width,
        height: this.canvas.height,
        lineHeight: 40,
        backgroundColor: '#fffff',
        color: '#fffff',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    })
    button.show()
    button.onTap((res) => {
      button.destroy()
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
  login() {
    wx.login({
      success: function (res) {
        
        // console.log(res)
      }
    })
  }
  
  getSetting() {
    wx.getSetting({
      success: function (res) {
        // console.log(res)
        // console.log(JSON.stringify(res))
      }
    })
  }
} 