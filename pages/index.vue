<template>
  <div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Heading -->
      <!--      <h2 class="text-2xl font-iranSans text-center mb-4">صندوق درآمد ثابت</h2>-->
      <!--      <p class="text-gray-700 text-center mb-8">سلام.</p>-->

      <!-- Image Section -->
      <!-- <div class="mb-8"> -->
        <!-- <img -->
            <!-- src="~/assets/images/main-image.jpg" -->
            <!-- alt="صندوق درآمد ثابت" -->
            <!-- class="w-full h-64 object-cover rounded-lg shadow-md" -->
        <!-- /> -->
      <!-- </div> -->

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

      <div class="flex flex-wrap gap-4 justify-center my-8">
        <div
          v-for="box in infoBoxes"
          :key="box.key"
          class="bg-blue-600 text-white rounded-lg shadow-md p-4 min-w-[220px] flex flex-col items-center"
        >
          <div class="text-base font-bold mb-1">{{ box.title }}</div>
          <div class="text-xl font-mono mb-2">{{ box.value }}</div>
          <button
            class="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            @click="fetchBoxData(box.key)"
          >
            بروزرسانی
          </button>
        </div>
      </div>

    </div>

  </div>

</template>

<script setup>
import {Carousel, Slide} from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import slide1 from "~/assets/images/slide1.jpg";
import slide2 from "~/assets/images/slide2.jpg";

const slides = [
  {image: slide1, alt: "اسلاید ۱"},
  {image: slide2, alt: "اسلاید ۲"}
];

const infoBoxes = ref([
  { key: 'investmentDate', title: 'اطلاعات سرمایه گذاری به تاریخ', value: '۱۴۰۳/۰۴/۲۷' },
  { key: 'nav', title: 'کل خالص ارزش دارایی ها', value: '۷۲,۰۶۰,۸۷۸,۳۴۶,۲۴۰ ریال' },
  { key: 'unitRevokePrice', title: 'قیمت ابطال هر واحد سرمایه گذاری', value: '۱۰,۶۶۰,۶۵ ریال' },
  { key: 'unitIssuePrice' , title: 'قیمت صدور هر واحد سرمایه گذاری' , value: '۱۰,۶۶۰,۶۵ ریال'}

])

function fetchBoxData(key) {

  alert(`فراخوانی سرویس برای: ${key}`)
}

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