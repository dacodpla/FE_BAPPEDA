<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'success', 'danger', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  type: { type: String, default: 'button' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  ariaLabel: { type: String, default: null },
})

defineEmits(['click'])

const isDisabled = computed(() => props.disabled || props.loading)

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})
</script>

<template>
  <component
    :is="tag"
    :to="to || undefined"
    :href="href || undefined"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-label="ariaLabel || undefined"
    class="base-button"
    :class="[`variant-${variant}`, `size-${size}`, { block, loading, disabled: isDisabled }]"
    @click="!isDisabled && $emit('click', $event)"
  >
    <span v-if="loading" class="spinner" aria-hidden="true">
      <Loader2 :size="16" />
    </span>
    <slot />
  </component>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-button);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: background-color var(--transition-fast), color var(--transition-fast),
    border-color var(--transition-fast);
  white-space: nowrap;
}

.base-button.block {
  width: 100%;
}

.size-sm {
  height: 32px;
  padding: 0 var(--space-3);
  font-size: var(--text-small);
}
.size-md {
  height: 36px;
  padding: 0 var(--space-4);
  font-size: var(--text-body);
}
.size-lg {
  height: 44px;
  padding: 0 var(--space-5);
  font-size: var(--text-body);
}

.variant-primary {
  background-color: var(--color-brand-navy);
  color: var(--color-text-inverse);
}
.variant-primary:hover:not(.disabled) {
  background-color: var(--color-brand-navy-hover);
}

.variant-secondary {
  background-color: var(--color-surface);
  color: var(--color-brand-navy);
  border-color: var(--color-border);
}
.variant-secondary:hover:not(.disabled) {
  background-color: var(--color-light-blue);
  border-color: var(--color-active-blue);
}

.variant-success {
  background-color: var(--color-success);
  color: var(--color-text-inverse);
}
.variant-success:hover:not(.disabled) {
  filter: brightness(0.95);
}

.variant-danger {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
}
.variant-danger:hover:not(.disabled) {
  filter: brightness(0.95);
}

.variant-ghost {
  background-color: transparent;
  color: var(--color-brand-navy);
}
.variant-ghost:hover:not(.disabled) {
  background-color: var(--color-light-blue);
}

.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.spinner {
  display: inline-flex;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .size-md,
  .size-lg {
    min-height: 44px;
  }
}
</style>
