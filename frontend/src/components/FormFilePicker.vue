<script setup>
import { mdiUpload, mdiDelete, mdiPencil } from '@mdi/js'
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import axios from 'axios';
import { v4 } from 'uuid';
import * as config from '@/config';
import { notify } from '@kyvg/vue3-notification';

const props = defineProps({
  modelValue: {
    type: [Object, File, Array],
    default: null
  },
  label: {
    type: String,
    default: 'Upload'
  },
  icon: {
    type: String,
    default: mdiUpload
  },
  accept: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'info'
  },
  url: {
    type: String,
    default: 'users/avatar'
  }
})

const emit = defineEmits(['update:modelValue'])

const root = ref(null)

const file = ref(props.modelValue)

const modelValueProp = computed(() => props.modelValue)

watch(modelValueProp, value => {
  file.value = value

  if (!value) {
    root.value.input.value = null
  }
})

const upload = async event => {
  const formData = new FormData();
  const files = event.target.files;
  if (!files || !files.length) {
    return;
  }
  let data = files[0];
  const extension = extractExtensionFrom(data.name);


  // Use this as an example for handling file uploads


  const id = v4();
  const privateUrl = `${props.url}/${id}.${extension}`;
  const publicUrl = `${config.baseURLApi}/file/download?privateUrl=${privateUrl}`;
  formData.append('file', data);
  formData.append('filename', `${id}.${extension}`);

  try {
    await axios.post(`/file/upload/${props.url}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    notify({
      title: "Image notification",
      text: 'Image has been uploaded',
      type: 'success',
    })

    file.value[0] = {
      id,
      name: data.name,
      sizeInBytes: data.size,
      privateUrl,
      publicUrl,
      new: true,
    }

  emit('update:modelValue', file.value)

  } catch (e) {
    notify({
      title: "Image notification",
      text: e,
      type: 'warn',
    })
  }
}

function onDelete() {
  file.value = [];
  emit('update:modelValue', file.value);
}

function onUpdate() {
  root.value.click();
}

function extractExtensionFrom(filename) {
  if (!filename) {
    return null;
  }

  const regex = /(?:\.([^.]+))?$/;
  return regex.exec(filename)[1];
}

</script>

<template>
  <div>
    <label class="inline-flex" v-show="!file.length">
      <BaseButton
        as="a"
        :label="label"
        :icon="icon"
        :color="color"
      />
      <input
        ref="root"
        type="file"
        class="absolute top-0 left-0 w-full h-full opacity-0 outline-none cursor-pointer -z-1"
        :accept="accept"
        @input="upload"
      >
    </label>
    <div v-if="file.length" class="w-36 relative">
      <div class="absolute">
        <BaseButton @click="onDelete()"
                    class="p-0 bg-transparent border-0 text-white hover:text-red-500 hover:border-0 hover:bg-transparent"
                    :icon="mdiDelete"/>
        <BaseButton @click="onUpdate()"
                    class="p-0 bg-transparent border-0 text-white hover:text-green-500 hover:border-0 hover:bg-transparent"
                    :icon="mdiPencil"/>
      </div>
      <img class="w-full" :src="file[0].publicUrl" :alt="file[0].name"/>
    </div>
  </div>
</template>
