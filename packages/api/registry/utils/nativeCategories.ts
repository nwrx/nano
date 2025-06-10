import type { RegistryCategory } from '../entities'

export type NativeCategories = Record<string, Partial<RegistryCategory>>
export type NativeCategoryName = keyof typeof NATIVE_CATEGORIES

export const NATIVE_CATEGORIES = {

  // Featured
  'built-by-nanoworks': {
    title: 'Built by Nanoworks',
    type: 'Featured',
    icon: 'https://api.iconify.design/carbon:software-resource-cluster.svg',
    description: 'This category is used to classify components that are built by Nanoworks.',
  },
  'built-by-ommunity': {
    title: 'Built by Community',
    type: 'Featured',
    icon: 'https://api.iconify.design/carbon:person-favorite.svg',
    description: 'This category is used to classify components that are built by the community.',
  },

  // Purpose
  'control': {
    title: 'Control',
    type: 'Purpose',
    icon: 'https://api.iconify.design/carbon:flow.svg',
    description: 'This category is used to classify components that are used to control the flow of data.',
  },
  'storage': {
    title: 'Storage',
    type: 'Purpose',
    icon: 'https://api.iconify.design/carbon:db2-database.svg',
    description: 'This category is used to classify components that are used to store data.',
  },
  'processing': {
    title: 'Processing',
    type: 'Purpose',
    icon: 'https://api.iconify.design/carbon:process.svg',
    description: 'This category is used to classify components that are used to process data.',
  },
  'models': {
    title: 'Models',
    type: 'Purpose',
    icon: 'https://api.iconify.design/carbon:model.svg',
    description: 'LLM models',
  },
  'mcp': {
    title: 'MCP',
    type: 'Purpose',
    icon: 'https://api.iconify.design/carbon:cloud-platform.svg',
    description: 'This category is used to classify components that are used to interact with an MCP server.',
  },

  // Technology
  'database': {
    title: 'Database',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:db2-database.svg',
    description: 'This category is used to classify components that are used to interact with databases.',
  },
  'database-kv': {
    title: 'KV Database',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:data-unstructured.svg',
    description: 'This category is used to classify components that are used to interact with key-value databases.',
  },
  'database-relational': {
    title: 'Relational Database',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:data-structured.svg',
    description: 'This category is used to classify components that are used to interact with relational databases.',
  },
  'infrastructure': {
    title: 'Infrastructure',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:infrastructure.svg',
    description: 'This category is used to classify components that are used to manage infrastructure.',
  },
  'version-control': {
    title: 'Version Control',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:version.svg',
    description: 'This category is used to classify components that are used to manage version control.',
  },
  'llm': {
    title: 'Large Language Models',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:model.svg',
    description: 'This category is used to classify components that are used to interact with large language models.',
  },
  'image': {
    title: 'Image Processing',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:image.svg',
    description: 'This category is used to classify components that are used to process images.',
  },
  'video': {
    title: 'Video Processing',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:video.svg',
    description: 'This category is used to classify components that are used to process videos.',
  },
  'audio': {
    title: 'Audio Processing',
    type: 'Technology',
    icon: 'https://api.iconify.design/carbon:mobile-audio.svg',
    description: 'This category is used to classify components that are used to process audio.',
  },

  // Industry
  'finance': {
    title: 'Finance',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:finance.svg',
    description: 'This category is used to classify components that are used in the finance Industry.',
  },
  'healthcare': {
    title: 'Healthcare',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:healthcare.svg',
    description: 'This category is used to classify components that are used in the healthcare Industry.',
  },
  'retail': {
    title: 'Retail',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:retail.svg',
    description: 'This category is used to classify components that are used in the retail Industry.',
  },
  'education': {
    title: 'Education',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:education.svg',
    description: 'This category is used to classify components that are used in the education Industry.',
  },
  'government': {
    title: 'Government',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:government.svg',
    description: 'This category is used to classify components that are used in the government Industry.',
  },
  'energy': {
    title: 'Energy',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:energy.svg',
    description: 'This category is used to classify components that are used in the energy Industry.',
  },
  'manufacturing': {
    title: 'Manufacturing',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:manufacturing.svg',
    description: 'This category is used to classify components that are used in the manufacturing Industry.',
  },
  'transportation': {
    title: 'Transportation',
    type: 'Industry',
    icon: 'https://api.iconify.design/carbon:transportation.svg',
    description: 'This category is used to classify components that are used in the transportation Industry.',
  },
} as const satisfies NativeCategories
