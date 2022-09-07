<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsStore } from "@/stores/Tags/tags";
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
const tagsStore = useTagsStore()

const titleStack = ref(['Admin', 'Tags'])
const notification = computed(() => tagsStore.notify)

const form = reactive({

    name: '',

})

const tagsItem = computed(() => tagsStore.data);

const submit = async () => {
  try {

    await tagsStore.edit({id: route.params.id, data: {...form} })
    router.push('/tags');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

    await tagsStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    tagsStore.showNotification(e, 'error');
  }
})

const formatData = () => {

    form.name = tagsItem.value.name

}

watch(() => tagsStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Tags notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    tagsStore.hideNotification()
  }
});

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/tags')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Tags</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Tags"
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
