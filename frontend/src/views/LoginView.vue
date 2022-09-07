<script setup>
import { reactive, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'
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
import JustboilLogo from '@/components/JustboilLogo.vue'
import {
  mdiGoogle ,
  mdiFacebook,
} from "@mdi/js";
import { notify } from "@kyvg/vue3-notification";

const form = reactive({
  login: 'admin@flatlogic.com',
  pass: 'password',
  remember: ['remember']
})

const authStore = useAuthStore()

const notification = computed(() => authStore.notify)

const submit = () => {
  let email = form.login;
  let password = form.pass;
  authStore.loginUser({email, password})
}

watch(() => notification.value.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Authorization",
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
      <JustboilLogo class="mx-auto"/>

      <h2 class="text-center mb-8 font-bold text-xl text-gray-700">Log in</h2>

      <FormField
        label="Username"
      >
        <FormControl
          v-model="form.login"
          :icon="mdiAccount"
          name="login"
          autocomplete="username"
        />
      </FormField>

      <FormField
        label="Password"
      >
        <FormControl
          v-model="form.pass"
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
        />
      </FormField>

      <div class="flex justify-between">
        <FormCheckRadioPicker
          v-model="form.remember"
          name="remember"
          :options="{ remember: 'Remember me' }"
        />

        <RouterLink to="/forgot" class="text-blue-600 text-sm">
          Forgot password?
        </RouterLink>
      </div>

      <div>
        <BaseButton
          class="my-4 mb-6"
          type="submit"
          color="default"
          label="Log In"
          full
        />
        <p class="w-full text-center text-sm text-gray-500">
          Don’t have account yet?
          <RouterLink to="/register" class="text-blue-600">New Account</RouterLink>
        </p>
      </div>
    </CardBox>
  </SectionFullScreen>
</template>
