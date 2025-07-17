<script setup lang="ts">
import AppPageFormEmpty from '~/components/app/AppPageForm.Empty.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpServer } from '~/composables/useMcp'
import Argument from './McpServerFormArguments.Argument.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
onMounted(server.fetchArguments)
</script>

<template>
  <AppPageForm>
    <div class="w-full rd b b-app bg-subtle divide-y divide-app">

      <!-- No Tools -->
      <AppPageFormEmpty
        v-if="server.args.length === 0"
        :title="t('noArgumentsTitle')"
        :text="t('noArgumentsText')"
        icon="i-carbon:code"
      />

      <!-- List of Arguments -->
      <Argument
        v-for="(argument, index) in server.args"
        :key="index"
        :workspace="workspace"
        :pool="pool"
        :server="name"
        :argument="argument"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  noArgumentsTitle: No Arguments
  noArgumentsText: This server has no arguments defined yet. You can add one or more arguments in the section above.
fr:
  noArgumentsTitle: Aucun Argument
  noArgumentsText: Ce serveur n'a pas encore d'arguments définis. Vous pouvez en ajouter un ou plusieurs dans la section ci-dessus.
de:
  noArgumentsTitle: Keine Argumente
  noArgumentsText: Dieser Server hat noch keine Argumente definiert. Sie können ein oder mehrere Argumente im obigen Abschnitt hinzufügen.
es:
  noArgumentsTitle: Sin Argumentos
  noArgumentsText: Este servidor aún no tiene argumentos definidos. Puedes añadir uno o más argumentos en la sección de arriba.
zh:
  noArgumentsTitle: 无参数
  noArgumentsText: 此服务器尚未定义任何参数。您可以在上面的部分添加一个或多个参数。
</i18n>
