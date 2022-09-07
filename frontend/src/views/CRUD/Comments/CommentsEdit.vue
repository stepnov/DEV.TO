<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { notify } from "@kyvg/vue3-notification";
import Editor from '@tinymce/tinymce-vue';
import dataFormatter from '@/helpers/dataFormatter';

const router = useRouter();
const route = useRoute();
const commentsStore = useCommentsStore()

const titleStack = ref(['Admin', 'Comments'])
const notification = computed(() => commentsStore.notify)

        const optionsAuthor = computed(() => commentsStore.searchResultAuthor);

        const optionsArticle = computed(() => commentsStore.searchResultArticle);

const form = reactive({

    text: [''],

      author: '',

      article: '',

      moderated: false,

})

const commentsItem = computed(() => commentsStore.data);

const submit = async () => {
  try {

            form.author = form.author?.id;

            form.article = form.article?.id;

    await commentsStore.edit({id: route.params.id, data: {...form} })
    router.push('/comments');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

  await searchAuthor();

  await searchArticle();

    await commentsStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    commentsStore.showNotification(e, 'error');
  }
})

    async function searchAuthor(val) {
      await commentsStore.searchAuthor(val);
    }

    async function searchArticle(val) {
      await commentsStore.searchArticle(val);
    }

const formatData = () => {

    form.text = commentsItem.value.text

    form.author = dataFormatter.usersOneListFormatterEdit(commentsItem.value.author)

    form.article = dataFormatter.articlesOneListFormatterEdit(commentsItem.value.article)

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

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/comments')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Comments</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Comments"
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
