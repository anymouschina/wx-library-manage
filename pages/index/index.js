const app = getApp();
import Dialog from '../../components/dialog/dialog.js';
Page({
  data: {
    active: 0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    list: {},
    showLoading:false,
    timer:null,//节流器
    page:1,
    expoIdx:0,
    bookList:[],
    defaultList:[],
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
  onLoad: function () {
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
        console.log(item)
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
    const that = this
    wx.createSelectorQuery().selectAll('.book-item').boundingClientRect(function (rect) {
      if(rect[0].height - event.scrollTop===450){
        that.setData({
          page:that.data.page+1
        })
        that.getList()
      }
    // console.log(rect)
    }).exec()
    this.interSection(event)
  },
  getList(){
    this.setData({
      showLoading: true
    })
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
          showLoading: false
        })
        let list = this.data.bookList
        const ids = list.map(item => item.id)
        let isRepeat = res.data.data.some(item=>ids.indexOf(item.id)>-1)
        if(!isRepeat){
          list.push(...res.data.data)
          this.setData({
            bookList: list,
            defaultList:list
          })
        }
      }
    })
  },
  scanSbInfo(){
    let that = this
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
            if(res.data.error){
              wx.showToast({
                title: res.data.error,
                icon: 'info',
                iconColor: 'green'
              })
            }else{
              that.scanSbInfo()
            }
          }
        }))
      }
    })
  },
  onInputChange(e) {
    this.setData({
      bookList: e.detail === ''?this.data.defaultList:this.data.defaultList.filter(item=>item.goodsName.indexOf(e.detail)>-1)
    });
  },
  queryObjParse(obj){//obj装url的query
   let arr = []
    for(let key in obj){
      arr.push(`${key}=${this.toString.call(obj[key]) === '[object Object]' || this.toString.call(obj[key]) === '[object Array]'?JSON.stringify(obj[key]):obj[key]}`)
    }
    return arr.join('&')
  },
  lookDetail(item){//查看详情
    wx.navigateTo({
      url: '/pages/detail/detail?'+this.queryObjParse(item.mark.detail)
    })
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