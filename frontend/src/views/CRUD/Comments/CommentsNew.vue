<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useCommentsStore } from "@/stores/Comments/comments";
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
import Editor from '@tinymce/tinymce-vue'
import { notify } from "@kyvg/vue3-notification";

const commentsStore = useCommentsStore()
const router = useRouter();

const notification = computed(() => commentsStore.notify)
const titleStack = ref(['Admin', 'Comments'])

        const optionsAuthor = computed(() => commentsStore.searchResultAuthor);

        const optionsArticle = computed(() => commentsStore.searchResultArticle);

const form = reactive({

    text: '',

      author: '',

      article: '',

      moderated: false,

})

onBeforeMount(async () => {

  await searchAuthor();

  await searchArticle();

})

const submit = async () => {
  try {

            form.author = form.author.id;

            form.article = form.article.id;

    await commentsStore.newItem({ ...form })
    router.push('/comments');
  } catch (e) {
    console.log(e);
  }
}

const reset = () => {

      form.text = '';

        form.author = '';

        form.article = '';

        form.moderated = false;

}

const cancel = () => {
  router.push('/users')
}

    async function searchAuthor(val) {
      await commentsStore.searchAuthor(val);
    }

    async function searchArticle(val) {
      await commentsStore.searchArticle(val);
    }

watch(() => commentsStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Comments notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    commentsStore.hideNotification()
  }
});

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>New Comments</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="New Comments"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Text"
    >
      <FormControl
        v-model="form.text"
        type="textarea"
        placeholder="Your Text"
        />
    </FormField>

  <FormField
      label="Author"
    >
        <v-select
          v-model="form.author"
          :options="optionsAuthor"
          @input="searchAuthor($event.target.value)"
        />
  </FormField>

  <FormField
      label="Article"
    >
        <v-select
          v-model="form.article"
          :options="optionsArticle"
          @input="searchArticle($event.target.value)"
        />
  </FormField>

    <FormField label="Moderated">
      <FormCheckRadioPicker
        v-model="form.moderated"
        name="sample-switch"
        type="switch"
        :options="{ moderated: form.moderated ? 'Enabled' : 'Disabled' }"
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
        type="reset"
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
