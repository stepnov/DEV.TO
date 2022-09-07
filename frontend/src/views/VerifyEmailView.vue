<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { useRoute } from 'vue-router';

  const authStore = useAuthStore()
  const route = useRoute();
  authStore.verifyEmail(route.query.token);
</script>
