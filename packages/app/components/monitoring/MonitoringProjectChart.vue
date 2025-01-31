<!-- eslint-disable sonarjs/pseudo-random -->
<script setup lang="ts">
import { Chart, type ChartDataset, registerables } from 'chart.js'

const props = defineProps<{
  title: string
  unit: string
  data: Array<{
    label: string
    color: string
    min: number
    max: number
  }>
}>()

const localSettings = useLocalSettings()

const textLight = COLORS.primary[900]
const textDark = COLORS.primary[50]
const textColor = computed(() => (localSettings.value.themeColor === 'dark' ? textDark : textLight))

const count = 8

Chart.register(...registerables)

// Create a chart
const canvas = ref<HTMLCanvasElement>()
const canvasBounds = useElementBounding(canvas)
const chart = ref<Chart>()

function createDataset(label: string, color: string, min = 10000, max = 30000) {
  if (!canvas.value) return
  const context = canvas.value.getContext('2d')
  if (!context) return

  const gradient = context.createLinearGradient(0, 0, 0, canvas.value.height * 0.75)
  gradient.addColorStop(0, `${color}40`)
  gradient.addColorStop(1, 'transparent')

  return {
    label,
    data: Array.from({ length: count }, () => Math.floor(Math.random() * (max - min) + min)),
    borderColor: color,
    borderWidth: 3,
    pointRadius: 0,
    pointHitRadius: 10,
    pointHoverRadius: 5,
    fill: true,
    backgroundColor: gradient,
    tension: 0.4,
    animation: false,
  } as ChartDataset<'line', any>
}

function toReadableNumber(value: number | string) {
  if (typeof value === 'string') value = Number.parseFloat(value)
  if (value < 1000) return value
  if (value < 1000000) return `${(value / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}K`
  if (value < 1000000000) return `${(value / 1000000).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`
  return `${(value / 1000000000).toLocaleString('en-US', { maximumFractionDigits: 1 })}B`
}

watch([props, localSettings], () => {
  if (!canvas.value) return
  if (chart.value) chart.value.destroy()

  const labels = Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
  })

  chart.value = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: props.data.map(({ label, color, min, max }) => createDataset(label, color, min, max)),
    },
    options: {
      font: {
        size: 12,
        family: 'IBM Plex Sans',
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { display: false }, // Hide bottom labels
        },
        y: {
          grid: { display: false },
          ticks: {
            color: textColor.value,
            font: { size: 12, family: 'IBM Plex Sans' },
            callback: value => toReadableNumber(value),
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: ({ dataset, dataIndex }) => {
              const value = dataset.data[dataIndex] as number
              return `${dataset.label}: ${value.toLocaleString()} ${props.unit}`
            },
          },
        },
        legend: {
          display: false,
          labels: {
            color: textColor.value,
          },
          fullSize: true,
          position: 'bottom',
        },
        colors: { enabled: true },
      },
    },
  })
}, { deep: true })
</script>

<template>
  <div class="flex flex-col w-full bg-app rd overflow-y-auto p-md space-y-md">
    <!-- Title -->
    <h2 class="text-lg font-medium">
      {{ title }}
    </h2>

    <canvas ref="canvas" class="w-full" />
  </div>
</template>
