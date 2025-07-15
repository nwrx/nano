<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'
import InputList from '~/components/base/InputList.vue'

// --- Props.
const props = defineProps<{ multiple?: boolean }>()

// --- Model.
const { t } = useI18n()
const search = ref('')
const client = useClient()
const model = defineModel<string>({ required: false })
const users = ref([]) as Ref<UserObject[]>
const placeholder = computed(() => (props.multiple ? t('hintMultiple') : t('hintSingle')))

// --- Methods.
async function searchUsers() {
  await client.requestAttempt('GET /api/users', {
    query: {
      search: search.value,
      withProfile: true,
    },
    onData: (data) => {
      users.value = data
    },
  })
}

function getUserAvatarUrl(username: string) {
  const apiUrl = useRuntimeConfig().public.apiUrl
  const avatarUrl = `/api/users/${username}/avatar`
  return apiUrl ? new URL(avatarUrl, apiUrl).href : avatarUrl
}

watch(search, searchUsers, { immediate: true })
</script>

<template>
  <InputList
    v-model="model"
    v-model:search="search"
    icon="i-carbon:user"
    class-option-text="text-muted"
    class-option-label="font-medium"
    :placeholder="placeholder"
    :multiple="multiple"
    :options="users"
    :option-image="(option) => getUserAvatarUrl(option.username)"
    :option-value="(option) => option.username"
    :option-label="(option) => option.displayName || option.username"
    :option-text="(option) => option.username"
    @focus="() => searchUsers()"
  />
</template>

<i18n lang="yaml">
en:
  hintSingle: Search users
  hintMultiple: Search multiple users
fr:
  hintSingle: Rechercher des utilisateurs
  hintMultiple: Rechercher plusieurs utilisateurs
de:
  hintSingle: Nach Benutzern suchen
  hintMultiple: Nach mehreren Benutzern suchen
es:
  hintSingle: Buscar usuarios
  hintMultiple: Buscar varios usuarios
zh:
  hintSingle: 搜索用户
  hintMultiple: 搜索多个用户
</i18n>
