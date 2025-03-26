<template>
  <div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Heading -->
      <!--      <h2 class="text-2xl font-iranSans text-center mb-4">صندوق درآمد ثابت</h2>-->
      <!--      <p class="text-gray-700 text-center mb-8">سلام.</p>-->

      <!-- Image Section -->
      <div class="mb-8">
        <img
            src="~/assets/images/main-image.jpg"
            alt="صندوق درآمد ثابت"
            class="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>

      <!-- Slideshow Section (Vue3 Carousel) -->
      <div class="mb-8">
        <Carousel :items-to-show="1" :autoplay="3000" :wrap-around="true">
          <Slide v-for="(slide, index) in slides" :key="index">
            <img
                :src="slide.image"
                :alt="slide.alt"
                class="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </Slide>
        </Carousel>
      </div>

      <!-- Button Section -->
      <div class="text-center">
        <NuxtLink to="/auth/login">
          <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            ورود به صندوق
          </button>
        </NuxtLink>
      </div>
    </div>

  </div>

</template>

<script setup>
import {Carousel, Slide} from "vue3-carousel";
import "vue3-carousel/dist/carousel.css"; // استایل‌های مورد نیاز

// ایمپورت تصاویر
import slide1 from "~/assets/images/slide1.jpg";
import slide2 from "~/assets/images/slide2.jpg";

// داده‌های اسلایدشو
const slides = [
  {image: slide1, alt: "اسلاید ۱"},
  {image: slide2, alt: "اسلاید ۲"}
];


definePageMeta({
  layout: 'default',
  showSidebar: false
});

</script>

<style scoped>
h2 {
  color: #1e40af;
}

/* Custom styles for the carousel */
.VueCarousel {
  border-radius: 0.5rem;
  overflow: hidden;
}

.VueCarousel-pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>