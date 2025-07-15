<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'
import { CONSTANTS } from '~/utils/constants'

// --- I/O.
defineProps<{ runner: ThreadRunnerObject }>()

// --- Model.
const { t } = useI18n()
</script>

<template>
  <AppPageForm
    v-if="runner"
    :title="t('title')"
    :text="t('text')">

    <!-- Itentity -->
    <InputText
      :model-value="runner.identity"
      :label="t('identity')"
      :text-before="`${CONSTANTS.appHost}/runners/`"
      :disabled="true"
    />

    <!-- Address -->
    <InputText
      :model-value="runner.address"
      :label="t('address')"
      :hint="t('addressHint')"
      :placeholder="t('addressPlaceholder')"
      :disabled="true"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Configuration
  text: Manage your runner infrastructure with precision. Each runner provides isolated execution environments with unique identities and secure network endpoints for optimal workload distribution.
  success: Runner address was successfully updated.
  identity: Identity
  address: Address
  addressHint: The network endpoint where this runner can be reached (e.g., http://nano-runner-eu-west.acme.com)
  addressPlaceholder: Enter the runner address
fr:
  title: Configuration
  text: Gérez votre infrastructure de serveurs d'exécution avec précision. Chaque serveur d'exécution fournit des environnements d'exécution isolés avec des identités uniques et des points de terminaison réseau sécurisés pour une distribution optimale de la charge de travail.
  success: L'adresse du serveur d'exécution a été mise à jour avec succès.
  identity: Identité
  address: Adresse
  addressHint: Le point de terminaison réseau où ce serveur d'exécution peut être atteint (ex. http://nano-runner-eu-west.acme.com)
  addressPlaceholder: Entrez l'adresse du serveur d'exécution
de:
  title: Konfiguration
  text: Verwalten Sie Ihre Ausführungsserver-Infrastruktur mit Präzision. Jeder Ausführungsserver bietet isolierte Ausführungsumgebungen mit eindeutigen Identitäten und sicheren Netzwerk-Endpunkten für optimale Workload-Verteilung.
  success: Ausführungsserver-Adresse wurde erfolgreich aktualisiert.
  identity: Identität
  address: Adresse
  addressHint: Der Netzwerk-Endpunkt, unter dem dieser Ausführungsserver erreichbar ist (z.B. http://nano-runner-eu-west.acme.com)
  addressPlaceholder: Ausführungsserver-Adresse eingeben
es:
  title: Configuración
  text: Gestione su infraestructura de servidores de ejecución con precisión. Cada servidor de ejecución proporciona entornos de ejecución aislados con identidades únicas y endpoints de red seguros para una distribución óptima de carga de trabajo.
  success: La dirección del servidor de ejecución se actualizó correctamente.
  identity: Identidad
  address: Dirección
  addressHint: El endpoint de red donde se puede alcanzar este servidor de ejecución (ej. http://nano-runner-eu-west.acme.com)
  addressPlaceholder: Ingrese la dirección del servidor de ejecución
zh:
  title: 配置
  text: 精确管理您的执行服务器基础设施。每个执行服务器提供具有唯一身份和安全网络端点的隔离执行环境，实现最佳工作负载分发。
  success: 执行服务器地址已成功更新。
  identity: 身份标识
  address: 地址
  addressHint: 可以访问此执行服务器的网络端点（例如：http://nano-runner-eu-west.acme.com）
  addressPlaceholder: 输入执行服务器地址
</i18n>
