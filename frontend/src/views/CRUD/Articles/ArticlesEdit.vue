<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { notify } from "@kyvg/vue3-notification";
import Editor from '@tinymce/tinymce-vue';
import dataFormatter from '@/helpers/dataFormatter';

const router = useRouter();
const route = useRoute();
const articlesStore = useArticlesStore()

const titleStack = ref(['Admin', 'Articles'])
const notification = computed(() => articlesStore.notify)

        const optionsAuthor = computed(() => articlesStore.searchResultAuthor);

        const optionsCategory = computed(() => articlesStore.searchResultCategory);

        const optionsTags = computed(() => articlesStore.searchResultTags);

const form = reactive({

    title: '',

    body: [''],

      author: '',

      category: '',

      tags: [],

      featured: false,

      images: [],

})

const articlesItem = computed(() => articlesStore.data);

const submit = async () => {
  try {

            form.author = form.author?.id;

            form.category = form.category?.id;

            form.tags = form.tags.map(item => item.id);

    await articlesStore.edit({id: route.params.id, data: {...form} })
    router.push('/articles');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

  await searchAuthor();

  await searchCategory();

  await searchTags();

    await articlesStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    articlesStore.showNotification(e, 'error');
  }
})

    async function searchAuthor(val) {
      await articlesStore.searchAuthor(val);
    }

    async function searchCategory(val) {
      await articlesStore.searchCategory(val);
    }

    async function searchTags(val) {
      await articlesStore.searchTags(val);
    }

const formatData = () => {

    form.title = articlesItem.value.title

    form.body = articlesItem.value.body

    form.author = dataFormatter.usersOneListFormatterEdit(articlesItem.value.author)

    form.category = dataFormatter.categoriesOneListFormatterEdit(articlesItem.value.category)

    form.tags = dataFormatter.tagsManyListFormatterEdit(articlesItem.value.tags)

    form.images = articlesItem.value.images

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

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/articles')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Articles</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Articles"
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
