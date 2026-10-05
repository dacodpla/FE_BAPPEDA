<script setup>
defineProps({
  icon: { type: [Object, Function], default: null },
  title: { type: String, required: true },
  description: { type: String, default: null },
})
</script>

<template>
  <div class="empty-state">
    <component :is="icon" v-if="icon" :size="32" class="icon" aria-hidden="true" />
    <h3 class="title">{{ title }}</h3>
    <p v-if="description" class="description">{{ description }}</p>
    <div v-if="$slots.default" class="actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-4);
  text-align: center;
  color: var(--color-text-secondary);
}
.icon {
  color: var(--color-text-muted);
}
.title {
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
.description {
  font-size: var(--text-body);
  color: var(--color-text-secondary);
  max-width: 380px;
}
.actions {
  margin-top: var(--space-3);
}
</style>
