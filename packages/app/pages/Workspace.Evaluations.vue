<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import Pattern from '~/components/base/Pattern.vue'

definePageMeta({
  name: 'WorkspaceEvaluations',
  path: '/:workspace/evaluations',
  middleware: 'redirect-when-guest',
  layout: 'workspace',
  icon: 'i-carbon:checkmark-outline',
  groups: ['nav-items-workspace'],
  title: {
    en: 'Evaluations',
    fr: 'Évaluations',
    de: 'Bewertungen',
    es: 'Evaluaciones',
    zh: '评估',
  },
  description: {
    en: 'Evaluate and analyze flows',
    fr: 'Évaluez et analysez les flux',
    de: 'Bewerten und analysieren Sie Flows',
    es: 'Evalúe y analice flujos',
    zh: '评估和分析流程',
  },
  isWorkInProgress: true,
})
</script>

<template>
  <AppPageContainer contained>
    <Pattern class="h-full" />
  </AppPageContainer>
</template>
