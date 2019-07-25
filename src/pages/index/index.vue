<template>
  <div>

    <add-tips text="点击『添加到我的小程序』，下次访问更便捷" />

    <demo-block title="消息通知" v-if="noticeStatus">
      <van-notice-bar
        :text=text
        left-icon="//img.yzcdn.cn/public_files/2017/8/10/6af5b7168eed548100d9041f07b7c616.png"
        mode="closeable"
      />
    </demo-block>

    <van-row class="erya-row">
      <van-col  class="erya-col" span="8">
        <div class="erya-col-div" style="color: red">尔</div>
      </van-col>
      <van-col  class="erya-col" span="8">
        <div class="erya-col-div" style="color: blue">雅</div>
      </van-col>
      <van-col  class="erya-col" span="8">
        <div class="erya-col-div" style="color: green">搜</div>
      </van-col>
    </van-row>
    <!--<van-row class="erya-row-search">
      <van-col  span="24">
          <van-search
            v-model="value"
            placeholder="请输入四字以上的内容"
            background="#FAFFF0"
            use-action-slot
            clearable="false"
            error="true"
            @change="onChange"
            @search="onSearch"
            label="题目"
            shape="round">
            <div slot="action" @click="onSearch">搜索</div>
          </van-search>
      </van-col>
    </van-row>-->

    <div class="div-text">
      <textarea auto-height
                placeholder="在此输入相关问题"
                v-model="value"
      />
    </div>
    <div class="div-button">
      <button class="button" @click="onSearch">搜索</button>
      <button class="button-clean" @click="onClean">清除</button>
    </div>

    <div class="div-br-p">
      <div class="div-br">
      </div>
      <h2>搜索结果-只展示前5项</h2>
      <p>共<span style="color:#ff4343">{{answerCount}}</span>条结果</p>
    </div>

    <ul v-if="ulAnsShow" style="margin-top: 65rpx">
      <li v-for="(m,i) in answerData" :key="i" v-if="answerData.length>0">
        <div class="answer">
          <div class="timu">【{{i+1}}】 题目：{{m.question }}</div>
          <div class="ans">答案：{{m.answerStr }}
              <p class="error-quest" @click="errorQuestFeetBack(m.questId)">答案有误?</p>
          </div>
          <ul>
            <li v-for="(ans,j) in m.answers" :key="i" v-if="m.answers.length>0">
               <div class="asn-list">{{ans.answer}}</div>
            </li>
          </ul>
          <div style="color: red;text-align: center;margin-top: 10px">《{{m.subjectName }}》</div>
        </div>
      </li>
    </ul>

    <div class="answer-no" v-if="subjectInfo">
        <div>未搜索到相关信息</div>
        <!--<div>请检查你输入的内容</div>-->
        <p style="margin-bottom: 30rpx;" @click="feedback">反馈你要搜索的课程题目</p>

      <div v-if="hiddenmodalput">
        <form report-submit="true" @submit="feedBackInfo">
          <van-cell-group>
            <van-field
              v-model="feedbacktext"
              label="反馈"
              type="textarea"
              placeholder="请输入你需要的课程答案"
              rows="1"
              autosize
              border="true"
              @change="onFieldChange"
            />
          </van-cell-group>
          <button form-type="submit" type="primary" size="mini" style="margin-top: 30rpx;margin-bottom: 30rpx;"> 提交</button>
        </form>
      </div>
    </div>

   <!-- <modal v-if="hiddenmodalput" title="反馈你需要的课程答案" confirm-text="提交" cancel-text="取消" @cancel="cancel" @confirm="confirm" form-type="submit">
      <input type='text'  v-model="feedbacktext"  placeholder="请输入内容" auto-focus/>
    </modal>-->

    <div class="info-text" v-if="infoTextShow">
      <p>
        &ensp;&ensp;&ensp;&ensp;感谢使用超星尔雅答案搜索助手，可在上方输入框中输入问题的前4-10个字，在搜索前请先查询是否有此课程答案的收录，在‘查课’
        页面进行查询。如有问题，可到查课页面点击客服小哥按钮，与我沟通。
      </p>
    </div>

    <!--:class="adshow==false?'ad':''"-->
    <div class="ad-div" v-if="adshow">
      <ad unit-id="adunit-5a61b30c6573e197" @load="adLoad" @error="adError" @close="adClose" ></ad>
    </div>


    <!--<div class="subject-info" v-if="subjectInfo">
      <div>
        <h3>现收录</h3>
        <p v-for="(sub,i) in subjectInfoCount" :key="i" v-if="subjectInfoCount.length>0">
          《{{sub.subjectName}}》 {{sub.count}}道题
        </p>
      </div>
    </div>-->

    <!--<div class="chat">
      <button class="kf_button" open-type="contact" session-from="weapp">
        <image class="kf_image" src="../../static/images/kefu.png"  mode="widthFix"></image>
      </button>
      <div class="chat-font">
        <p style="color: red">调戏客服</p>
      </div>
    </div>-->


    <div class="shouquan-container" v-if="authorization">
      <div class="shouquan-content">
        <img src="../../../static/images/welcome.png" alt="">
        <button class="start-go-song-btn-two" hover-start-time="10" hover-stay-time="600" hover-class="button-hover" size="default" withCredentials="true" open-type="getUserInfo" lang="zh_CN" @click="getUserInfo">
          微信授权登录
        </button>
      </div>
    </div>

  </div>

</template>

<script>
import card from '@/components/card'
import {get, post} from '../../util'
// 在页面中定义激励视频广告
let videoAd = null

export default {
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var shareObj = {
        title: '尔雅答案搜索',
        path: '/pages/index/main',
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
      text: '',
      answerData: [],
      answerCount:0,
      subjectInfo: false,
      subjectInfoCount: [],
      authorization: false,
      userInfo: {},
      noticeStatus: false,
      hiddenmodalput: false,
      feedbacktext: '',
      adshow: false,
      seachcount: 0,
      ulAnsShow: false,
      infoTextShow: true,
      isAllowSearch: false
    }
  },

  components: {
    card
  },
  methods: {
    adOpen () {
      // console.log(this.$root.$mp.appOptions.path)

    },
    adClose () {
      console.log('Banner 广告关闭')
      this.adshow = false
    },
    adLoad () {
      console.log('Banner 加载成功')
    },
    adError () {
      console.log('Banner 加载失败')
    },
    async errorQuestFeetBack (param) {
      console.info(param)
      let data = {
        'questId': param,
        'openid': wx.getStorageSync('openid')
      }
      let resno = await get('/quest/feetbackError', data)
      if (resno.data) {
        wx.showToast({
          title: '反馈成功',
          duration: 2000
        })
      }
    },
    feedback () {
      this.hiddenmodalput = ! this.hiddenmodalput
    },
    /**
     * 废弃
     */
    cancel () {
      this.feedbacktext = ''
      this.hiddenmodalput = false
    },
    /**
     * 废弃
     */
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
      // this.feedBackInfo()
    },
    onFieldChange(e) {
      this.feedbacktext  = e.mp.detail;
    },
    async feedBackInfo (e) {

      if (this.feedbacktext.trim().length === 0) {
        wx.showToast({
          title: '请输入',
          image: '../../static/images/warn.png',
          duration: 2000
        })
        return false
      }

      let data = {
        'content': this.feedbacktext,
        'openid': wx.getStorageSync('openid'),
        "formid":e.mp.detail.formId
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
    /**
     * 获取通知信息
     * @returns {Promise<void>}
     */
    async getnotice () {
      let resno = await get('/notice/getnotice')
      this.text = resno.data
      if (resno.status === 1) {
        this.noticeStatus = true
      } else {
        this.noticeStatus = false
      }
    },
    async getAdVideo () {
      let resno = await get('/wxad/video')
      this.isAllowSearch = resno.data
    },
    /**
     * 获取课程信息
     * @returns {Promise<void>}
     */
    async subject_Info () {
      let resSub = await get('/search/subCount')
      this.subjectInfoCount = resSub.data
    },
    /**
     * 点击搜索
     * @returns {Promise<boolean>}
     */
    async onSearch () {
      //是否允许搜索
      if(this.isAllowSearch){

        wx.showLoading({
          title: '搜索中',
        })
        //更改消息提示 显示的状态
        this.infoTextShow= false;

        /*// console.log(this.value)
        if (this.seachcount === 3) {
          this.answerData = []
          this.adshow = true
          this.subjectInfo = false
          let that = this
          wx.showModal({
            title: '感谢',
            showCancel: false,
            content: '感谢你能使用此程序，希望你可以点击下方的广告，可以帮助我们做的更好！谢谢！',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.seachcount = that.seachcount + 1
              }
            }
          })
          return false
        }*/
        if (this.value.trim() === '') {
          wx.showToast({
            title: '输入题目',
            image: '../../static/images/warn.png',
            duration: 2000
          })
          return false
        }
        let data = {
          param: this.value.trim()
        }
        let res = await get('/solr/search', data)
        if (res.data.length !== 0) {
          this.ulAnsShow = true
          // 记录搜索次数
          this.seachcount++
          if (this.seachcount > 4) {
            this.adshow = false
          }
          this.subjectInfo = false
        }else{
          this.subjectInfo = true
        }
        this.answerData = res.data
        this.answerCount = res.total

        wx.hideLoading()

      }else{
       var that = this
        console.info("不允许搜")
        //不允许搜索 给提示 然后 自动播放广告
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '感谢你能使用此程序，搜索前会播放15s 的广告，请勿提前关闭，播放完后即可使用搜题。',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              //调用视频广告组件
              that.adMv();
            }
          }
        })
      }
    },
    /**
     * 输入框改变方法
     * @param e
     */
    onChange (e) {
      this.value = e.mp.detail
      /*if (this.value.length === 0) {
        // this.subjectInfo = true
        this.ulAnsShow = false
      }*/
    },
    onClean (){
      this.value ="";
    },
    getOpenId: async function (code) {
      let res = await get('wxlogin/' + code)
      this.openIds = res.openid
      if (this.openIds) {
        wx.setStorageSync('openid', this.openIds)
        let resa = await get('ishasUser/' + this.openIds)
        if (resa.result === true) {
          let openId = {
            'openid': this.openIds
          }
          let resb = await get('userinfo', openId)
          wx.setStorageSync('avatarUrl', resb.avatarurl)
          wx.setStorageSync('nickName', resb.nickname)
        } else {
          this.authorization = true
        }
      } else {
        wx.showToast({
          title: '网络异常,请稍后。。。',
          icon: 'none',
          duration: 1000
        })
      }
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
              wx.setStorageSync('avatarUrl', this.userInfo.avatarUrl)
              wx.setStorageSync('nickName', this.userInfo.nickName)
              this.setUserInfo()
            }
          })
        }
      })
    },
    async setUserInfo () {
      let data = {
        openid: this.openIds,
        nickname: this.userInfo.nickName,
        avatarurl: this.userInfo.avatarUrl,
        province: this.userInfo.province,
        city: this.userInfo.country,
        gender: this.userInfo.gender
      }
      let res = await post('authorizeUser', data)
      if (res.result) {
        this.authorization = false
      }
    },
    openId () {
      let that = this
      wx.checkSession({
        success: function () {
          // console.log('session_key未过期!')
          wx.showLoading(
            {
              title: '玩命加载中...',
              mask: true,
              icon: 'loading'
            }
          )
          wx.login({
            success: function (res) {
              if (res.code) {
                // 发起网络请求
                wx.hideLoading()
                that.getOpenId(res.code)
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          console.log('session_key过期!')
          wx.showLoading(
            {
              title: '玩命加载中...',
              mask: true,
              icon: 'loading'
            }
          )
          wx.login({
            success: function (res) {
              if (res.code) {
                // 发起网络请求
                wx.hideLoading()
                that.getOpenId(res.code)
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    },
    adMv (){
      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败')
              //广告加载失败时  直接跳过 直接搜索
              this.isAllowSearch = true;
            })
        })
      }
    }
  },

  created () {
    // let app = getApp()
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-b21af79790982a4c'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        //监听用户是否点击了关闭广告
        if(res && res.isEnded){
          //正常结束 开启搜索
          this.isAllowSearch = true;
        }else{
          //不正常结束  给与提示
          wx.showToast({
            title: '提前结束广告',
            image: '../../static/images/warn.png',
            duration: 2000
          })
        }
      })
    }
  },

  mounted () {
    this.openId()
    // this.subject_Info()
    this.getnotice()
    this.getAdVideo()
  },
  onHide () {
  }
}
</script>

<style scoped>
  .ad ad{
    display:none !important;
  }
  .error-quest{
    float: right;
    position: relative;
    right: 10px;
    color: blue;
  }
  .subject-info{
    background: #63ff60;
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
  .answer-no{
   /* background: #ff7cb8;*/
    border: 1px solid #000000;
    /*  height: 150px ;*/
    height: auto;
    width: 95%;
    margin-left: 8px;
    margin-bottom: 3px;
    margin-top: 65px;
    font-size: small;
    text-align:center;
  }
  .answer-no p{
    margin-top: 10px;
    color: #3a3cff;
  }
  .answer{
    background: #ffab7a;
    border: 1px solid #000000;
  /*  height: 150px ;*/
    height: auto;
    width: 95%;
    margin-left: 8px;
    margin-bottom: 3px;
    margin-top: 10px;
    font-size: small;
  }
  .asn-list{
    margin-left: 35px;
  }
  .ans{
    margin-top: 10px;
    margin-left: 10px;
  }
  .timu{
    margin-top: 5px;
    margin-left: 5px;
  }

  .erya-col-div{
    text-align:center;
    line-height: 100px;
    font-size: 50px;
    font-weight: bold;
  }
  .erya-col{

  }
  .erya-row-search{
    margin-bottom: 10px;
  }

  .erya-row{
    background-color: red;
    height: 100px;
    width: 60px;
    text-align:center;   /* 水平居中 */
    line-height: 100px;  /* 垂直剧终 */
  }


  .shouquan-container{
    width: 750rpx;
    height: 100%;
    position: fixed;
    top:0px;
    left: 0px;
    background:rgba(0,0,0,.75);
    z-index: 99;
  }

  .shouquan-content{
    width: 500rpx;
    height: 500rpx;
    background: #fff;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    border-radius: 45rpx;

  }
  .shouquan-content img{
    width: 200rpx;
    height: 200rpx;
    display: block;
    margin: 70rpx auto 0;
  }
  .start-go-song-btn-two{
    width:420rpx;
    height:100rpx;
    margin: 40rpx auto 0;
    line-height: 100rpx;
    background: #09bb07;
    color:#fff;
    font-size: 36rpx;
  }
  .info-text{
    height: auto;
    width: 95%;
    margin-left: 8px;
    margin-bottom: 35rpx;
    margin-top: 65px;
    font-size: small;
    text-align: left;
  }
  .ad-div{
    margin-top: 30rpx;
  }
  .div-text{
    height: 80px;
    width: 90%;
    border-radius: 10px 10px 10px 10px;
    position: relative;
    left: 35rpx;
    background-color: #F3F4F8;
    /*text-align: center;*/
    /*padding: 10px 10px;*/
    /*border:1px black solid;*/
  }
  .div-text textarea{
    padding: 10px 10px;
    color: #332f2e;
    font-size: large;
    height:100%;
  }
  .div-button{
    margin-top: 10px;
    text-align: center;
  }
  .button {
    background-color: #04a7f7; /* Green */
    border: none;
    color: white;
    padding: 10rpx 120rpx;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 100px 100px 100px 100px;
  }
  .div-br{
    background-color: #04a7f7;
    width: 7px;
    height: 30px;
    margin-left: 7px;
    float: left;
  }
  .div-br-p h2{
    float: left;
    margin-left: 15px;
  }
  .div-br-p p{
    float: right;
    margin-right: 10px;
  }
  div-br-p{
    margin-bottom: 10px;
  }
  .button-clean{
    background-color: #f74c5d; /* Green */
    border: none;
    color: white;
    padding: 10rpx 30rpx;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-top: 4px;
    margin-left: 20px;
    cursor: pointer;
    border-radius: 100px 100px 100px 100px;

  }
</style>
