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
        <div class="captcha-wrapper">
          <p class="captcha-text">{{ captcha }}</p>
          <button
            type="button"
            @click="generateCaptcha"
            class="refresh-captcha"
          >
            <span class="refresh-icon">🔄</span>
            <span>تغییر کپچا</span>
          </button>
        </div>
        <input
            id="captchaInput"
            v-model="captchaInput"
            type="text"
            required
            class="input-field"
            placeholder="کد امنیتی را وارد کنید"
            dir="ltr"
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
            :disabled="isLoading"
        >
          {{ isLoading ? 'در حال ورود...' : 'ورود' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { createAuthService } from '../../services/auth/authService';
import { navigateTo } from '#imports';
import { BASE_URL } from '@/utils/constants';

const { $auth } = useNuxtApp();
const router = useRouter();
const authService = createAuthService(BASE_URL);

const username = ref("");
const password = ref("");
const captcha = ref("");
const captchaInput = ref("");
const securityPhrase = ref("");
const twoFactorMethod = ref("none");
const otpStrategies = ref([]);
const errorMessage = ref("");
const isLoading = ref(false);

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

  captchaInput.value = "";
  // generate new captcha
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captcha.value = result;
};

const verifyCaptcha = () => {
  return captchaInput.value.trim().toUpperCase() === captcha.value;
};

const getOtpStrategyId = (method) => {
  // Convert object to array if needed
  const strategies = Array.isArray(otpStrategies.value) 
    ? otpStrategies.value 
    : Object.entries(otpStrategies.value).map(([id, title]) => ({ id: parseInt(id), title }));

  const strategy = strategies.find(
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
      const strategyId = getOtpStrategyId(twoFactorMethod.value);
      if (!strategyId) {
        errorMessage.value = "خطا در دریافت استراتژی OTP";
        return;
      }

      await $auth.sendOtpForLogin({
        username: username.value,
        password: password.value,
        otpStrategyTypeId: strategyId,
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      errorMessage.value = parseErrorResponse(error);
    }
  }
};

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    if (!verifyCaptcha()) {
      errorMessage.value = "کپچا نادرست است.";
      return;
    }

    const strategyId = getOtpStrategyId(twoFactorMethod.value);
    if (twoFactorMethod.value !== "none" && !strategyId) {
      errorMessage.value = "خطا در دریافت استراتژی OTP";
      return;
    }

    const loginData = {
      username: username.value,
      password: password.value,
      otpStrategyTypeId: strategyId,
      otpCode: securityPhrase.value
    };

    const response = await authService.login(loginData);
    
    if (response) {
      // Redirect to main dashboard page
      try {
        await router.push('/dashboard');
      } catch {
        try {
          await navigateTo('/dashboard');
        } catch {
          window.location.replace('/dashboard');
        }
      }
    }
  } catch (error) {
    errorMessage.value = parseErrorResponse(error);
  } finally {
    isLoading.value = false;
  }
};

const parseErrorResponse = (error) => {
  if (error.response && error.response.data) {
    const errorData = error.response.data;
    if (errorData.message) {
      return errorData.message;
    }
    if (errorData.error) {
      return errorData.error;
    }
  }
  return "خطا در ورود به سیستم";
};

const handleLogout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

definePageMeta({
  layout: "default",
});
</script>

<style scoped>
.captcha-container {
  margin-top: 1rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.captcha-text {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
  min-width: 150px;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.refresh-captcha {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.refresh-captcha:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.refresh-icon {
  font-size: 1.25rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
}

.input-field:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}
</style>
