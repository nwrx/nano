<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useRunners } from '~/composables/useRunner'

const { t } = useI18n()
const runners = useRunners()
const address = ref('')
const token = ref('')
const isOpen = defineModel({ default: false })

// Reset the form fields when the dialog is opened.
watch(isOpen, () => {
  if (isOpen.value) {
    address.value = ''
    token.value = ''
  }
})
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:cloud-service-management"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!address || !token"
    @confirm="() => runners.register({ address, token })">

    <!-- Claim new runner at address -->
    <InputText
      v-model="address"
      :label="t('addressLabel')"
      :placeholder="t('addressPlaceholder')"
      class="mb-md"
    />

    <!-- The token input -->
    <InputText
      v-model="token"
      :label="t('tokenLabel')"
      :placeholder="t('tokenPlaceholder')"
      :hint="t('tokenHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Claim a new runner
  hint: To claim a new runner, you'll need to provide the server's address and access token. The runner server must be running and accessible from this application. Once claimed, this runner will be available to execute flows and tasks across all workspaces.
  confirm: Claim this runner
  cancel: Cancel
  success: Runner claimed successfully
  addressLabel: Address of the runner server
  addressPlaceholder: https://runner-0.acme.com
  tokenLabel: Access Token
  tokenPlaceholder: Enter the access token for the runner server
  tokenHint: Defined via the `RUNNER_TOKEN` environment variable on the runner server.
fr:
  title: Réclamer un nouveau serveur d'exécution
  hint: Pour réclamer un nouveau serveur d'exécution, vous devez fournir l'adresse du serveur et le jeton d'accès. Le serveur d'exécution doit être en cours d'exécution et accessible depuis cette application. Une fois réclamé, ce serveur sera disponible pour exécuter des flux et des tâches dans tous les espaces de travail.
  confirm: Réclamer ce serveur
  cancel: Annuler
  success: Serveur réclamé avec succès
  addressLabel: Adresse du serveur d'exécution
  addressPlaceholder: https://runner-0.acme.com
  tokenLabel: Jeton d'accès
  tokenPlaceholder: Entrez le jeton d'accès pour le serveur d'exécution
  tokenHint: Défini via la variable d'environnement `RUNNER_TOKEN` sur le serveur d'exécution.
de:
  title: Neuen Runner beanspruchen
  hint: Um einen neuen Runner zu beanspruchen, müssen Sie die Serveradresse und das Zugriffstoken angeben. Der Runner-Server muss laufen und von dieser Anwendung aus erreichbar sein. Nach der Beanspruchung steht dieser Runner zur Ausführung von Flows und Aufgaben in allen Arbeitsbereichen zur Verfügung.
  confirm: Runner beanspruchen
  cancel: Abbrechen
  success: Runner erfolgreich beansprucht
  addressLabel: Adresse des Runner-Servers
  addressPlaceholder: https://runner-0.acme.com
  tokenLabel: Zugriffstoken
  tokenPlaceholder: Geben Sie das Zugriffstoken für den Runner-Server ein
  tokenHint: Definiert über die Umgebungsvariable `RUNNER_TOKEN` auf dem Runner-Server.
es:
  title: Reclamar un nuevo runner
  hint: Para reclamar un nuevo runner, debes proporcionar la dirección del servidor y el token de acceso. El servidor runner debe estar ejecutándose y ser accesible desde esta aplicación. Una vez reclamado, este runner estará disponible para ejecutar flujos y tareas en todos los espacios de trabajo.
  confirm: Reclamar este runner
  cancel: Cancelar
  success: Runner reclamado con éxito
  addressLabel: Dirección del servidor runner
  addressPlaceholder: https://runner-0.acme.com
  tokenLabel: Token de acceso
  tokenPlaceholder: Introduce el token de acceso para el servidor runner
  tokenHint: Definido a través de la variable de entorno `RUNNER_TOKEN` en el servidor runner.
zh:
  title: 认领新的 Runner
  hint: 要认领新的 Runner，您需要提供服务器地址和访问令牌。Runner 服务器必须正在运行并能够从此应用程序访问。认领后，该 Runner 将可用于在所有工作区内执行流程和任务。
  confirm: 认领此 Runner
  cancel: 取消
  success: Runner 成功认领
  addressLabel: Runner 服务器地址
  addressPlaceholder: https://runner-0.acme.com
  tokenLabel: 访问令牌
  tokenPlaceholder: 输入 Runner 服务器的访问令牌
  tokenHint: 在 Runner 服务器上通过 `RUNNER_TOKEN` 环境变量定义。
</i18n>
