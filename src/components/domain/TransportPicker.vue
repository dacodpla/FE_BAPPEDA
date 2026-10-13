<script setup>
import { useI18n } from 'vue-i18n'
import { TRANSPORT_OPTIONS } from '@/constants/travel'

defineProps({
  modelValue: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  /** DOM id of the first option so FormField's label and focusFirst work. */
  id: { type: String, default: null },
  name: { type: String, default: 'transport' },
})

defineEmits(['update:modelValue'])
const { t } = useI18n()
</script>

<template>
  <div class="transport-picker" role="radiogroup" :class="{ invalid }">
    <label v-for="(opt, i) in TRANSPORT_OPTIONS" :key="opt.value" class="tile-wrap">
      <input
        :id="i === 0 ? id : undefined"
        class="sr-only"
        type="radio"
        :name="name"
        :value="opt.value"
        :checked="modelValue === opt.value"
        @change="$emit('update:modelValue', opt.value)"
      />
      <span class="tile">
        <component :is="opt.icon" :size="24" aria-hidden="true" />
        <span class="label">{{ t(`transport.${opt.value}`) }}</span>
      </span>
    </label>
  </div>
</template>

<style scoped>
.transport-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
@media (min-width: 768px) {
  .transport-picker {
    grid-template-columns: repeat(4, 1fr);
  }
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--space-10);
  padding: var(--space-4) var(--space-3);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}
.tile:hover {
  border-color: var(--color-active-blue);
}
input:checked + .tile {
  border-color: var(--color-brand-navy);
  background-color: var(--color-light-blue);
  color: var(--color-brand-navy);
}
input:focus-visible + .tile {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}
.invalid .tile {
  border-color: var(--color-danger);
}
</style>
