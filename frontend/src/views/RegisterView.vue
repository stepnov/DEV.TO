<script setup>
import { reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import {
  mdiGoogle ,
  mdiFacebook,
} from "@mdi/js";
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
  pass: '',
  confirmPass: '',
})

const authStore = useAuthStore()

const notification = computed(() => authStore.notify)

const router = useRouter()

const submit = () => {
  let email = form.email;
  let password = form.pass;
  authStore.register({email, password})
}

watch(() => notification.value.showNotification, (newValue, oldValue) => {
  if (newValue) {
    notify({
      title: "Registration",
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
          name="Email"
          autocomplete="email"
        />
      </FormField>

      <FormField
        label="Password"
        help="Please enter your password"
      >
        <FormControl
          v-model="form.pass"
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
        />
      </FormField>

      <FormField
        label="Confirm"
        help="Please confirm your password"
      >
        <FormControl
          v-model="form.confirmPass"
          :icon="mdiAsterisk"
          type="password"
          name="confirmPassword"
        />
      </FormField>

      <BaseDivider/>

      <BaseButtons>
        <BaseButton
          type="submit"
          color="info"
          label="Register"
        />
        <BaseButton
          to="/login"
          color="info"
          outline
          label="Login"
        />
      </BaseButtons>
    </CardBox>
  </SectionFullScreen>
</template>
