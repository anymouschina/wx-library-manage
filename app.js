//app.js
const app = getApp();
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo
            console.log(res,'!!!')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //  console.log('用户已授权')
            }
          })
        }else{
          console.log('用户未授权')
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    avatarUrl:'',
    open_id:null,
    request:function(config){
      let that = this
      config.url = 'https://www.saberc8.cn'+config.url
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.login({
              timeout: 3000,
              success: res1 => {
                const code = res1.code;
                console.log('!!!!!!!')
                  wx.getUserInfo({
                    success: res2 => {
                      // 可以将 res 发送给后台解码出 unionId
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      const { encryptedData,iv} = res2;
                      console.log(!that.open_id,'????用户id')
                        if(!that.open_id){
                          wx.request({
                            url: `https://www.saberc8.cn/users/wxLogin`,
                          method: 'POST',
                          data: {
                            code,
                            encryptedData,
                            iv,
                            from: 1
                          },
                          success: useInfo => {
                            that.open_id = useInfo.data.OPEN_ID;
                            // res.data 为服务端正确登录后签发的 JWT
                            // wx.setStorageSync('auth', res.data);
                            // app.globalData.open_id = res.data.OPEN_ID;
                            // wx.getUserInfo({
                            //   success: res => {
                            //     app.globalData.avatarUrl = res.userInfo.avatarUrl;
                            //     app.globalData.userInfo = res.userInfo;
                            //   }
                            // });
                            config.data.open_id = useInfo.data.OPEN_ID;
                            wx.request(config)
                          }
                        })
                        }else{
                          that.userInfo = res.userInfo
                          console.log('用户已授权', res, that)
                          wx.request(config)
                        }
                     
                    }
                  })
                }
              })
          } else {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
})