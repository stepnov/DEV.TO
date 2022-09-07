<script setup>
import { computed, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout.js'
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import { useAuthStore } from '@/stores/auth';
import HelperComponent from '@/components/HelperComponent.vue';

const layoutStore = useLayoutStore()


const isAsideLgActive = computed(() => layoutStore.isAsideLgActive)

const authStore = useAuthStore();

onBeforeMount(async () => {
  await authStore.doInit();
})

const overlayClick = () => {
  layoutStore.asideLgToggle(false)
}
</script>

<template>
  <NavBar />
  <AsideMenu :menu="menu" />
  <HelperComponent/>
  <RouterView />
  <FooterBar />
  <notifications
    position="bottom center"
  />
  <OverlayLayer
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
