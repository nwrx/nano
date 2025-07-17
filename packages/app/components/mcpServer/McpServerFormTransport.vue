<!-- eslint-disable unicorn/no-null -->
<script setup lang="ts">
import type { McpServerTransportType } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Cardbox from '~/components/base/Cardbox.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
server.options.withSpec = true
onMounted(server.fetchServer)

// --- State.
const transportPort = ref()
const transportType = ref<McpServerTransportType>('stdio')

// --- Show transport port field only for certain transport types
const showTransportPort = computed(() => {
  if (!transportType.value) return false
  return ['sse', 'streamable-http'].includes(transportType.value)
})

// --- Lifecycle.
watch(() => props, () => {
  if (!server.data) return
  if (!server.data.spec) return
  if (!server.data.spec.transport) return
  transportPort.value = server.data.spec.transport.port
  transportType.value = server.data.spec.transport.type
}, { immediate: true })
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('description')"
    :label="t('submitLabel')"
    @submit="() => server.updateSpecifications({
      transport: { port: transportPort, type: transportType },
    })">

    <!-- Transport Port -->
    <InputText
      v-if="showTransportPort && server"
      v-model="transportPort"
      :hint="t('transportPortHint')"
      :label="t('transportPortLabel')"
      :placeholder="t('transportPortPlaceholder')"
      required
    />

    <!-- Transport Type -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-sm w-full">
      <Cardbox
        v-model="transportType"
        value="stdio"
        :label="t('transportStdioLabel')"
        :text="t('transportStdioDescription')"
        icon="i-carbon:terminal"
        type="radio"
      />
      <Cardbox
        v-model="transportType"
        value="sse"
        :label="t('transportSseLabel')"
        :text="t('transportSseDescription')"
        icon="i-carbon:events"
        type="radio"
      />
      <Cardbox
        v-model="transportType"
        value="streamable-http"
        :label="t('transportStreamableHttpLabel')"
        :text="t('transportStreamableHttpDescription')"
        icon="i-carbon:flow-stream"
        type="radio"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Transport settings
  description: Configure how the server communicates with the MCP server. This depends on the container image implementation and its capabilities. If unsure about the transport type, refer to the container image documentation.
  submitLabel: Save settings
  transportPortLabel: Transport port
  transportPortPlaceholder: '8080'
  transportPortHint: Port number for HTTP-based transports
  transportStdioLabel: Standard I/O
  transportStdioDescription: Communication via stdin/stdout
  transportSseLabel: Server-Sent Events
  transportSseDescription: HTTP-based real-time communication
  transportStreamableHttpLabel: Streamable HTTP
  transportStreamableHttpDescription: HTTP streaming protocol
fr:
  title: Paramètres de transport
  description: Configurez la communication entre le serveur et le serveur MCP. Cela dépend de l'implémentation de l'image conteneur et de ses capacités. En cas de doute sur le type de transport, consultez la documentation de l'image conteneur.
  submitLabel: Sauvegarder les paramètres
  transportPortLabel: Port de transport
  transportPortPlaceholder: '8080'
  transportPortHint: Numéro de port pour les transports HTTP
  transportStdioLabel: Entrées/sorties standard
  transportStdioDescription: Communication via stdin/stdout
  transportSseLabel: Server-Sent Events
  transportSseDescription: Communication temps réel basée sur HTTP
  transportStreamableHttpLabel: HTTP streamable
  transportStreamableHttpDescription: Protocole de streaming HTTP
de:
  title: Transport-Einstellungen
  description: Konfigurieren Sie die Kommunikation zwischen Server und MCP-Server. Dies hängt von der Container-Image-Implementierung und deren Funktionen ab. Bei Unsicherheit über den Transport-Typ konsultieren Sie die Container-Image-Dokumentation.
  submitLabel: Transport-Einstellungen aktualisieren
  transportPortLabel: Transport-Port
  transportPortPlaceholder: '8080'
  transportPortHint: Port-Nummer für HTTP-basierte Transporte
  transportStdioLabel: Standard-Ein-/Ausgabe
  transportStdioDescription: Kommunikation über stdin/stdout
  transportSseLabel: Server-Sent Events
  transportSseDescription: HTTP-basierte Echtzeitkommunikation
  transportStreamableHttpLabel: Streamable HTTP
  transportStreamableHttpDescription: HTTP-Streaming-Protokoll
es:
  title: Configuración de transporte
  description: Configure la comunicación entre el servidor y el servidor MCP. Esto depende de la implementación de la imagen del contenedor y sus capacidades. Si no está seguro del tipo de transporte, consulte la documentación de la imagen del contenedor.
  submitLabel: Actualizar configuración de transporte
  transportPortLabel: Puerto de transporte
  transportPortPlaceholder: '8080'
  transportPortHint: Número de puerto para transportes HTTP
  transportStdioLabel: Entrada/salida estándar
  transportStdioDescription: Comunicación a través de stdin/stdout
  transportSseLabel: Server-Sent Events
  transportSseDescription: Comunicación en tiempo real basada en HTTP
  transportStreamableHttpLabel: HTTP transmisible
  transportStreamableHttpDescription: Protocolo de streaming HTTP
zh:
  title: 传输设置
  description: 配置服务器与 MCP 服务器的通信方式。这取决于容器镜像的实现及其功能。如果不确定传输类型，请参考容器镜像文档。
  submitLabel: 更新传输设置
  transportPortLabel: 传输端口
  transportPortPlaceholder: '8080'
  transportPortHint: HTTP 传输的端口号
  transportStdioLabel: 标准输入输出
  transportStdioDescription: 通过 stdin/stdout 通信
  transportSseLabel: Server-Sent Events
  transportSseDescription: 基于 HTTP 的实时通信
  transportStreamableHttpLabel: 流式 HTTP
  transportStreamableHttpDescription: HTTP 流式协议
</i18n>
