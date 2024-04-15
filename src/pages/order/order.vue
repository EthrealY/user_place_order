<script setup>
import { useRouter, useRoute } from 'vue-router';
import { reactive, onMounted, ref } from 'vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();


const productId = route.params.productId;

//商品信息
const productInfo = reactive({
  title: '',
  description: '',
  price: 0,
  stock:0,
  shopname: '',
  url: ''
});

//从本地存储中获取 token
// const token = localStorage.getItem('authToken'); 
const token='eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoxLCJpZCI6MSwidXNlcm5hbWUiOiJtaXpvcmUiLCJleHAiOjE3MjE2MzQwMjZ9.EeM1R1sEt-DRY6nSRwfUqdIJzozzVaoNU0VR0lfiYI4';




//订单信息
const data = reactive({
  address: '',
  consignee: '',
  phonenumber: ''
});

//商品数量
const quantity = ref(1);

//挂载时获取商品信息展示在页面的商品详情处
onMounted(async () => {
  try {
    // const productId = route.params.productId;
    const itemResponse = await axios.get(
      /*`http://127.0.0.1:4523/m1/4324087-0-default/product_detail/${productId}`,{ headers: { Authorization: `Bearer ${token}` }}*/
      `http://127.0.0.1:4523/m1/4275135-0-default/item/${productId}`,{ headers: { Authorization: `Bearer ${token}` }}

    );

    const productData = itemResponse.data.data;

    productInfo.name = productData.title;
    productInfo.description = productData.description;
    productInfo.price = productData.price;
    productInfo.shopname = productData.sellerId;
    productInfo.pictureUrl = productData.url;
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
});

function onClick() {
  router.push({ name: 'product_detail', params: { productId: productId.value } });
}

//处理支付
const handlePayment = async () => {
  try {
    // 构建请求头，携带 token
    const headers = {
      Authorization: `Bearer ${token}`
    };

    // 收集订单数据，例如商品信息、购买数量、收货地址等
    const orderData = {
      quantity: quantity.value,
      address: data.address,
      consignee: data.consignee,
      
    };

    // 发送订单数据到后台请求生成订单
    const orderResponse = await axios.post(
      'http://127.0.0.1:4523/m1/4324087-0-default/order',
      {orderData,
      headers//请求头中携带token
      }
    );

    // 处理后台返回的信息
    const traceNo = orderResponse.traceNo; 
    const totalAmount = orderResponse.totalAmount;
    const subject = orderResponse.subject; 
    //// 构建支付接口的参数对象
    const paymentParams = {
      traceNo: traceNo, 
      totalAmount: totalAmount,
      subject: encodeURIComponent(subject) 
    };

     //发送请求到支付接口
    const paymentResponse = await axios.get('http://127.0.0.1:4523/m1/4275135-0-default/pay/create',  { params: paymentParams , headers,responseType: 'text' });
    //获取返回的支付页面的HTML内容
    const paymentHtml = paymentResponse.data;
    // 打开新的窗口，并将支付页面的 HTML 内容加载到新窗口中
    const paymentWindow = window.open('', '_blank');
    // paymentWindow.onload=function(){
      paymentWindow.document.write(paymentHtml);
    // }
    

  } catch (error) {
    console.error('Failed to pay:', error);
  }
};
</script>

<template>
  <div class="flex-col page">
    <div class="flex-col header">
      <div class="flex-row justify-center items-start relative group">
        <div class="flex-row items-end pos">
          <img
  class="shrink-0 image"
  src="https://ide.code.fun/api/image?token=661c9b87955475001195f22d&name=1a78ac75b92cfd52cb8e19e0c3a8e00a.png"
/>
          <span class="ml-22 text">Easy BUY</span>
        </div>
        <span class="text_2">填写订单</span>
      </div>
      <div class="mt-42 flex-row">
        <img
          class="image_2"
          src="https://ide.code.fun/api/image?token=661c9b87955475001195f22d&name=60274a898e2131baf2769c5a294e5313.png"
          alt="Description of the image2"
          @click="onClick"
        />
        <span class="text_3 ml-15" @click="onClick">Return</span>
      </div>
    </div>
    <div class="flex-col flex-1 group_2">
      <div class="shrink-0 self-start relative divider"></div>
      <span class="self-start font text_4">Order Details</span>
      <div class="flex-col self-center group_3">
        <div class="flex-col">
          <div class="flex-row items-center">
    <img
            class="shrink-0 image_3"
            src="https://ide.code.fun/api/image?token=661c9d4a955475001195f282&name=885a621e9694e941c3b9656fa0d462a9.png"
          />
            <span class="font_2 text_5">收货地址：</span>
            <div class="flex-col justify-start items-start flex-1 view" style="position: relative">
              <!-- <span class="font_2 text_7">西安电子科技大学南校区</span> -->

              <input
                v-model="data.address"
                class="font_2 text_7"
                type="text"
                placeholder="Please enter your address"
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 80%; /* 调整输入框宽度 */
                  height: 80%; /* 调整输入框高度 */
                  border: none;
                  outline: none;
                "
              />
            </div>
          </div>
          <div class="mt-22 flex-row items-center">
            <img
  class="shrink-0 image_3"
  src="https://ide.code.fun/api/image?token=661c9b87955475001195f22d&name=e21908ba45a4b85d7239dc8d96ac8a7b.png"
/>
            <span class="font_2 text_8">收货人：</span>
            <div
              class="flex-col justify-start items-start flex-1 view_2"
              style="position: relative"
            >
              <!-- <span class="font_2 text_9">张三</span> -->
              <input
                v-model="data.consignee"
                class="font_2 text_9"
                type="text"
                placeholder="Please enter consignee "
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 80%; /* 调整输入框宽度 */
                  height: 80%; /* 调整输入框高度 */
                  border: none;
                  outline: none;
                "
              />
            </div>
          </div>
          <div class="mt-22 flex-row items-center">
            <img
  class="shrink-0 image_4"
  src="https://ide.code.fun/api/image?token=661c9b87955475001195f22d&name=5a528b7f71b133d5c9c8f1e47270dcd7.png"
/>
            <span class="font_2 text_10">联系电话：</span>
            <div
              class="flex-col justify-start items-start flex-1 text-wrapper_2"
              style="position: relative"
            >
              <!-- <span class="font_2 text_11">15036345259</span> -->
              <input
                v-model="data.phonenumber"
                class="font_2 text_11"
                type="text"
                placeholder="Please enter phone number"
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 80%; /* 调整输入框宽度 */
                  height: 80%; /* 调整输入框高度 */
                  border: none;
                  outline: none;
                "
              />
            </div>
          </div>
        </div>

        <!-- 这里是商品选择情况的部分 -->
        <div class="flex-col group_4">
          <div class="flex-row items-center">
            <img
  class="image_5"
  src="https://ide.code.fun/api/image?token=661c9d4a955475001195f282&name=a988bd89bb5a27b71d01c75a5835daf2.png"
/>
            <span class="ml-9"> 店铺名称: {{ productInfo.shopname }} </span>
          </div>
          <div class="flex-row mt-19">
            <img class="image_7" :src="productInfo.pictureUrl" />
            <div class="flex-col self-start group_5 ml-4">
              <!-- 调整product.name和product.description的布局 -->
              <div class="flex-col items-start self-stretch">
                <span class="text_12">{{ productInfo.name }}</span>
                <span class="mt-14 font_3 text_13 description" style="overflow: hidden">
                  {{ productInfo.description }}
                </span>
              </div>
              <div class="flex-row items-center mt-10">
                <span class="font text_14 mr-4">￥{{ productInfo.price }}</span>
                <el-input-number
                  v-model="quantity"
                  :min="1"
                  :max="100"
                  class="custom-input"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>

        <!-- 这里是支付方式选择，默认选择支付宝支付-->
        <div class="flex-row items-center group_7">
          <span class="font_2 text_16">支付方式：</span>
          <div class="flex-row equal-division ml-5">
            <div class="flex-row justify-between items-center equal-division-item section">
              <div class="flex-col justify-start section_3">
                
                <div class="flex-col justify-start section_4">
                  <div class="flex-col justify-start section_4">
                    <div class="flex-col justify-start section_4">
                      <div class="flex-col justify-start section_4">
                        <div class="flex-col justify-start items-center section_4">
                          <img
  class="image_9"
  src="https://ide.code.fun/api/image?token=661c9d4a955475001195f282&name=9de6439363b41d01b97cfa8fe9e78469.png"
/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <span class="font_3 text_17">支付宝支付</span>
            </div>
            <div class="flex-row justify-between equal-division-item section_2 ml-19">
              <img
  class="self-center image_10"
  src="https://ide.code.fun/api/image?token=661c9d4a955475001195f282&name=c1b42a4262a094a58c7b4a1471945e58.png"
/>
              <span class="self-start font_3 text_18">微信支付</span>
            </div>
          </div>
        </div>
        <!-- 付款 -->
        <div class="flex-col group_8">
          <div class="flex-row">
            <el-button @click="handlePayment" type="primary" class="text_19 flex-item text-wrapper_4">
              确认付款
            </el-button>
          </div>
          <div class="flex-row">
            <el-button class="text_20 flex-item text-wrapper_5 mt-23"> 取消订单 </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.description {
  overflow: hidden; /* 控制文本溢出的处理方式 */
}

.ml-15 {
  margin-left: 0.94rem;
}
.ml-9 {
  margin-left: 0.56rem;
}
.mt-19 {
  margin-top: 1.19rem;
}
.mt-35 {
  margin-top: 2.19rem;
}
.ml-5 {
  margin-left: 0.31rem;
}
.ml-19 {
  margin-left: 1.19rem;
}
.mt-23 {
  margin-top: 1.44rem;
}
.page {
  background-color: #ebebeb;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.header {
  padding: 1.31rem 1.81rem 2rem;
  height: 9.38rem;
}
.group {
  padding-top: 1.06rem;
}
.pos {
  position: absolute;
  left: 0;
  top: 0;
}
.image {
  width: 2.56rem;
  height: 1.94rem;
}
.text {
  color: #000000;
  font-size: 1.06rem;
  font-family: Poppins;
  font-weight: 700;
  line-height: 1.25rem;
  text-transform: uppercase;
  width: 4.81rem;
}
.text_2 {
  color: #000000;
  font-size: 1.5rem;
  font-family: Montserrat;
  font-weight: 600;
  line-height: 1.38rem;
}
.image_2 {
  width: 1rem;
  height: 1rem;
}
.text_3 {
  color: #000000;
  font-size: 1.25rem;
  font-family: Poppins;
  line-height: 0.89rem;
}
.group_2 {
  padding-bottom: 1.88rem;
  overflow-y: auto;
}
.divider {
  margin-left: -1.97rem;
  margin-top: -4.97rem;
  background-color: #bfbaba;
  width: 82.28rem;
  height: 0.063rem;
}
.font {
  font-size: 2.25rem;
  font-family: Poppins;
  line-height: 1.94rem;
}
.text_4 {
  margin-left: 7.24rem;
  margin-top: 4.91rem;
  color: #000000;
  width: 14.31rem;
}
.group_3 {
  margin-top: 1.91rem;
  width: 44.34rem;
}
.image_3 {
  width: 2rem;
  height: 2rem;
}
.font_2 {
  font-size: 1.13rem;
  font-family: Poppins;
  line-height: 1.04rem;
  color: #000000;
}
.text_5 {
  margin-left: 0.69rem;
}
.view {
  margin-right: 0.38rem;
  padding: 1.48rem 0 1.6rem;
  background-color: #ffffff;
  border-radius: 3.81rem;
  height: 4.25rem;
  border-left: solid 0.063rem #000000;
  border-right: solid 0.063rem #000000;
  border-top: solid 0.063rem #000000;
  border-bottom: solid 0.063rem #000000;
}
.text_7 {
  margin-left: 1.89rem;
  line-height: 1.05rem;
}
.text_8 {
  margin-left: 0.69rem;
}
.view_2 {
  margin-left: 1.15rem;
  margin-right: 0.38rem;
  padding: 1.51rem 0 1.59rem;
  background-color: #ffffff;
  border-radius: 3.81rem;
  height: 4.25rem;
  border-left: solid 0.063rem #000000;
  border-right: solid 0.063rem #000000;
  border-top: solid 0.063rem #000000;
  border-bottom: solid 0.063rem #000000;
}
.text_9 {
  margin-left: 1.92rem;
  line-height: 1.02rem;
}
.image_4 {
  width: 2.25rem;
  height: 2.25rem;
}
.text_10 {
  margin-left: 0.35rem;
}
.text-wrapper_2 {
  margin-right: 0.44rem;
  padding: 1.62rem 0 1.68rem;
  background-color: #ffffff;
  border-radius: 3.81rem;
  height: 4.25rem;
  border-left: solid 0.063rem #000000;
  border-right: solid 0.063rem #000000;
  border-top: solid 0.063rem #000000;
  border-bottom: solid 0.063rem #000000;
}
.text_11 {
  margin-left: 1.84rem;
  line-height: 0.82rem;
}
.group_4 {
  margin-top: 3.41rem;
}
.image_5 {
  width: 1.94rem;
  height: 1.94rem;
}
.image_6 {
  width: 6.63rem;
  height: 1.06rem;
}
.image_7 {
  border-radius: 4.06rem;
  width: 15.75rem;
  height: 12.13rem;
}
.group_5 {
  margin-left: 2.78rem;
  margin-top: 0.2rem;
}
.text_12 {
  color: #000000;
  font-size: 1.5rem;
  font-family: Poppins;
  font-weight: 700;
  line-height: 1.43rem;
}
.font_3 {
  font-size: 1.25rem;
  font-family: Poppins;
  line-height: 1.19rem;
  font-weight: 700;
  color: #000000;
}
.text_13 {
  color: #bfbaba;
  line-height: 1.94rem;
  width: 5.44rem;
}
.text_14 {
  color: #ff003c;
  line-height: 2rem;
}
.group_6 {
  margin-left: 4.91rem;
  margin-top: 6.06rem;
}
.image_8 {
  width: 1.81rem;
  height: 1.81rem;
}
.group_7 {
  margin-top: 3.09rem;
  padding-left: 0.29rem;
}
.text_16 {
  line-height: 1.04rem;
}
.equal-division {
  flex: 1 1 0;
}
.equal-division-item {
  flex: 1 1 18.44rem;
}
.section {
  padding: 1.07rem 2.82rem 1.11rem;
  background-color: #ffffff;
  border-radius: 2.13rem;
  height: 6.5rem;
  border-left: solid 0.063rem #ffffff;
  border-right: solid 0.063rem #ffffff;
  border-top: solid 0.063rem #ffffff;
  border-bottom: solid 0.063rem #ffffff;
}
.section_3 {
  background-image: url('https://ide.code.fun/api/image?token=6618a1a5ec6c850012d20c62&name=9de6439363b41d01b97cfa8fe9e78469.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 4.19rem;
  height: 4.19rem;
}
.section_4 {
  background-image: url('https://ide.code.fun/api/image?token=6618a1a5ec6c850012d20c62&name=9de6439363b41d01b97cfa8fe9e78469.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 4.19rem;
}
.image_9 {
  width: 4.19rem;
  height: 4.19rem;
}
.text_17 {
  margin-right: 0.2rem;
}
.section_2 {
  padding: 1.39rem 2.76rem 1.05rem;
  background-color: #ffffff;
  border-radius: 2.13rem;
  height: 6.5rem;
  border-left: solid 0.063rem #ffffff;
  border-right: solid 0.063rem #ffffff;
  border-top: solid 0.063rem #ffffff;
  border-bottom: solid 0.063rem #ffffff;
}
.image_10 {
  width: 4.38rem;
  height: 3.94rem;
}
.text_18 {
  margin-right: 0.96rem;
  margin-top: 1.15rem;
  line-height: 1.18rem;
}
.group_8 {
  margin-top: 2.06rem;
}
.text-wrapper_4 {
  margin-right: 0.31rem;
  padding: 1.52rem 0 1.68rem;
  background-color: #ffffff;
  border-radius: 13.13rem;
  width: 44rem;
  border-left: solid 0.063rem #000000;
  border-right: solid 0.063rem #000000;
  border-top: solid 0.063rem #000000;
  border-bottom: solid 0.063rem #000000;
}
.text_19 {
  color: #000000;
  font-size: 1.88rem;
  font-family: AlibabaPuHuiTi;
  font-weight: 300;
  line-height: 1.73rem;
  text-shadow: 0 0.063rem #000000, 0 -0.063rem #000000, 0.063rem 0 #000000, -0.063rem 0 #000000;
}
.text-wrapper_5 {
  margin-left: 0.13rem;
  margin-right: 0.28rem;
  padding: 1.47rem 0 1.77rem;
  background-color: #ff5733;
  border-radius: 13.13rem;
  width: 43.94rem;
}
.text_20 {
  color: #ffffff;
  font-size: 1.88rem;
  font-family: Poppins;
  font-weight: 700;
  line-height: 1.76rem;
}
</style>