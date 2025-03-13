<template>
  <Header/>
  <div class="w-full max-w-md mx-auto p-4">
    <h2 class="text-2xl font-bold text-center mb-6">ورود به حساب</h2>

    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ errorMessage }}
    </div>

    <!-- login form -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- useer field -->
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

      <!-- password field -->
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

      <!-- captcha -->
      <div class="captcha-container">
        <p class="captcha-text">{{ captcha }}</p>
        <button type="button" @click="generateCaptcha" class="refresh-captcha">
          🔄 تغییر کپچا
        </button>
        <input
            id="captchaInput"
            v-model="captchaInput"
            type="text"
            required
            class="input-field"
            placeholder="کد امنیتی را وارد کنید"
        />
      </div>

      <!-- twoFactor method -->
      <div>
        <label for="twoFactor">نحوه ورود</label>
        <select
            v-model="twoFactorMethod"
            id="twoFactor"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="(title, id) in otpStrategies" :key="id" :value="title">
            {{ title }}
          </option>
        </select>
      </div>

      <!-- twoFactor timer -->
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

      <!-- button login -->
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
  <Footer/>
</template>

<script setup>
import {ref} from "vue";
import Header from "~/components/form/Header.vue";
import Footer from "~/components/form/Footer.vue";
import axios from "axios";

const apiClient = axios.create({
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    "X-TenantId": "90001",
  },
});


const username = ref("");
const password = ref("");
const captcha = ref("");
const captchaInput = ref("");
const securityPhrase = ref("");
const twoFactorMethod = ref("none");
const otpStrategies = ref([]);
const errorMessage = ref("");


const timer = ref(0);
let timerInterval;

const apiBase = useRuntimeConfig().public.apiBase;

onMounted(async () => {
  try {
    const response = await apiClient.get(`${apiBase}/getOtpStrategies`);
    otpStrategies.value = response.data;
    generateCaptcha();
  } catch (error) {
    console.error("Failed to fetch OTP strategies:", error);
  }
});

const generateCaptcha = () => {
  captcha.value = Math.random().toString(36).substring(2, 8).toUpperCase();
};

const verifyCaptcha = () =>{
  return captchaInput.value.trim().toUpperCase() === captcha.value;
};

const startTimer = async () => {
  if (twoFactorMethod.value !== "none") {
    if (!verifyCaptcha()) {
      errorMessage.value = "کپچا نادرست است.";
      return;
    }

    timer.value = 60;
    timerInterval = setInterval(() => {
      if (timer.value > 0) {
        timer.value -= 1;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);


    try {
      await axios.post(`${apiBase}/sendOtpForLogin`, {
        username: username.value,
        password: password.value,
        otpStrategyTypeId: getOtpStrategyId(twoFactorMethod.value),
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      errorMessage.value = parseErrorResponse(error)
    }
  }
};

const getOtpStrategyId = (method) => {
  const strategy = otpStrategies.value.find(
      (strategy) => strategy.title === method
  );
  return strategy ? strategy.id : null;
};


const handleLogin = async () => {
  try {
    const response = await apiClient.post(`${apiBase}/login`, {
      username: username.value,
      password: password.value,
      otpStrategyTypeId: getOtpStrategyId(twoFactorMethod.value),
      otpCode: securityPhrase.value,
    }, {
      headers: {
        "X-TenantId": tenantId,
      },
    });
    console.log("Login successful:", response.data);
    // اینجا می‌توانید هدایت به صفحه بعدی یا نمایش پیام موفقیت را انجام دهید
  } catch (error) {
    console.error("Login failed:", error.response.data);
    errorMessage.value = parseErrorResponse(error)
  }
};

const parseErrorResponse = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return "خطایی رخ داده است. لطفا دوباره تلاش کنید.";
};

definePageMeta({
  layout: "default",
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}

.captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.captcha-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background: #f3f3f3;
  padding: 6px 12px;
  border-radius: 4px;
  display: inline-block;
}

.refresh-captcha {
  background: #f0ad4e;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-captcha:hover {
  background: #ec971f;
}
</style>
