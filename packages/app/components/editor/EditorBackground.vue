<script setup lang="ts">
import PATTERN_EDITOR_URL from '~/assets/pattern-editor.svg?no-inline'
</script>

<template>
  <div
    class="absolute top-0 left-0 right-0 bottom-0 dark:op-10 op-20 dark:invert"
    :style="{
      backgroundImage: `url('${PATTERN_EDITOR_URL}')`,
      backgroundSize: '60px',
      backgroundRepeat: 'repeat',
    }"
  />
</template>
