<script setup>
import { ref } from 'vue'
import { mdiAccountMultiple } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import SectionTitleBar from '@/components/SectionTitleBar.vue'
import SectionHeroBar from '@/components/SectionHeroBar.vue'

const titleStack = ref(['Admin', 'Tables'])
</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Tables</SectionHeroBar>



  <SectionMain>

    <CardBox
      class="mb-6"
      title="Entities"
      :icon="mdiAccountMultiple"
      has-table
    >
      <TableSampleClients checkable />
    </CardBox>

  </SectionMain>

</template>
