<script setup lang="ts">
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpPool } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  name: string
}>()

const { t } = useI18n()
const pool = useMcpPool(props)
pool.options.withSpec = true
onMounted(pool.fetchPool)

const defaultIdleTimeout = ref<number>()
const maxServersLimit = ref<number>()
const maxServersActive = ref<number>()

onMounted(() => {
  if (!pool.data) return
  if (!pool.data.spec) return
  maxServersLimit.value = pool.data.spec.maxServersLimit
  maxServersActive.value = pool.data.spec.maxServersActive
  defaultIdleTimeout.value = pool.data.spec.defaultIdleTimeout
})
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('description')"
    :label="t('submitLabel')"
    @submit="() => pool.updatePool({
      spec: {
        defaultIdleTimeout,
        maxServersLimit,
        maxServersActive,
      },
    })">

    <!-- Timeout and Server Limits -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-md w-full">
      <InputText
        v-model="defaultIdleTimeout"
        :label="t('defaultIdleTimeoutLabel')"
        :placeholder="t('defaultIdleTimeoutPlaceholder')"
        :hint="t('defaultIdleTimeoutHint')"
        class="md:col-span-2"
        icon="i-carbon:timer"
      />

      <InputText
        v-model="maxServersLimit"
        :label="t('maxServersLimitLabel')"
        :placeholder="t('maxServersLimitPlaceholder')"
        :hint="t('maxServersLimitHint')"
        icon="i-carbon:maximize"
      />

      <InputText
        v-model="maxServersActive"
        :label="t('maxServersActiveLabel')"
        :placeholder="t('maxServersActivePlaceholder')"
        :hint="t('maxServersActiveHint')"
        icon="i-carbon:play"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Resource Limits
  description: Configure resource limits and scaling settings for servers in this pool. These settings control server lifecycle, resource allocation, and concurrent execution limits.
  submitLabel: Update Limits
  successUpdate: Pool limits have been updated successfully
  defaultIdleTimeoutLabel: Default Idle Timeout (seconds)
  defaultIdleTimeoutPlaceholder: '120'
  defaultIdleTimeoutHint: Time in seconds before idle servers are shut down
  maxServersLimitLabel: Maximum Servers Limit
  maxServersLimitPlaceholder: '100'
  maxServersLimitHint: Total number of servers that can be created in this pool
  maxServersActiveLabel: Maximum Active Servers
  maxServersActivePlaceholder: '5'
  maxServersActiveHint: Number of servers that can run simultaneously
fr:
  title: Limites de Ressources
  description: Configurez les limites de ressources et les paramètres de mise à l'échelle pour les serveurs de ce pool. Ces paramètres contrôlent le cycle de vie des serveurs, l'allocation des ressources et les limites d'exécution simultanée.
  submitLabel: Mettre à Jour les Limites
  successUpdate: Les limites du pool ont été mises à jour avec succès
  defaultIdleTimeoutLabel: Délai d'Inactivité par Défaut (secondes)
  defaultIdleTimeoutPlaceholder: '120'
  defaultIdleTimeoutHint: Temps en secondes avant l'arrêt des serveurs inactifs
  maxServersLimitLabel: Limite Maximale de Serveurs
  maxServersLimitPlaceholder: '100'
  maxServersLimitHint: Nombre total de serveurs pouvant être créés dans ce pool
  maxServersActiveLabel: Serveurs Actifs Maximum
  maxServersActivePlaceholder: '5'
  maxServersActiveHint: Nombre de serveurs pouvant fonctionner simultanément
de:
  title: Ressourcenlimits
  description: Konfigurieren Sie Ressourcenlimits und Skalierungseinstellungen für Server in diesem Pool. Diese Einstellungen steuern den Server-Lebenszyklus, die Ressourcenzuteilung und gleichzeitige Ausführungslimits.
  submitLabel: Limits Aktualisieren
  successUpdate: Pool-Limits wurden erfolgreich aktualisiert
  defaultIdleTimeoutLabel: Standard-Leerlaufzeitüberschreitung (Sekunden)
  defaultIdleTimeoutPlaceholder: '120'
  defaultIdleTimeoutHint: Zeit in Sekunden vor dem Herunterfahren inaktiver Server
  maxServersLimitLabel: Maximale Serveranzahl
  maxServersLimitPlaceholder: '100'
  maxServersLimitHint: Gesamtanzahl der Server, die in diesem Pool erstellt werden können
  maxServersActiveLabel: Maximal Aktive Server
  maxServersActivePlaceholder: '5'
  maxServersActiveHint: Anzahl der gleichzeitig laufenden Server
es:
  title: Límites de Recursos
  description: Configure los límites de recursos y configuraciones de escalado para servidores en este pool. Estas configuraciones controlan el ciclo de vida del servidor, asignación de recursos y límites de ejecución concurrente.
  submitLabel: Actualizar Límites
  successUpdate: Los límites del pool se han actualizado exitosamente
  defaultIdleTimeoutLabel: Tiempo de Espera Inactivo por Defecto (segundos)
  defaultIdleTimeoutPlaceholder: '120'
  defaultIdleTimeoutHint: Tiempo en segundos antes de apagar servidores inactivos
  maxServersLimitLabel: Límite Máximo de Servidores
  maxServersLimitPlaceholder: '100'
  maxServersLimitHint: Número total de servidores que pueden crearse en este pool
  maxServersActiveLabel: Servidores Activos Máximos
  maxServersActivePlaceholder: '5'
  maxServersActiveHint: Número de servidores que pueden ejecutarse simultáneamente
zh:
  title: 资源限制
  description: 为此池中的服务器配置资源限制和扩展设置。这些设置控制服务器生命周期、资源分配和并发执行限制。
  submitLabel: 更新限制
  successUpdate: 池限制已成功更新
  defaultIdleTimeoutLabel: 默认空闲超时（秒）
  defaultIdleTimeoutPlaceholder: '120'
  defaultIdleTimeoutHint: 空闲服务器关闭前的时间（秒）
  maxServersLimitLabel: 最大服务器限制
  maxServersLimitPlaceholder: '100'
  maxServersLimitHint: 此池中可创建的服务器总数
  maxServersActiveLabel: 最大活跃服务器
  maxServersActivePlaceholder: '5'
  maxServersActiveHint: 可同时运行的服务器数量
</i18n>
