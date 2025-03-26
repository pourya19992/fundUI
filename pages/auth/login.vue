<template>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { authService } from '~/services/authService';

const router = useRouter();

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

onMounted(async () => {
  try {
    const strategies = await authService.getOtpStrategies();
    otpStrategies.value = strategies;
    generateCaptcha();
  } catch (error) {
    console.error("Failed to fetch OTP strategies:", error);
  }
});

const generateCaptcha = () => {
  captcha.value = Math.random().toString(36).substring(2, 8).toUpperCase();
};

const verifyCaptcha = () => {
  return captchaInput.value.trim().toUpperCase() === captcha.value;
};

const getOtpStrategyId = (method) => {
  const strategy = otpStrategies.value.find(
      (strategy) => strategy.title === method
  );
  return strategy ? strategy.id : null;
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
      await authService.sendOtpForLogin({
        username: username.value,
        password: password.value,
        otpStrategyTypeId: getOtpStrategyId(twoFactorMethod.value),
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      errorMessage.value = parseErrorResponse(error);
    }
  }
};

const handleLogin = async () => {
  try {
    if (!verifyCaptcha()) {
      errorMessage.value = "کپچا نادرست است.";
      return;
    }

    const response = await authService.login({
      username: username.value,
      password: password.value,
      otpStrategyTypeId: getOtpStrategyId(twoFactorMethod.value),
      otpCode: securityPhrase.value,
    });
    
    if (response.token) {
      authService.setAuthToken(response.token);
      await router.push('/dashboard');
    }
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value = parseErrorResponse(error);
  }
};

const parseErrorResponse = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return "خطا در ورود به سیستم";
};

definePageMeta({
  layout: "default",
});
</script>

<style scoped>
.captcha-container {
  margin-top: 1rem;
}

.captcha-text {
  font-family: monospace;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.refresh-captcha {
  background-color: transparent;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.25rem;
  margin-bottom: 0.5rem;
  display: block;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
}

.input-field:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
}
</style>
