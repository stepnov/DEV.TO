<script setup>
import { reactive, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioPicker from '@/components/FormCheckRadioPicker.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { notify } from "@kyvg/vue3-notification";

const form = reactive({
  email: '',
})

const authStore = useAuthStore()

const notification = computed(() => authStore.notify)

const router = useRouter()

const submit = async () => {
  let email = form.email;
  await authStore.forgotPassword(email)
}

watch(() => notification.value.showNotification, (newValue, oldValue) => {
  if (newValue) {
    notify({
      title: "Forgot",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
  }
});

</script>

<template>
  <SectionFullScreen
    v-slot="{ cardClass, cardRounded }"
    bg="login"
  >
    <CardBox
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <FormField
        label="Email"
        help="Please enter your email"
      >
        <FormControl
          v-model="form.email"
          :icon="mdiAccount"
          name="email"
          type="email"
        />
      </FormField>

      <BaseDivider/>

        <BaseButtons noWrap>
          <BaseButton
            class="w-full"
            type="submit"
            color="info"
            label="Submit"
          />
          <BaseButton
            class="w-full"
            to="/login"
            color="info"
            outline
            label="Login"
          />
        </BaseButtons>
    </CardBox>
  </SectionFullScreen>
</template>
