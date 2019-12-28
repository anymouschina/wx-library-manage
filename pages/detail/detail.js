const app = getApp()
Page({
  data:{
    detail:{},
    activeNames: ['1']
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  toggleBook(){
    let that = this
    console.log(1111, that.data.detail.collected)
    if(!that.data.detail.collected){
      app.globalData.request({
        url: `/goods/findListPageByBarcode`,
        data: {
          open_id: app.globalData.open_id,
          barcode: that.data.detail.isbn13,
          join:true
        },
        success: res => {
          // res.data 为服务端正确登录后签发的 JWT
          if (res.data.error) {
            wx.showToast({
              title: res.data.error,
              icon: 'info',
              iconColor: 'green'
            })
          }else{
            that.setData({
              detail:{...that.data.detail,collected:true}
            })
            wx.showToast({
              title: '加入成功',
              icon: 'info',
              iconColor: 'green'
            })
          }
        }
      })
    }else{
      app.globalData.request({
        url: `/goods/deleteByBarcode`,
        data: {
          open_id: app.globalData.open_id,
          barcode: that.data.detail.isbn13
        },
        success: res => {
          // res.data 为服务端正确登录后签发的 JWT
          if (res.data.error) {
            wx.showToast({
              title: res.data.error,
              icon: 'info',
              iconColor: 'green'
            })
          } else {
            that.setData({
              detail: { ...that.data.detail, collected: false }
            })
            wx.showToast({
              title: '删除成功',
              icon: 'info',
              iconColor: 'green'
            })
          }
        }
      })
    }
  },
  onLoad: function (option) {
    let that = this
    // console.log(app.globalData.detail)
    // Object.keys(option).map(key=>{
    //   if (option[key][0] === '[' || option[key][0] ==='{'){
    //     option[key] = JSON.parse(option[key])
    //   }
    // })
    that.setData({
      detail: app.globalData.detail,
      activeNames: '1'
    })
    // app.globalData.request({
    //   url: `/goods/findListPageByBarcode`,
    //   data: {
    //     open_id: app.globalData.open_id,
    //     barcode: option.isbn13,
    //     join:false
    //   },
    //   success: res => {
    //     // res.data 为服务端正确登录后签发的 JWT
    //     if (res.data.error) {
    //       wx.showToast({
    //         title: res.data.error,
    //         icon: 'info',
    //         iconColor: 'green'
    //       })
    //     } else {
    //       that.setData({
    //         detail:res.data.data
    //       })
    //     }
    //   }
    // })
    // this.setData({
    //   detail:option,
    //   activeNames: '1'
    // })
  }
})