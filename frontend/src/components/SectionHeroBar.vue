<script setup>
import BaseLevel from '@/components/BaseLevel.vue'

</script>

<template>
  <section
    class="bg-transparent font-bold px-12 pb-4 pt-0"
  >
    <BaseLevel>
      <h1 class="text-3xl font-semibold leading-tight text-pavitra-900">
        <slot />
      </h1>
    </BaseLevel>
  </section>
</template>
