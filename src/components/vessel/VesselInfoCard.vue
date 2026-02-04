<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="bg-white rounded-lg border border-slate-200 p-5">
    <h3
      class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4"
    >
      {{ title }}
    </h3>
    <dl class="space-y-3">
      <div v-for="item in items" :key="item.label" class="flex justify-between">
        <dt class="text-sm text-slate-600">{{ item.label }}</dt>
        <dd class="text-sm font-medium text-brand-dark">
          {{ item.value || "—" }}
        </dd>
      </div>
    </dl>
  </div>
</template>
