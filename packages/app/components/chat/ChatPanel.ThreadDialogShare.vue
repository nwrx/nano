<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  name?: string
  url?: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-info"
    icon="i-carbon:share"
    :title="t('title', { name })"
    :text="t('hint', { url })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit')">

    <!-- Thread URL display -->
    <div class="mt-md">
      <InputText
        :model-value="url"
        readonly
        class="w-full"
      />
    </div>
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Share the thread **{name}**?
  hint: You can share the thread using the URL below. Anyone with the link can view the thread.
  confirm: Copy link
  cancel: Cancel
fr:
  title: Partager le fil **{name}** ?
  hint: Vous pouvez partager le fil en utilisant l'URL ci-dessous. Toute personne ayant le lien peut voir le fil.
  confirm: Copier le lien
  cancel: Annuler
de:
  title: Den Thread **{name}** teilen?
  hint: Sie können den Thread mit der unten stehenden URL teilen. Jeder mit dem Link kann den Thread sehen.
  confirm: Link kopieren
  cancel: Abbrechen
es:
  title: Compartir el hilo **{name}**?
  hint: Puedes compartir el hilo usando la URL a continuación. Cualquiera con el enlace puede ver el hilo.
  confirm: Copiar enlace
  cancel: Cancelar
zh:
  title: 分享线程 **{name}**？
  hint: 您可以使用下面的URL分享线程。任何有链接的人都可以查看线程。
  confirm: 复制链接
  cancel: 取消
</i18n>
