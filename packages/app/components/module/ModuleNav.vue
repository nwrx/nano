<script setup lang="ts">
const categories = [... new Set(MODULES_MOCK.flatMap(module => module.categories))].sort()
const industries = [... new Set(MODULES_MOCK.flatMap(module => module.industries))].sort()
</script>

<template>
  <AppPageNav>
    <AppPageNavGroup label="Featured">
      <AppPageNavItem compact label="Trending" />
      <AppPageNavItem compact label="Recently updated" />
      <AppPageNavItem compact label="Recently added" />
    </AppPageNavGroup>

    <AppPageNavGroup label="Categories">
      <AppPageNavItem compact label="Built by Nanoworks" />
      <AppPageNavItem v-for="category in categories" :key="category" compact :label="category" />
    </AppPageNavGroup>

    <AppPageNavGroup label="Industries">
      <AppPageNavItem v-for="industry in industries" :key="industry" compact :label="industry" />
    </AppPageNavGroup>
  </AppPageNav>
</template>
