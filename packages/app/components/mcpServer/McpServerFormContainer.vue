<script setup lang="ts">
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const image = ref('')
const command = ref('')
const server = useMcpServer(props)
server.options.withSpec = true
onMounted(server.fetchServer)

// --- Lifecycle.
watch(
  () => server.data,
  () => {
    if (!server.data) return
    if (!server.data.spec) return
    const spec = server.data.spec
    image.value = spec.image || 'mcp/fetch:latest'
    command.value = spec.command ? spec.command.join(' ') : '/usr/local/bin/mcp-server'
  },
  { immediate: true },
)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('description')"
    :label="t('submitLabel')"
    @submit="() => server.updateSpecifications({ image, command: command.split(' ') })">

    <!-- Image -->
    <InputText
      v-model="image"
      :label="t('imageLabel')"
      :placeholder="t('imagePlaceholder')"
      :hint="t('imageHint')"
      required
    />

    <!-- Command -->
    <InputText
      v-model="command"
      :label="t('commandLabel')"
      :placeholder="t('commandPlaceholder')"
      :hint="t('commandHint')"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Container Configuration
  description: Configure the Docker container settings including the image, command, and arguments for running the MCP server.
  imageLabel: Container Image
  imagePlaceholder: mcp/fetch:latest
  imageHint: Docker image to use for the server container
  commandLabel: Command
  commandPlaceholder: /usr/local/bin/mcp-server
  commandHint: Command to run inside the container (optional)
  submitLabel: Save Configuration
fr:
  title: Configuration du conteneur
  description: Configurez les paramètres du conteneur Docker, notamment l'image, la commande et les arguments pour exécuter le serveur MCP.
  imageLabel: Image du conteneur
  imagePlaceholder: mcp/fetch:latest
  imageHint: Image Docker à utiliser pour le conteneur du serveur
  commandLabel: Commande
  commandPlaceholder: /usr/local/bin/mcp-server
  commandHint: Commande à exécuter dans le conteneur (optionnel)
  submitLabel: Enregistrer la configuration
de:
  title: Container-Konfiguration
  description: Konfigurieren Sie die Docker-Container-Einstellungen einschließlich Image, Befehl und Argumente für die Ausführung des MCP-Servers.
  imageLabel: Container-Image
  imagePlaceholder: mcp/fetch:latest
  imageHint: Docker-Image für den Server-Container
  commandLabel: Befehl
  commandPlaceholder: /usr/local/bin/mcp-server
  commandHint: Befehl, der im Container ausgeführt werden soll (optional)
  submitLabel: Konfiguration speichern
es:
  title: Configuración del contenedor
  description: Configure los ajustes del contenedor Docker incluyendo la imagen, comando y argumentos para ejecutar el servidor MCP.
  imageLabel: Imagen del contenedor
  imagePlaceholder: mcp/fetch:latest
  imageHint: Imagen Docker a utilizar para el contenedor del servidor
  commandLabel: Comando
  commandPlaceholder: /usr/local/bin/mcp-server
  commandHint: Comando a ejecutar dentro del contenedor (opcional)
  submitLabel: Guardar configuración
zh:
  title: 容器配置
  description: 配置 Docker 容器设置，包括运行 MCP 服务器的镜像、命令和参数。
  imageLabel: 容器镜像
  imagePlaceholder: mcp/fetch:latest
  imageHint: 用于服务器容器的 Docker 镜像
  commandLabel: 命令
  commandPlaceholder: /usr/local/bin/mcp-server
  commandHint: 在容器内运行的命令（可选）
  submitLabel: 保存配置
</i18n>
