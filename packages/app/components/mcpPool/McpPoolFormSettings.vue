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
const formData = ref({ title: '', description: '' })
onMounted(() => pool.fetchPool())
watch(() => pool.data, poolData => formData.value = poolData, { immediate: true })
</script>

<template>
  <AppPageForm
    :title="t('pageTitle')"
    :text="t('pageDescription')"
    :label="t('submitLabel')"
    @submit="() => pool.updatePool(formData)">

    <!-- Name and Title -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-md w-full">
      <InputText
        :model-value="pool.data.name"
        :label="t('nameLabel')"
        :placeholder="t('namePlaceholder')"
        :hint="t('nameHint')"
        :text-before="`${CONSTANTS.appHost}/${workspace}/pools/`"
        disabled
      />

      <!-- Title -->
      <InputText
        v-model="formData.title"
        :label="t('titleLabel')"
        :placeholder="t('titlePlaceholder')"
        :hint="t('titleHint')"
      />
    </div>

    <!-- Description -->
    <InputText
      v-model="formData.description"
      :label="t('descriptionLabel')"
      :placeholder="t('descriptionPlaceholder')"
      :hint="t('descriptionHint')"
      type="textarea"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  pageTitle: Identity & Details
  pageDescription: Define the identity and descriptive information for this MCP pool. Pools serve as resource containers that manage server instances and control the lifecycle of MCP servers within your workspace. The identity information helps organize and identify your pools across different environments.
  submitLabel: Save Pool Identity
  nameLabel: Pool Identifier
  namePlaceholder: my-pool-name
  nameHint: Unique identifier for this pool within your workspace. This cannot be changed after creation.
  titleLabel: Display Title
  titlePlaceholder: My Production Pool
  titleHint: Human-readable name displayed in the interface and logs
  descriptionLabel: Pool Description
  descriptionPlaceholder: Describe the purpose and scope of this pool...
  descriptionHint: Detailed description of what this pool is used for, which servers it manages, and its intended purpose within your infrastructure
fr:
  pageTitle: Identité et Détails
  pageDescription: Définissez l'identité et les informations descriptives pour ce pool MCP. Les pools servent de conteneurs de ressources qui gèrent les instances de serveur et contrôlent le cycle de vie des serveurs MCP dans votre espace de travail. Les informations d'identité aident à organiser et identifier vos pools dans différents environnements.
  submitLabel: Enregistrer l'Identité du Pool
  nameLabel: Identifiant du Pool
  namePlaceholder: mon-nom-de-pool
  nameHint: Identifiant unique pour ce pool dans votre espace de travail. Ceci ne peut pas être modifié après création.
  titleLabel: Titre d'Affichage
  titlePlaceholder: Mon Pool de Production
  titleHint: Nom lisible par l'homme affiché dans l'interface et les journaux
  descriptionLabel: Description du Pool
  descriptionPlaceholder: Décrivez l'objectif et la portée de ce pool...
  descriptionHint: Description détaillée de l'utilisation de ce pool, des serveurs qu'il gère et de son objectif dans votre infrastructure
de:
  pageTitle: Pool-Identität & Details
  pageDescription: Definieren Sie die Identität und beschreibenden Informationen für diesen MCP-Pool. Pools dienen als Ressourcencontainer, die Serverinstanzen verwalten und den Lebenszyklus von MCP-Servern in Ihrem Arbeitsbereich steuern. Die Identitätsinformationen helfen dabei, Ihre Pools in verschiedenen Umgebungen zu organisieren und zu identifizieren.
  submitLabel: Pool-Identität Speichern
  nameLabel: Pool-Identifikator
  namePlaceholder: mein-pool-name
  nameHint: Eindeutiger Identifikator für diesen Pool in Ihrem Arbeitsbereich. Dies kann nach der Erstellung nicht geändert werden.
  titleLabel: Anzeigetitel
  titlePlaceholder: Mein Produktions-Pool
  titleHint: Menschenlesbarer Name, der in der Benutzeroberfläche und in Protokollen angezeigt wird
  descriptionLabel: Pool-Beschreibung
  descriptionPlaceholder: Beschreiben Sie den Zweck und Umfang dieses Pools...
  descriptionHint: Detaillierte Beschreibung, wofür dieser Pool verwendet wird, welche Server er verwaltet und sein beabsichtigter Zweck in Ihrer Infrastruktur
es:
  pageTitle: Identidad y Detalles del Pool
  pageDescription: Defina la identidad e información descriptiva para este pool MCP. Los pools sirven como contenedores de recursos que administran instancias de servidor y controlan el ciclo de vida de los servidores MCP dentro de su espacio de trabajo. La información de identidad ayuda a organizar e identificar sus pools en diferentes entornos.
  submitLabel: Guardar Identidad del Pool
  nameLabel: Identificador del Pool
  namePlaceholder: mi-nombre-de-pool
  nameHint: Identificador único para este pool dentro de su espacio de trabajo. Esto no se puede cambiar después de la creación.
  titleLabel: Título de Visualización
  titlePlaceholder: Mi Pool de Producción
  titleHint: Nombre legible por humanos mostrado en la interfaz y registros
  descriptionLabel: Descripción del Pool
  descriptionPlaceholder: Describe el propósito y alcance de este pool...
  descriptionHint: Descripción detallada de para qué se usa este pool, qué servidores administra y su propósito previsto dentro de su infraestructura
zh:
  pageTitle: 资源池身份与详情
  pageDescription: 定义此MCP资源池的身份和描述性信息。资源池作为资源容器，管理服务器实例并控制工作区内MCP服务器的生命周期。身份信息有助于在不同环境中组织和识别您的资源池。
  submitLabel: 保存资源池身份
  nameLabel: 资源池标识符
  namePlaceholder: 我的资源池名称
  nameHint: 工作区内此资源池的唯一标识符。创建后无法更改。
  titleLabel: 显示标题
  titlePlaceholder: 我的生产资源池
  titleHint: 在界面和日志中显示的人类可读名称
  descriptionLabel: 资源池描述
  descriptionPlaceholder: 描述此资源池的用途和范围...
  descriptionHint: 详细描述此资源池的用途、管理哪些服务器以及在基础设施中的预期目的
</i18n>
