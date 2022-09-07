<script setup>
import BaseLevel from '@/components/BaseLevel.vue'

defineProps({
  titleStack: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="py-6 px-12">
    <BaseLevel>
      <ul>
        <li
          v-for="(title, index) in titleStack"
          :key="index"
          class="stack-item inline-block pr-2 text-sm text-pavitra-600 dark:text-gray-400 last:pr-0 last:text-pavitra-900"
          >
          {{ title }}
        </li>
      </ul>
    </BaseLevel>
  </section>
</template>
