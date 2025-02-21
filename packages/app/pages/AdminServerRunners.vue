<script setup lang="ts">
definePageMeta({
  name: 'AdminServerRunners',
  path: '/admin/runners',
  middleware: 'redirect-when-guest',
})

const runners = useThreadRunners()

onMounted(async() => {
  await runners.refresh()
})
</script>

<template>
  <AdminLayout>
    <AdminServerRunners
      :runners="runners.data.value"
      @submit-claim="(address) => runners.claim(address)"
      @submit-release="(runner) => runners.release(runner)"
      @subscribe="(runner) => runners.subscribe(runner)"
      @unsubscribe="(runner) => runners.unsubscribe(runner)"
    />
  </AdminLayout>
</template>
