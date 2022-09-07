<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoriesStore } from "@/stores/Categories/categories";
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleBar from '@/components/SectionTitleBar.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioPicker from '@/components/FormCheckRadioPicker.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import SectionHeroBar from '@/components/SectionHeroBar.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { notify } from "@kyvg/vue3-notification";
import Editor from '@tinymce/tinymce-vue';
import dataFormatter from '@/helpers/dataFormatter';

const router = useRouter();
const route = useRoute();
const categoriesStore = useCategoriesStore()

const titleStack = ref(['Admin', 'Categories'])
const notification = computed(() => categoriesStore.notify)

const form = reactive({

    name: '',

})

const categoriesItem = computed(() => categoriesStore.data);

const submit = async () => {
  try {

    await categoriesStore.edit({id: route.params.id, data: {...form} })
    router.push('/categories');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

    await categoriesStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    categoriesStore.showNotification(e, 'error');
  }
})

const formatData = () => {

    form.name = categoriesItem.value.name

}

watch(() => categoriesStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Categories notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    categoriesStore.hideNotification()
  }
});

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/categories')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Categories</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Categories"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Name"
    >
      <FormControl
        v-model="form.name"
        placeholder="Your Name"
        />
    </FormField>

    <BaseDivider />

    <BaseButtons>
      <BaseButton
        type="submit"
        color="info"
        label="Submit"
      />
      <BaseButton
        type="button"
        color="info"
        outline
        label="Reset"
        @click="reset"
      />
      <BaseButton
        type="cancel"
        color="danger"
        outline
        label="Cancel"
        @click="cancel"
      />
    </BaseButtons>
  </CardBox>
</SectionMain>

</template>
