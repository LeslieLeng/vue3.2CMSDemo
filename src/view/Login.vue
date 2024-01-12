<template>
  <div class="wrap-background">
    <div class="warp-img">
      <img :src="utils.getAssetsFile('login_background.jpg')" alt="" class="bg-img" />
      <div></div>

      <div class="wrap">
        <div class="logo">
          <img
              :src="utils.getAssetsFile('home_sel@2x.png')"
              alt=""
              style="width: 60px; object-fit: cover; margin-right: 10px"
          />小羊后台管理系统
        </div>
        <a-form   ref="formRef"
                :model="formState" :rules="rules"    >
          <a-form-item has-feedback  name="username">
            <a-input v-model:value="formState.username" placeholder="账号">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item has-feedback  name="password">
            <a-input-password  v-model:value="formState.password" autocomplete placeholder="密码" >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button :loading="loading" @click="onSubmit" html-type="submit" style="width: 100%" type="primary"
            >登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="right-img">
        <img :src="utils.getAssetsFile('login_left.svg')" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref,toRaw ,onMounted } from 'vue';
import utils from "@/utils/utils";
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import { VueCookieNext } from 'vue-cookie-next';
import {Login} from "@/api/home";
import { Base64 } from 'js-base64';
import { MD5 } from 'crypto-js';
import { useUserStore } from '@/store/user'
const store = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
interface FormState {
  username: string;
  password: string;
  remember: boolean | false;
}
const loading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: false,
});

const validateUsername = async (_rule:Rule, value:String) => {
  if (value === '') {
    return Promise.reject('请输入账号');
  } else if (!value.match(/^[a-zA-Z][a-zA-Z0-9@.]*$/)) {
    return Promise.reject('账号必须以英文字母开头不包含空格可以包含数字@.');
  } else {
    return Promise.resolve();
  }
}

const validatePassword = async (_rule:Rule, value:String) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else if (!value.match(/^[^ ]+$/)) {
    return Promise.reject('密码不能包含空格');
  } else {
    return Promise.resolve();
  }
}

const rules: Record<string, Rule[]> = {
  username: [{ required: true, validator: validateUsername, trigger: 'change' }],
  password: [{ required: true,validator: validatePassword, trigger: 'change' }],

};
onMounted(()=>{
  const username = VueCookieNext.getCookie('username')
  const password = VueCookieNext.getCookie('password')
  const remember = VueCookieNext.getCookie('remember')
  if (username !== null) {
    formState.username = username
    formState.password = Base64.decode(password)
    formState.remember = Boolean(remember)
  }
})


const onSubmit = () => {
  if (formRef.value) {
    formRef.value
        .validate()
        .then(() => {
          let data = {
            username: formState.username,
            password: MD5(formState.password).toString(),
          }
          loading.value = true

          Login(data)
              .then((res) => {
                if (res.code == 200) {
                  store.Authorization = res.data.token
                  store.nickname = res.data.name
                  store.ownId = res.data.id_str

                  setInfo()
                  router.push('home')
                }
                loading.value = false
              })
              .catch((err) => {
                loading.value = false
              })
        })
        .catch(error => {
          console.log('error', error);
        });
  }
};


const setInfo = () => {
  if (formState.remember) {
    VueCookieNext.setCookie('username', formState.username, { expire: '7d' });
    VueCookieNext.setCookie('password', Base64.encode(formState.password), { expire: '7d' });
    VueCookieNext.setCookie('remember', 'true', { expire: '7d' });
  } else {
    VueCookieNext.setCookie('username', '');
    VueCookieNext.setCookie('password', '');
    VueCookieNext.setCookie('remember', 'false');
  }
};
</script>

<style scoped>
.logo {
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 26px;
}

.wrap {
  width: 400px;
  height: 390px;
  padding: 10px 30px;
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translateY(-50%);
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 0px 10px #555454;
}

.right-img {
  width: 400px;
  height: 390px;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  position: absolute;
}

.warp-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.warp-img .bg-img {
  width: 90%;
  height: 84%;
  border-radius: 10px;
  object-fit: cover;
  opacity: 0.85;
}

.wrap-background {
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  -webkit-animation: Gradient 15s ease infinite;
  -moz-animation: Gradient 15s ease infinite;
  animation: Gradient 15s ease infinite;
}

@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
