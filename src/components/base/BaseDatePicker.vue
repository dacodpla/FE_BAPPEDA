<script setup>
// Thin wrapper over <input type="date">. Emits ISO YYYY-MM-DD to match the
// backend contract. A richer calendar can be swapped in later without
// changing consumers.
defineProps({
  modelValue: { type: String, default: '' },
  min: { type: String, default: null },
  max: { type: String, default: null },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: null },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :id="id"
    class="base-datepicker"
    :class="{ invalid }"
    type="date"
    :value="modelValue"
    :min="min || undefined"
    :max="max || undefined"
    :disabled="disabled"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
.base-datepicker {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-3);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: var(--text-body);
  font-family: var(--font-sans);
}
.base-datepicker:focus {
  border-color: var(--color-active-blue);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-light-blue);
}
.base-datepicker.invalid { border-color: var(--color-danger); }
.base-datepicker:disabled {
  background-color: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
@media (max-width: 767px) {
  .base-datepicker { height: 44px; }
}
</style>
