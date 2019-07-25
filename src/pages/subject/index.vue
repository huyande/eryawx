<template>
  <div>
    <van-row class="erya-row">
      <van-col  class="erya-col" span="8">
        <div class="erya-col-div" style="color: red">查</div>
      </van-col>
      <van-col  class="erya-col" span="8">
        <div class="erya-col-div" style="color: blue">课</div>
      </van-col>
      <van-col  class="erya-col" span="8">
        <div class="erya-col-div" style="color: green">程</div>
      </van-col>
    </van-row>

     <!-- <van-search
        placeholder="请输入课程名称"
        v-model="value"
        @change="onChange"
        @search="onSearch"
        background="#4169E1"
      />-->
    <form report-submit="true" @submit="onSearch">
      <van-search
        v-model="value"
        placeholder="请输入课程名称"
        use-action-slot
        clearable
        @change="onChange"
        >
        <button class="search-button" slot="action" form-type="submit">搜索</button>
      </van-search>
    </form>

    <div class="subject-info" v-if="subjectInfo">
      <div>
        <h3>现收录{{subCount}}门课程,共计{{questCount}}道题 以下显示部分课程信息</h3>
        <p v-for="(sub,i) in subjectInfoCount" :key="i" v-if="subjectInfoCount.length>0" style="margin-bottom: 15rpx">
          《{{sub.subjectName}}》 {{sub.count}}道题
        </p>
      </div>
    </div>

    <div class="subject-info-search" v-if="subjectInfos.length>0">
      <div>
        <h3 >查询到以下信息</h3>
        <p v-for="(sub,i) in subjectInfos" :key="i" v-if="subjectInfos.length>0" style="margin-bottom: 15rpx">
          收录 《{{sub.subjectName}}》 {{sub.count}}道题
        </p>
      </div>
    </div>

    <div class="answer-no" v-if="subjectInfoNo">
      <div>未搜索到相关课程信息</div>
      <!--<div>请检查你输入的内容</div>-->
      <!--<p @click="feedback">反馈你要搜索的课程题目</p>-->
      <p>已经记录您需要的课程，完成收录会通知您</p>
      <p>感谢使用尔雅搜题</p>
    </div>

   <!-- <form report-submit="true" @submit="confirm">
      <modal v-if="hiddenmodalput" title="反馈你需要的课程答案" confirm-text="提交" cancel-text="取消" @cancel="cancel" @confirm="confirm">
        <input type='text'  v-model="feedbacktext"  placeholder="请输入内容" auto-focus/>
      </modal>
    </form>-->

    <!--<form report-submit="true" @submit="uploadFormId">-->
      <!--<button form-type="submit"> 查看/分享/首页/支付</button>-->
    <!--</form>-->

    <div class="chat">
      <button class="kf_button" open-type="contact" session-from="weapp">
        <image class="kf_image" src="../../static/images/kefu.png"  mode="widthFix"></image>
      </button>
      <div class="chat-font">
        <p style="color: red">调戏客服</p>
      </div>
    </div>

  </div>
</template>


<script>
  import {get, post} from '../../util'
  var interstitialAd = null
  export default {
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        var shareObj = {
          title: '尔雅答案搜索',
          path: '/pages/subject/main',
          success: function (res) {
            if (res.errMsg === 'shareAppMessage:ok') {
            }
          }
        }
        return shareObj
      }
    },
    data () {
      return {
        value: '',
        subjectInfo: true,
        subjectInfoCount: [],
        subCount: 0,
        questCount: 0,
        subjectInfos:[],
        hiddenmodalput: false,
        feedbacktext: '',
        subjectInfoNo:false
      }
    },
    methods:{
      cancel () {
        this.feedbacktext = ''
        this.hiddenmodalput = false
      },
      confirm (e) {
        console.info(e)
        if (this.feedbacktext.trim().length === 0) {
          wx.showToast({
            title: '请输入',
            image: '../../static/images/warn.png',
            duration: 2000
          })
          return false
        }
        this.feedBackInfo()
      },
      async feedBackInfo () {
        let data = {
          'content': this.feedbacktext,
          'openid': wx.getStorageSync('openid')
        }
        let resno = await get('/quest/feetback', data)
        if (resno.data) {
          this.feedbacktext = ''
          this.hiddenmodalput = false
          wx.showToast({
            title: '反馈成功',
            duration: 2000
          })
        }
      },
      feedback () {
        this.hiddenmodalput = true
      },
      async onSearch (e) {
        if (this.value.trim() === '') {
          wx.showToast({
            title: '输入课程题目',
            image: '../../static/images/warn.png',
            duration: 2000
          })
          return false
        }
        let data = {
          searchName: this.value.trim(),
          openid: wx.getStorageSync('openid'),
          formid: e.mp.detail.formId
        }
        let res = await get('/subject/subinfo', data)
        this.subjectInfo = false
        if (res.data.length>0) {
          this.subjectInfos = res.data
          this.subjectInfoNo = false
        }else{
          this.subjectInfos=[]
          this.subjectInfoNo = true
        }
      },
      /**
       * 输入框改变方法
       * @param e
       */
      onChange (e) {
        this.value = e.mp.detail
      },
      /**
       * 获取课程信息
       * @returns {Promise<void>}
       */
      async subject_Info () {
        let data = {
          'currentpage':1,
          'pagesize':20
        }
        let resSub = await get('/search/subCount',data)
        this.subjectInfoCount = resSub.data
      },
      async subAndQuestCount () {
        let res = await get('/search/subAndQuestCount')
        this.subCount = res.subCount
        this.questCount = res.questCount
      }
    },
    mounted () {
      this.subject_Info()
      this.subAndQuestCount()
    },
    created () {
    },
    onShow () {
      if (interstitialAd) {
        interstitialAd.show().catch((err )=> {
          console.error(err)
        })
      }
    },
    onLoad () {
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-b2a776ba93c7d30f'
        })
        interstitialAd.onLoad(() => {
          console.log('onLoad event emit')
        })
        // interstitialAd.onError((err )=> {})
        interstitialAd.onClose(() => {
          console.log('onClose event emit', res)
        })
      }
    }
  }
</script>

<style>
  .subject-info{
    background: #c6b0ff;
    border: 1px solid #000000;
    /*  height: 150px ;*/
    height: auto;
    width: 95%;
    margin-left: 8px;
    margin-bottom: 3px;
    margin-top: 10px;
    font-size: small;
    text-align: center;
  }
  .subject-info-search{
    background: #c6b0ff;
    border: 1px solid #000000;
    /*  height: 150px ;*/
    height: auto;
    width: 95%;
    margin-left: 8px;
    margin-bottom: 3px;
    margin-top: 10px;
    font-size: small;
    text-align: center;
  }
  .subject-info h3{
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  .subject-info-search h3{
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  .sub-title{
    text-align: center;
    margin-top: 10rpx;
    color: red;
  }
  .erya-row{
    background-color: red;
    height: 100px;
    width: 60px;
    text-align:center;   /* 水平居中 */
    line-height: 100px;  /* 垂直剧终 */
  }
  .erya-col-div{
    text-align:center;
    line-height: 100px;
    font-size: 50px;
    font-weight: bold;
  }
  .answer-no{
    /* background: #ff7cb8;*/
    border: 1px solid #000000;
    /*  height: 150px ;*/
    height: auto;
    width: 95%;
    margin-left: 8px;
    margin-bottom: 3px;
    margin-top: 10px;
    font-size: small;
    text-align:center;
  }
  .answer-no p{
    margin-top: 10px;
    color: #3a3cff;
  }
  .search-button{
    height: 70rpx;
    font-size: small;
  }
  .chat-font{
    border: 0px;
    height: 60rpx;
    right: 20rpx;
    bottom: 15rpx;
    position: fixed;
    font-size: small;
  }
  .kf_button{
    background-color: rgba(255, 255, 255, 0);
    border: 0px;
    height: 120rpx;
    right: -10rpx;
    bottom: 65rpx;
    position: fixed;
  }
  .kf_button::after{
    border: 0px;
  }
  .kf_image{
    z-index: 9999;
    width: 120rpx;
    height: 120rpx;
  }
</style>
