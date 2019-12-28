const app = getApp();
import Dialog from '../../components/dialog/dialog.js';
Page({
  data: {
    active: 0,
    choosedList: [],
    itemBook:'',
    listTotal:100,
    randomTotal:100,
    choosedNum: 0,
    avatarUrl: './user-unlogin.png',
    userInfo: { avatarUrl:'https://img.yzcdn.cn/vant/cat.jpeg',nickName:''},
    list: {},
    status:'',
    windowHeight:400,
    showLoading:false,
    timer:null,//节流器
    page:1,
    pageTwo:1,
    show:false,
    expoIdx:0,
    bookList:[],
    defaultList:[],
    logged: false,
    takeSession: false,
    requestResult: '',
    percent: '30%',
    showHead: false,
    days: '',
    itemName:'',
    showToast: false,
    randomList:[],
    bookName:"",
    imageURL: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576564789&di=6d6b154407648111332a8052c8767697&imgtype=jpg&er=1&src=http%3A%2F%2Fimg010.hc360.cn%2Fm2%2FM04%2F41%2F87%2FwKhQclQroUiEHpfpAAAAAC7gWxk827.jpg',
    form:{
      discrible:'',
      phone:'',
      sbInfo:'',
      fileList:[]
    },
    ruleForm:{
      discrible: false,
      sbInfo: false
    }
  },
  onPullDownRefresh(){//监听用户下拉刷新
    if(this.data.active===0){
      this.getRandom(true)
    } else if (this.data.active === 2){
      this.setData({
        pageTwo:1
      })
      this.getList()
    }
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
              }
            });
          }
        });
      }
    });
  },
  login:function(){
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.setData({
                userInfo:res.userInfo
              })
              // console.log(res,'!!!')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              //  console.log('用户已授权')
            }
          })
        } else {
          this.setData({
            show: true
          })
        }
      }
    })
  },
  onLoad: function () {
    wx.getUserInfo({
      success:(res)=>{
        console.log(res,'??用户信息')
      }
    })
    let that = this
    wx.showShareMenu();
    app.globalData.indexInstance = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight:res.windowHeight
        })
      }
    })
    wx.getSetting({//如果登陆过就根据藏书推荐random
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.setData({
                userInfo: res.userInfo
              })
              that.getList().then(() => {
                that.getRandom(true);
              })
            }
          })
        }else{
          that.getRandom();
        }
      }
    })
  },
  interSection: function (e) {
    if (this._observer) {
      this._observer.disconnect()
    }
    this._observer = this.createIntersectionObserver({
      // 阈值设置少，避免触发过于频繁导致性能问题
      thresholds: [1],
      // 监听多个对象
      observeAll: true
    })
      .relativeToViewport({
        bottom: 0
      })
      .observe('.item', (item) => {
        console.log(item)
        if(this.data.timer){
          clearTimeout(this.data.timer)
        }
        let timer = setTimeout(() => {
        if(item.relativeRect.bottom-item.intersectionRect.bottom===45){
          console.log('到底了')
        }
        }, 300)
        this.setData({
          timer
        })
      })
  },
  onReachBottom(event){
    const that = this
    if (that.data.active === 2) that.getList()
    if (that.data.active === 0) that.getRandom()
  //   if (this.data.timer) {
  //     clearTimeout(this.data.timer)
  //   }
  //   let timer = setTimeout(() => {
  //     // if(that.data.active===2)wx.createSelectorQuery().selectAll('.book-item').boundingClientRect(function (rect) {
  //     //     if (rect[0].height - event.scrollTop <= that.data.windowHeight+100){
  //     //       that.setData({
  //     //         pageTwo: that.data.defaultList.length%10+1
  //     //       })
  //     //       that.getList()
  //     //     }
        
  //     //   }).exec()
  // //  else 
  //  if(that.data.active===0) wx.createSelectorQuery().selectAll('.record-content').boundingClientRect(function (rect) {
  //     console.log(rect[0].height , event.scrollTop)
  //       if (rect[0].height - event.scrollTop <= that.data.windowHeight + 100) {
  //       that.setData({
  //         page: that.data.page + 1
  //       })
  //       that.getRandom()
  //     }
  //   }).exec()
  //   },300)
  //   this.setData({
  //     timer
  //   })
    // this.interSection(event)
  },
  onSearchChange(e){
    let that = this
    
    if(this.data.timer){
      clearTimeout(this.data.timer)
    }
    let timer = setTimeout(()=>{
      that.setData({
        itemBook: e.detail,
        randomTotal:1000,
        listTotal:1000
      })
      that.getRandom(true)
    },500)
    this.setData({
      timer
    })
  },
  getRandom(flag = false){//flag判定是否替换
    let that = this
    if(this.data.randomList.length>=this.data.randomTotal){
      return wx.showToast({
        title: '已经到底了',
      })
    }
    let params  = {
      count: 10,
      tags: that.data.bookList.map(item => item.tags.map(s => s.name).join(',')).join(',').split(','),
    }
    if (that.data.itemBook !== ''){
      params.title = that.data.itemBook;
    }
    if(flag){
      this.setData({
        randomList: []
      })
    }
    params.pageNo = this.data.randomList.length/10 + 1;
    app.globalData.request({
        url: `/goods/findListPageByTags`,
        method: 'POST',
        data: params,
        success: res => {
          // res.data 为服务端正确登录后签发的 JWT
          this.setData({
            randomTotal:res.data.total
          })
          if (!res.data.data && that.data.itemBook === '') return that.getRandom()
          if (flag) {
            this.setData({
              randomList: [...res.data.data]
            })
            wx.stopPullDownRefresh()
          } else {
            this.setData({
              randomList: [...this.data.randomList, ...res.data.data]
            })
          }
        }
    })
  },
  getList(){
    // this.setData({
    //   showLoading: true
    // })
  return new Promise((resolve,reject)=>{
    app.globalData.request({
      url: `/goods/findListPage`,
      method: 'GET',
      data: {
        open_id: app.globalData.open_id,
        limit: 10,
        page: this.data.pageTwo,
        pagination: false
      },
      success: res => {
        // res.data 为服务端正确登录后签发的 JWT
        this.setData({
          showLoading: false,
          listTotal:res.data.total
        })
        let list = res.data.data
        console.log(list, '????')
        this.setData({
          bookList: list,
          defaultList: list
        })
        // let list = this.data.bookList
        // const ids = list.map(item => item.id)
        // let isRepeat = res.data.data.some(item=>ids.indexOf(item.id)>-1)
        // if(!isRepeat){
        //   list.push(...res.data.data)
        //   this.setData({
        //     bookList: list,
        //     defaultList:list
        //   })
        // }
        resolve()
        wx.stopPullDownRefresh()
      },
      fail:()=>{
        reject()
      }
    })
  }) 
  },
  scanSbInfo(){
    let that = this
    wx.scanCode({
      fail: res => {
        that.setData({ active: 2 })
      },
      success(res) {
        app.globalData.open_id && (app.globalData.request({
          url: `/goods/findListPageByBarcode`,
          data: {
            open_id:app.globalData.open_id,
            barcode:res.result,
            join:true
          },
          success: res => {
            // res.data 为服务端正确登录后签发的 JWT
            if(res.data.error){
              wx.showToast({
                title: res.data.error,
                icon: 'info',
                iconColor: 'green'
              })
            }else{
              that.setData({
                bookList: [...that.data.bookList, res.data.data]
              })
              that.scanSbInfo()
            }
          }
         
        }))
      }
    })
  },
  onInputChange(e) {
    if(this.data.timer){
      clearTimeout(this.data.timer)
    }
    let timer = setTimeout(() => {
      this.setData({
        bookList: e.detail === '' ? this.data.defaultList : this.data.defaultList.filter(item => item.title.indexOf(e.detail) > -1)
      });
    }, 300)
    this.setData({
      timer
    })
  },
  queryObjParse(obj){//obj装url的query
   let arr = []
    for(let key in obj){
      obj[key]&&(arr.push(`${key}=${this.toString.call(obj[key]) === '[object Object]' || this.toString.call(obj[key]) === '[object Array]'?JSON.stringify(obj[key]):obj[key]}`))
    }
    console.log(arr,'??')
    return arr.join('&')
  },
  chooseItem(e) {
    let list = this.data.choosedList
    list[e.mark.index] = !list[e.mark.index];
    let choosedNum = list.filter(item => item === true).length
    this.setData({
      choosedList: list,
      choosedNum
    })
  },
  allChoosed() {
    let list = this.data.bookList;
    let choosedList = [];
    let choosedNum = 0
    if (this.data.choosedList.length === list.length && this.data.choosedList.every(item => item === true)) {
      choosedList = list.map(item => { return false })
    } else {
      choosedList = list.map(item => { return true });
      choosedNum = list.length;
    }
    this.setData({
      choosedList,
      choosedNum
    })
  },
  lookDetail(item){//查看详情
  console.log(item,'??')
  if(this.data.status==='longtap'){
    this.chooseItem(item)
  }else{
    app.globalData.detail = item.mark.detail
    wx.navigateTo({
      url: '/pages/detail/detail' 
    })
  } 
  },
  onInputSearch() {
    wx.showToast({title:'搜索' + this.data.bookName});
  },
  onInputClick() {
    wx.showToast({title:'搜索' + this.data.bookName});
  },
  clickCard(){
    console.log('点击了')
  },
  beforeRead(event) {
    const { file, callback } = event.detail;
    callback(file.type === 'image');
  },
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
    //   filePath: file.path,
    //   name: 'file',
    //   formData: { user: 'test' },
    //   success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data.form;
    fileList.push({ ...file, url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576564789&di=6d6b154407648111332a8052c8767697&imgtype=jpg&er=1&src=http%3A%2F%2Fimg010.hc360.cn%2Fm2%2FM04%2F41%2F87%2FwKhQclQroUiEHpfpAAAAAC7gWxk827.jpg' });
        this.setData({ form:{...this.data.form,fileList} });
    //   }
    // });
  },
  longtap() {//长按
    this.setData({
      status:'longtap'
    })
  },
  cancelDelete() {
    this.setData({
      status:''
    })
  },
  deleteAll() {
    let ids = [], that = this;
    let list = this.data.bookList;
    this.data.choosedList.map((item, index) => {
      if (item) {
        ids.push(list[index].isbn13)
      }
    })
    app.globalData.request({
      url: `/goods/deleteByBatch`,
      method: 'POST',
      data: { ids, open_id: app.globalData.open_id},
      success: res => {
       that.setData({
         bookList:[],
         choosedNum:0
       })
       that.getList()
      }
    });
  },
  onChangeTab(event){
    this.setData({ active: event.detail, status:''})
    if(event.detail===2)this.getList()
    if (event.detail === 3) {
      this.login()
     }
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none'
    // });
  },
});