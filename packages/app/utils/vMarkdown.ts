import type { Directive } from 'vue'
import { escapeHtml } from '@unshared/string/escapeHtml'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

/**
 * The `v-markdown` directive is used to render markdown content in the UI. It takes a string
 * of markdown content and renders it as HTML. This directive is useful for displaying
 * formatted text in the UI.
 *
 * @example
 * ```vue
 * <template>
 *   <div v-markdown="markdownContent" />
 * </template>
 */
export const vMarkdown: Directive<HTMLElement, string | undefined> = {
  mounted(element, binding) {
    if (!binding.value) return
    const markdownSafe = escapeHtml(binding.value)
    const html = marked(markdownSafe, { gfm: true, breaks: true }) as string
    const htmlSafe = DOMPurify.sanitize(html)
    element.setHTMLUnsafe(htmlSafe)
  },
}
