<script setup>
defineProps({
  title: { type: String, default: null },
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },
})
</script>

<template>
  <section class="base-card" :class="`p-${padding}`">
    <header v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.base-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.p-none { padding: 0; }
.p-sm { padding: var(--space-4); }
.p-md { padding: var(--space-5); }
.p-lg { padding: var(--space-6); }

.card-header {
  margin-bottom: var(--space-4);
}
.card-title {
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 767px) {
  .p-md,
  .p-lg {
    padding: var(--space-4);
  }
}
</style>
