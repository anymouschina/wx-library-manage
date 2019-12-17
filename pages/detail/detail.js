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
  onLoad: function (option) {
    option.images = JSON.parse(option.images)
    option.author = JSON.parse(option.author)
    this.setData({
      detail:option,
      activeNames: '1'
    })
  }
})