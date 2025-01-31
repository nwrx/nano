import type { Directive } from 'vue'
import Markdown from 'markdown-it'

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
    const markdown = new Markdown()
    const html = binding.value ? markdown.render(binding.value) : ''
    element.setHTMLUnsafe(html)
  },
}
