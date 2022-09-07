<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from "@/stores/Users/users";
import { mdiBallot, mdiBallotOutline, mdiAccount, mdiMail } from '@mdi/js'
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
import dataFormatter from '@/helpers/dataFormatter';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const usersStore = useUsersStore()
const authStore = useAuthStore();

const titleStack = ref(['User', 'Profile'])
const notification = computed(() => usersStore.notify)

const form = reactive({

      firstName: '',

      lastName: '',

      phoneNumber: '',

      email: '',

      role: false,

      disabled: false,

      avatar: [],

})

const usersItem = computed(() => usersStore.data);

const submit = async () => {
  try {

    await usersStore.edit({id: form.id, data: {...form} })
    let currentUser = await authStore.findMe();
    authStore.setUser(currentUser);
    router.push('/users');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

    const { user } = JSON.parse(localStorage.getItem('user'))
    const id = user.id

    if (id) {
      form.id = id;
      await usersStore.fetch(id)
      formatData()
    }
  } catch (e) {
    console.log(e)
    usersStore.showNotification(e, 'error');
  }
})

const formatData = () => {

    form.firstName = usersItem.value.firstName

    form.lastName = usersItem.value.lastName

    form.phoneNumber = usersItem.value.phoneNumber

    form.email = usersItem.value.email

    form.role = usersItem.value.role

    form.avatar = usersItem.value.avatar

form.password = usersItem.value.password

}

watch(() => usersStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Users notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    usersStore.hideNotification()
  }
});

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/users')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Profile</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Profile"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="First Name"
    >
      <FormControl
        v-model="form.firstName"
        placeholder="Your First Name"
      />
    </FormField>

    <FormField
      label="Last Name"
    >
      <FormControl
        v-model="form.lastName"
        placeholder="Your Last Name"
      />
    </FormField>

    <FormField
      label="Phone Number"
    >
      <FormControl
        v-model="form.phoneNumber"
        placeholder="Your Phone Number"
      />
    </FormField>

    <FormField
      label="Role"
      wrap-body
    >
      <FormCheckRadioPicker
        v-model="form.role"
        name="role"
        type="radio"

        :options="{ 'admin': 'admin', 'user': 'user', }"

      />
    </FormField>

    <FormField label="Disabled">
      <FormCheckRadioPicker
        v-model="form.disabled"
        name="sample-switch"
        type="switch"
        :options="{ disabled: form.disabled ? 'Enabled' : 'Disabled' }"
      />
    </FormField>

      <FormField
        label="Avatar"
      >
        <FormFilePicker v-model="form.avatar" url="users/avatar"/>
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
