import type { Editor } from '../types'

export const CORE_COMPONENT_GROUPS: Editor.ComponentGroup[] = [

  // Control
  {
    name: 'control',
    icon: 'carbon:flow',
    color: '#FF6F61',
    title: {
      en: 'Control',
      fr: 'Contrôle',
      de: 'Steuerung',
      es: 'Control',
      zh: '控制',
    },
    description: {
      en: 'Components that controls the flow and interaction with users.',
      fr: 'Composants qui contrôlent le flux et l\'interaction avec les utilisateurs.',
      de: 'Komponenten, die den Fluss und die Interaktion mit Benutzern steuern.',
      es: 'Componentes que controlan el flujo y la interacción con los usuarios.',
      zh: '控制流程和用户交互的组件。',
    },
  },

  // Integration
  {
    name: 'integration',
    icon: 'carbon:web-services-container',
    color: '#4C8BF5',
    title: {
      en: 'Integration',
      fr: 'Intégration',
      de: 'Integration',
      es: 'Integración',
      zh: '集成',
    },
    description: {
      en: 'Components that integrate with external services and APIs.',
      fr: 'Composants qui s\'intègrent aux services et API externes.',
      de: 'Komponenten, die sich in externe Dienste und APIs integrieren.',
      es: 'Componentes que se integran con servicios y APIs externos.',
      zh: '与外部服务和API集成的组件。',
    },
  },

  // Model
  {
    name: 'model',
    icon: 'carbon:machine-learning-model',
    color: '#FFB74D',
    title: {
      en: 'Model',
      fr: 'Modèle',
      de: 'Modell',
      es: 'Modelo',
      zh: '模型',
    },
    description: {
      en: 'Components that handle machine learning models and data processing.',
      fr: 'Composants qui gèrent les modèles d\'apprentissage automatique et le traitement des données.',
      de: 'Komponenten, die maschinelles Lernen und Datenverarbeitung behandeln.',
      es: 'Componentes que manejan modelos de aprendizaje automático y procesamiento de datos.',
      zh: '处理机器学习模型和数据处理的组件。',
    },
  },

  // Processing
  {
    name: 'processing',
    icon: 'carbon:process',
    color: '#81C784',
    title: {
      en: 'Processing',
      fr: 'Traitement',
      de: 'Verarbeitung',
      es: 'Procesamiento',
      zh: '处理',
    },
    description: {
      en: 'Components that process and transform data.',
      fr: 'Composants qui traitent et transforment les données.',
      de: 'Komponenten, die Daten verarbeiten und transformieren.',
      es: 'Componentes que procesan y transforman datos.',
      zh: '处理和转换数据的组件。',
    },
  },

  // Other
  {
    name: 'other',
    icon: 'carbon:unknown',
    color: '#B39DDB',
    title: {
      en: 'Other',
      fr: 'Autre',
      de: 'Andere',
      es: 'Otro',
      zh: '其他',
    },
    description: {
      en: 'Components that do not fit into other categories.',
      fr: 'Composants qui ne rentrent pas dans d\'autres catégories.',
      de: 'Komponenten, die nicht in andere Kategorien passen.',
      es: 'Componentes que no encajan en otras categorías.',
      zh: '不属于其他类别的组件。',
    },
  },
]
