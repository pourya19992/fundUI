<template>
  <Header />
  <div class="w-full max-w-md mx-auto p-4">
    <h2 class="text-2xl font-bold text-center mb-6">ورود به حساب</h2>

    <!-- فرم ورود -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- فیلد کاربر -->
      <div>
        <label for="username">نام کاربری</label>
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

      <!-- کپچا -->
      <div>
        <label for="securityPhrase">کپچا</label>
        <input
            id="securityPhrase"
            v-model="securityPhrase"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="کد امنیتی"
        />
      </div>

      <!-- انتخاب نحوه ورود دوعاملی -->
      <div>
        <label for="twoFactor">نحوه ورود</label>
        <select
            v-model="twoFactorMethod"
            id="twoFactor"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="none">None</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="app">Authenticator App</option>
        </select>
      </div>

      <!-- تایمر دوعاملی -->
      <div v-if="twoFactorMethod !== 'none'">
        <p class="mt-2 text-sm text-gray-700">
          تایید دوعاملی در {{ timer }} ثانیه منقضی می‌شود
        </p>
        <button
            type="button"
            @click="startTimer"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ارسال کد
        </button>
      </div>

      <!-- دکمه ورود -->
      <div>
        <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ورود
        </button>
      </div>
    </form>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Header from "~/components/form/Header.vue";
import Footer from "~/components/form/Footer.vue";
import { useApi } from "~/composables/useApi";

// وضعیت فیلدهای ورودی
const username = ref("");
const password = ref("");
const securityPhrase = ref("");
const twoFactorMethod = ref("none");

// تایمر
const timer = ref(0);
let timerInterval;

// استفاده از API
const { login, sendOtpForLogin } = useApi();

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

    // ارسال درخواست OTP
    sendOtpForLogin({
      username: username.value,
      password: password.value,
      otpStrategyTypeId: getOtpStrategyId(twoFactorMethod.value),
    });
  }
};

// دریافت شناسه استراتژی OTP
const getOtpStrategyId = (method) => {
  switch (method) {
    case "sms":
      return 1;
    case "email":
      return 2;
    case "app":
      return 3;
    default:
      return null;
  }
};

// هندل کردن ورود
const handleLogin = async () => {
  try {
    await login({
      username: username.value,
      password: password.value,
      otpStrategyTypeId: getOtpStrategyId(twoFactorMethod.value),
      otpCode: securityPhrase.value,
    });
    // اینجا می‌توانید هدایت به صفحه بعدی یا نمایش پیام موفقیت را انجام دهید
  } catch (error) {
    console.error("Login failed:", error);
  }
};

definePageMeta({
  layout: "default", // layout شما مشخص می‌شود
});
</script>

<style scoped>
/* استایل‌های صفحه */
</style>
