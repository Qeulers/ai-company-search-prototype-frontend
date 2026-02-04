<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: String,
    required: true,
    validator: (value) => ['high', 'medium', 'low'].includes(value)
  },
  showLabel: {
    type: Boolean,
    default: true
  }
})

const config = computed(() => {
  const configs = {
    high: {
      label: 'High Confidence',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      dotColor: 'bg-green-500'
    },
    medium: {
      label: 'Medium Confidence',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      dotColor: 'bg-amber-500'
    },
    low: {
      label: 'Low Confidence',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      dotColor: 'bg-red-500'
    }
  }
  return configs[props.level]
})
</script>

<template>
  <span
    :class="[config.bgColor, config.textColor, config.borderColor]"
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
  >
    <span :class="config.dotColor" class="h-2 w-2 rounded-full" />
    <span v-if="showLabel">{{ config.label }}</span>
  </span>
</template>
