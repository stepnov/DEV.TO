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
  password: '',
  confirm: '',
})

const authStore = useAuthStore()

const notification = computed(() => authStore.notify)

const router = useRouter()
const route = useRoute();

const submit = () => {
  let password = form.password;
  let token = route.query.token;
  authStore.resetPassword({password, token})
}

watch(() => notification.value.showNotification, (newValue, oldValue) => {
  if (newValue) {
    notify({
      title: "Reset",
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
        label="Password"
        help="Please enter your password"
      >
        <FormControl
          v-model="form.password"
          :icon="mdiAsterisk"
          name="password"
          type="password"
        />
      </FormField>
      <FormField
        label="Confirm"
        help="Please confirm your password"
      >
        <FormControl
          v-model="form.confirm"
          :icon="mdiAsterisk"
          name="confirm"
          type="password"
        />
      </FormField>

      <BaseDivider/>

      <BaseButtons>
        <BaseButton
          type="submit"
          color="info"
          label="Reset"
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
