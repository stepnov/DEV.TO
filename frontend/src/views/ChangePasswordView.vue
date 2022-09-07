<script setup>
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { mdiLock } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import SectionTitleBar from '@/components/SectionTitleBar.vue'
import SectionHeroBar from '@/components/SectionHeroBar.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'

const titleStack = ref(['Auth', 'Change Password'])
const authStore = useAuthStore();

const form = reactive({
  currentPassword: '',
  newPassword: ''
})

const submit = async () => {
  try {
    const {currentPassword, newPassword} = form;
    await authStore.changePassword({currentPassword, newPassword})
  } catch (e) {
    console.log(e);
  }
}

</script>
<template>
  <SectionTitleBar :title-stack="titleStack"/>
  <SectionHeroBar>Change Password</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Change Password"
      :icon="mdiLock"
      form
      @submit.prevent="submit"
    >

      <FormField
        label="Current Password"
      >
        <FormControl
          v-model="form.currentPassword"
          placeholder="Your Current Password"
          type="password"
        />
      </FormField>

      <FormField
        label="New Password"
      >
        <FormControl
          v-model="form.newPassword"
          placeholder="Your New Password"
          type="password"
        />
      </FormField>

      <BaseDivider/>

      <BaseButtons>
        <BaseButton
          type="submit"
          color="info"
          label="Submit"
        />
      </BaseButtons>
    </CardBox>
  </SectionMain>
</template>
