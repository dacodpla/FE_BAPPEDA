<script setup>
import { useI18n } from 'vue-i18n'
import { CheckCircle, AlertCircle, X } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const { t } = useI18n()
const toasts = useToastStore()
</script>

<template>
  <div class="toast-host" aria-live="polite">
    <div
      v-for="item in toasts.items"
      :key="item.id"
      class="toast"
      :class="`type-${item.type}`"
      role="status"
    >
      <component
        :is="item.type === 'error' ? AlertCircle : CheckCircle"
        :size="18"
        aria-hidden="true"
      />
      <span class="message">{{ item.message }}</span>
      <button
        type="button"
        class="close"
        :aria-label="t('toast.dismiss')"
        @click="toasts.dismiss(item.id)"
      >
        <X :size="16" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 2000;
  max-width: calc(100vw - var(--space-8));
}
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left-width: var(--space-1);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-elevated);
  font-size: var(--text-body);
}
.type-success {
  border-left-color: var(--color-success);
  color: var(--color-text-primary);
}
.type-success svg {
  color: var(--color-success);
}
.type-error {
  border-left-color: var(--color-danger);
}
.type-error svg {
  color: var(--color-danger);
}
.message {
  flex: 1;
}
.close {
  display: inline-flex;
  color: var(--color-text-muted);
  padding: var(--space-1);
}
.close:hover {
  color: var(--color-text-primary);
}
@media (max-width: 767px) {
  /* Keep toasts above the bottom navigation. */
  .toast-host {
    left: var(--space-4);
    bottom: calc(var(--bottom-nav-height) + var(--space-4));
  }
}
</style>
