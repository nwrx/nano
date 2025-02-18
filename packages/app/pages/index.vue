<script setup lang="ts">
// load https://meme-api.com/gimme and display the first meme

const url = ref()
onMounted(async() => {
  const response = await fetch('https://meme-api.com/gimme')
  const data = await response.json() as { preview: string[] }
  url.value = data.preview.pop()
})
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <img :src="url" class="b-white rd overflow-hidden w-128 op-50">
  </div>
</template>
