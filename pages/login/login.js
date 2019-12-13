// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onGetUserInfo(e) {
    const {
      encryptedData,
      iv
    } = e.detail;
    wx.login({
      timeout: 3000,
      success: res => {
        const code = res.code;
        app.globalData.request({
          url: `/users/wxLogin`,
          method: 'POST',
          data: {
            code,
            encryptedData,
            iv,
            from: 1
          },
          success: res => {
            // res.data 为服务端正确登录后签发的 JWT
            wx.setStorageSync('auth', res.data);
            app.globalData.open_id = res.data.OPEN_ID;
            wx.getUserInfo({
              success: res => {
                app.globalData.avatarUrl = res.userInfo.avatarUrl;
                app.globalData.userInfo = res.userInfo;
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})