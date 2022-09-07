<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useArticlesStore } from "@/stores/Articles/articles";
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

const articlesStore = useArticlesStore()
const router = useRouter();

const notification = computed(() => articlesStore.notify)
const titleStack = ref(['Admin', 'Articles'])

        const optionsAuthor = computed(() => articlesStore.searchResultAuthor);

        const optionsCategory = computed(() => articlesStore.searchResultCategory);

        const optionsTags = computed(() => articlesStore.searchResultTags);

const form = reactive({

      title: '',

    body: '',

      author: '',

      category: '',

      tags: [],

      featured: false,

      images: [],

})

onBeforeMount(async () => {

  await searchAuthor();

  await searchCategory();

  await searchTags();

})

const submit = async () => {
  try {

            form.author = form.author.id;

            form.category = form.category.id;

            form.tags = form.tags.map(item => item.id);

    await articlesStore.newItem({ ...form })
    router.push('/articles');
  } catch (e) {
    console.log(e);
  }
}

const reset = () => {

        form.title = '';

      form.body = '';

        form.author = '';

        form.category = '';

        form.tags = [];

        form.featured = false;

        form.images = [];

}

const cancel = () => {
  router.push('/users')
}

    async function searchAuthor(val) {
      await articlesStore.searchAuthor(val);
    }

    async function searchCategory(val) {
      await articlesStore.searchCategory(val);
    }

    async function searchTags(val) {
      await articlesStore.searchTags(val);
    }

watch(() => articlesStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Articles notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    articlesStore.hideNotification()
  }
});

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>New Articles</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="New Articles"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Title"
    >
      <FormControl
        v-model="form.title"
        placeholder="Your Title"
      />
    </FormField>

    <FormField
      label="Body"
    >
      <FormControl
        v-model="form.body"
        type="textarea"
        placeholder="Your Body"
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
      label="Category"
    >
        <v-select
          v-model="form.category"
          :options="optionsCategory"
          @input="searchCategory($event.target.value)"
        />
  </FormField>

    <FormField
        label="Tags"
      >
        <v-select
          v-model="form.tags"
          :options="optionsTags"
          multiple
          @input="searchTags($event.target.value)"
        />
    </FormField>

    <FormField label="Featured">
      <FormCheckRadioPicker
        v-model="form.featured"
        name="sample-switch"
        type="switch"
        :options="{ featured: form.featured ? 'Enabled' : 'Disabled' }"
      />
    </FormField>

    <FormField
      label="Images"
    >
      <FormFilePicker v-model="form.images" url="articles/images"/>
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
