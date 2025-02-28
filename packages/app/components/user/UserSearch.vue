<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  multiple?: boolean
  search?: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:modelValue': [value: string[]]
}>()

const { t } = useI18n()
const search = useVModel(props, 'search', emit, { passive: true, defaultValue: '' })
const model = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: [] })

const options = computed(() => ({ search: search.value, limit: 5, withProfile: true }))
const { users, getUsers } = useUsers(options)

watch(search, (search) => {
  if (search) void getUsers()
  else users.value = []
})

function handleSelect(username: string) {
  if (model.value.includes(username)) model.value = model.value.filter(u => u !== username)
  else model.value = props.multiple ? [...model.value, username] : [username]
}
</script>

<template>
  <div>
    <!-- Search -->
    <InputText
      v-model="search"
      icon="i-carbon:user"
      :label="t('search.label')"
      class="mb-md"
    />

    <!-- Results -->
    <Collapse :model-value="true">
      <UserCard
        v-for="user in users"
        :key="user.username"
        :display-name="user.displayName"
        :username="user.username"
        @click="() => handleSelect(user.username)"
      />
    </Collapse>
  </div>
</template>

<i18n lang="yaml">
en:
  search.label: Search for a user by name or username
fr:
  search.label: "Rechercher un utilisateur par nom ou nom d'utilisateur"
de:
  search.label: Suche nach einem Benutzer nach Namen oder Benutzernamen
es:
  search.label: Buscar un usuario por nombre o nombre de usuario
zh:
  search.label: 通过姓名或用户名搜索用户
</i18n>
