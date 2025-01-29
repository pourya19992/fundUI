<template>
  <Header/>
  <div class="w-full max-w-md mx-auto p-4">
    <h2 class="text-2xl font-bold text-center mb-6">ورود به حساب</h2>

    <!-- فرم ورود -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- فیلد کاربر -->
      <div>
        <label for="username" >نام کاربری</label>
        <input
            id="username"
            v-model="username"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="کاربر"
        />
      </div>

      <!-- فیلد کلمه عبور -->
      <div>
        <label for="password">کلمه عبور</label>
        <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="رمز عبور"
        />
      </div>

      <!-- تصویر امنیتی و عبارت امنیتی -->
      <div>
        <label for="securityPhrase" >کپچا</label>
        <input
            id="securityPhrase"
            v-model="securityPhrase"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p class="mt-2 text-sm text-gray-500">Please enter the phrase above.</p>
      </div>

      <!-- انتخاب نحوه ورود دوعاملی -->
      <div>
        <label for="twoFactor" >نحوه ورود</label>
        <select v-model="twoFactorMethod" id="twoFactor"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="none">None</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="app">Authenticator App</option>
        </select>
      </div>


      <!-- تایمر دوعاملی -->
      <div v-if="twoFactorMethod !== 'none'">
        <p class="mt-2 text-sm text-gray-700">Two-factor authentication will expire in: {{ timer }} seconds</p>
        <button type="button" @click="startTimer" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          ارسال کد
        </button>
      </div>

      <!-- دکمه ورود -->
      <div>
        <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">ورود</button>
      </div>
    </form>
  </div>
  <Footer/>
</template>

<script setup>
import {ref} from "vue";
import Header from "~/components/form/Header.vue";
import Footer from "~/components/form/Footer.vue";

// وضعیت فیلدهای ورودی
const username = ref("");
const password = ref("");
const securityPhrase = ref("");
const twoFactorMethod = ref("none");

// تایمر
const timer = ref(0);
let timerInterval;

// شروع تایمر
const startTimer = () => {
  if (twoFactorMethod.value !== "none") {
    timer.value = 60; // تایمر را از 60 ثانیه شروع می‌کنیم
    timerInterval = setInterval(() => {
      if (timer.value > 0) {
        timer.value -= 1;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
};

// هندل کردن ورود
const handleLogin = () => {
  // اینجا می‌توانید درخواست ورود به سرور را ارسال کنید.
  console.log({
    username: username.value,
    password: password.value,
    securityPhrase: securityPhrase.value,
    twoFactorMethod: twoFactorMethod.value
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
}
.login-left {
  flex: 2;
  background-position: center;
  background-size: cover;
}
.login-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.login-logo {
  width: 128px;
  object-fit: contain;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.tab-button {
  padding: 10px 20px;
  background-color: #e0e0e0;
  border-radius: 5px;
  cursor: pointer;
}
.tab-selected {
  background-color: #eb7322;
  color: #414141;
}
.form-control {
  margin-bottom: 20px;
}
input {
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: right;
}
.captcha-container {
  display: flex;
  gap: 10px;
  align-items: center;
}
.captcha-container img {
  max-width: 200px;
  height: auto;
}
.error-message {
  color: red;
  margin-bottom: 20px;
}
.buttons {
  display: flex;
  gap: 10px;
}
button {
  padding: 10px 20px;
  background-color: #021b34;
  color: white;
  border: none;
  cursor: pointer;
}
label {
  display: block;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}
</style>