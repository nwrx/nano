<script setup lang="ts">
import type { FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  methods: string[]
  description: string
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
  isMethodsOpen: boolean
  isSecretsOpen: boolean
  isVariablesOpen: boolean
}>()

const emit = defineEmits<{
  'update:isMethodsOpen': [isMethodsOpen: boolean]
  'update:isSecretsOpen': [isSecretsOpen: boolean]
  'update:isVariablesOpen': [isVariablesOpen: boolean]
  setName: [name: string]
  setMethods: [methods: string[]]
  setDescription: [description: string]
  variableCreate: [name: string, value: string]
  variableUpdate: [name: string, value: string]
  variableRemove: [name: string]
  secretCreate: [name: string, value: string]
  secretUpdate: [name: string, value: string]
  secretRemove: [name: string]
}>()

// --- Localization
const { t } = useI18n()

// --- Two-way binding
const name = useVModel(props, 'name', emit, { passive: true, eventName: 'setName' })
const methods = useVModel(props, 'methods', emit, { passive: true, eventName: 'setMethods' })
const description = useVModel(props, 'description', emit, { passive: true, eventName: 'setDescription' })
const isMethodsOpen = useVModel(props, 'isMethodsOpen', emit, { passive: true })
const isSecretsOpen = useVModel(props, 'isSecretsOpen', emit, { passive: true })
const isVariablesOpen = useVModel(props, 'isVariablesOpen', emit, { passive: true })
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <FlowEditorPanelSectionName
      v-model:name="name"
      v-model:description="description"
    />

    <!-- Input Methods -->
    <FlowEditorPanelSectionToggle
      v-model="methods"
      v-model:isOpen="isMethodsOpen"
      type="checkbox"
      title="Trigger Methods"
      text="Define how this flow can be triggered."
      :values="[
        { value: 'http', icon: 'i-carbon:code', label: 'HTTP', hint: 'Allow this flow to be triggered via HTTP requests.' },
        { value: 'websocket', icon: 'i-carbon:arrows-vertical', label: 'WebSocket', hint: 'Allow this flow to be triggered via WebSocket requests.' },
        { value: 'cron', icon: 'i-carbon:time', label: 'Schedule', hint: 'Allow this flow to be triggered via manual start.' },
      ]"
    />

    <FlowEditorPanelSectionVariables
      v-model:isOpen="isVariablesOpen"
      :variables="variables"
      title="Variables"
      text="List and define variables."
      createTitle="Create a new variable"
      createText="Define a new variable with a name and value."
      createLabel="+ CREATE_NEW_VARIABLE"
      updateTitle="Update variable"
      updateText="Update the value of the variable."
      @create="(name, value) => emit('variableCreate', name, value)"
      @update="(name, value) => emit('variableUpdate', name, value)"
      @delete="(name) => emit('variableRemove', name)"
    />

    <FlowEditorPanelSectionVariables
      v-model:isOpen="isSecretsOpen"
      :variables="secrets"
      :title="t('secret.title')"
      :text="t('secret.text')"
      :createTitle="t('secret.create.title')"
      :createText="t('secret.create.text')"
      :createLabel="t('secret.create.label')"
      :updateTitle="t('secret.update.title')"
      :updateText="t('secret.update.text')"
      @create="(name, value) => emit('secretCreate', name, value)"
      @update="(name, value) => emit('secretUpdate', name, value)"
      @delete="(name) => emit('secretRemove', name)"
    />
  </div>
</template>

<i18n lang="yaml">
  en:
    method.title: Trigger Methods
    method.text: Define how this flow can be triggered.
    method.http: HTTP
    method.http.hint: Allow this flow to be triggered via HTTP requests.
    method.websocket: WebSocket
    method.websocket.hint: Allow this flow to be triggered via WebSocket requests.
    method.cron: Schedule
    method.cron.hint: Allow this flow to be triggered rec
    variable.title: Variables
    variable.text: List and define variables.
    variable.create.title: Create a new variable
    variable.create.text: Define a new variable with a name and value.
    variable.create.label: + CREATE_NEW_VARIABLE
    variable.update.title: Update variable
    variable.update.text: Update the value of the variable.
    secret.title: Secrets
    secret.text: Create, replace, or remove secrets.
    secret.create.title: Create a new secret
    secret.create.text: Define a new secret with a name and value.
    secret.create.label: + CREATE_NEW_SECRET
    secret.update.title: Update secret
    secret.update.text: Update the value of the secret.
  fr:
    method.title: Méthodes de déclenchement
    method.text: Définissez comment ce flux peut être déclenché.
    method.http: HTTP
    method.http.hint: Permettre à ce flux d'être déclenché via des requêtes HTTP.
    method.websocket: WebSocket
    method.websocket.hint: Permettre à ce flux d'être déclenché via des requêtes WebSocket.
    method.cron: Calendrier
    method.cron.hint: Permettre à ce flux d'être déclenché via un démarrage manuel.
    variable.title: Variables
    variable.text: Liste et définition des variables.
    variable.create.title: Créer une nouvelle variable
    variable.create.text: Définir une nouvelle variable avec un nom et une valeur.
    variable.create.label: + CRÉER_NOUVELLE_VARIABLE
    variable.update.title: Mettre à jour la variable
    variable.update.text: Mettre à jour la valeur de la variable.
    secret.title: Secrets
    secret.text: Créer, remplacer ou supprimer des secrets.
    secret.create.title: Créer un nouveau secret
    secret.create.text: Définir un nouveau secret avec un nom et une valeur.
    secret.create.label: + CREER_NOUVEAU_SECRET
    secret.update.title: Mettre à jour le secret
    secret.update.text: Mettre à jour la valeur du secret.
  de:
    method.title: Trigger Methoden
    method.text: Definieren Sie, wie dieser Ablauf ausgelöst werden kann.
    method.http: HTTP
    method.http.hint: Ermöglichen Sie, dass dieser Ablauf über HTTP-Anfragen ausgelöst wird.
    method.websocket: WebSocket
    method.websocket.hint: Ermöglichen Sie, dass dieser Ablauf über WebSocket-Anfragen ausgelöst wird.
    method.cron: Zeitplan
    method.cron.hint: Ermöglichen Sie, dass dieser Ablauf über einen manuellen Start ausgelöst wird.
    variable.title: Variablen
    variable.text: Liste und Definition von Variablen.
    variable.create.title: Erstellen Sie eine neue Variable
    variable.create.text: Definieren Sie eine neue Variable mit einem Namen und einem Wert.
    variable.create.label: + NEUE_VARIABLE_ERSTELLEN
    variable.update.title: Variable aktualisieren
    variable.update.text: Aktualisieren Sie den Wert der Variablen.
    secret.title: Geheimnisse
    secret.text: Erstellen, Ersetzen oder Entfernen von Geheimnissen.
    secret.create.title: Erstellen Sie ein neues Geheimnis
    secret.create.text: Definieren Sie ein neues Geheimnis mit einem Namen und einem Wert.
    secret.create.label: + NEUES_GEHEIMNIS_ERSTELLEN
    secret.update.title: Geheimnis aktualisieren
    secret.update.text: Aktualisieren Sie den Wert des Geheimnisses.
  es:
    method.title: Métodos de activación
    method.text: Define cómo se puede activar este flujo.
    method.http: HTTP
    method.http.hint: Permitir que este flujo se active mediante solicitudes HTTP.
    method.websocket: WebSocket
    method.websocket.hint: Permitir que este flujo se active mediante solicitudes WebSocket.
    method.cron: Programar
    method.cron.hint: Permitir que este flujo se active mediante un inicio manual.
    variable.title: Variables
    variable.text: Enumere y defina variables.
    variable.create.title: Crear una nueva variable
    variable.create.text: Defina una nueva variable con un nombre y un valor.
    variable.create.label: + CREAR_NUEVA_VARIABLE
    variable.update.title: Actualizar variable
    variable.update.text: Actualice el valor de la variable.
    secret.title: Secretos
    secret.text: Crear, reemplazar o eliminar secretos.
    secret.create.title: Crear un nuevo secreto
    secret.create.text: Defina un nuevo secreto con un nombre y un valor.
    secret.create.label: + CREAR_NUEVO_SECRETO
    secret.update.title: Actualizar secreto
    secret.update.text: Actualice el valor del secreto.
  zh:
    method.title: 触发方法
    method.text: 定义此流程如何触发。
    method.http: HTTP
    method.http.hint: 允许通过 HTTP 请求触发此流程。
    method.websocket: WebSocket
    method.websocket.hint: 允许通过 WebSocket 请求触发此流程。
    method.cron: 计划
    method.cron.hint: 允许通过手动启动触发此流程。
    variable.title: 变量
    variable.text: 列出并定义变量。
    variable.create.title: 创建新变量
    variable.create.text: 使用名称和值定义新变量。
    variable.create.label: + 创建新变量
    variable.update.title: 更新变量
    variable.update.text: 更新变量的值。
    secret.title: 秘密
    secret.text: 创建、替换或删除秘密。
    secret.create.title: 创建新秘密
    secret.create.text: 使用名称和值定义新秘密。
    secret.create.label: + CHUANJIAN_XIN_MIMI
    secret.update.title: 更新秘密
    secret.update.text: 更新秘密的值。
</i18n>
