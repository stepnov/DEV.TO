<script setup>
import BaseIcon from '@/components/BaseIcon.vue';
import { mdiCog } from '@mdi/js';
import { computed, ref } from 'vue';
import FormCheckRadioPicker from '@/components/FormCheckRadioPicker.vue';
import { useStyleStore } from '@/stores/style';

const styleStore = useStyleStore();

const open = ref(false);
const theme = computed(() => styleStore.theme);
</script>
<template>
  <div class="helper-container fixed transition ease-in-out duration-300 z-40" :class="{open: open}">
    <div
      @click="open = !open"
      class="tab absolute bg-pavitra-900 flex justify-center items-center rounded-l-full w-14 h-14 transition ease-in-out duration-300">
      <BaseIcon :path="mdiCog" class="icon text-white transition ease-in-out duration-300" size="24"/>
    </div>
    <div class="helper-content p-6 bg-white shadow-sm rounded-bl-xl flex flex-col items-center">
      <p class="mb-3">Switch colors</p>
      <FormCheckRadioPicker
        :model-value="theme"
        @change="styleStore.setTheme($event.target.value)"
        name="theme"
        type="radio"
        :options="{'default': '', 'pink': '', 'green': ''}"
      ></FormCheckRadioPicker>
    </div>
  </div>
</template>
