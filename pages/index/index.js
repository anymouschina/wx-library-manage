const app = getApp();
Page({
  data: {
    active: 0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    list: {},
    timer:null,//节流器
    page:1,
    expoIdx:0,
    bookList:[],
    logged: false,
    takeSession: false,
    requestResult: '',
    percent: '30%',
    showHead: false,
    days: '',
    showToast: false,
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
  onShow: function () {
    this.getList()
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
        if(this.data.timer){
          clearTimeout(this.data.timer)
        }
        this.data.timer = setTimeout(() => {
        if(item.relativeRect.bottom-item.intersectionRect.bottom===45){
          console.log('到底了')
        }
        }, 300)
      })
  },
  onPageScroll(event){
    this.interSection(event)
  },
  getList(){
    app.globalData.request({
      url: `/goods/findListPage`,
      method: 'GET',
      data: {
        open_id: app.globalData.open_id ,
        limit: 10,
        page: this.data.page,
        pagination: true
      },
      success: res => {
        // res.data 为服务端正确登录后签发的 JWT
        this.setData({
          bookList:res.data.data
        })
      }
    })
  },
  scanSbInfo(){
    wx.scanCode({
      success(res) {
        app.globalData.open_id && (app.globalData.request({
          url: `/goods/findListPageByBarcode`,
          data: {
            open_id:app.globalData.open_id,
            barcode:res.result
          },
          success: res => {
            // res.data 为服务端正确登录后签发的 JWT
            console.log(res)
          }
        }))
      }
    })
  },
  onInputChange(e) {
    this.setData({
      bookName: e.detail
    });
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
  onChangeTab(event){
    this.setData({active:event.detail})
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none'
    // });
  },
});