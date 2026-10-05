<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autocomplete: { type: String, default: null },
  id: { type: String, default: null },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :id="id"
    class="base-input"
    :class="{ invalid }"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :autocomplete="autocomplete || undefined"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
.base-input {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-3);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: var(--text-body);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.base-input::placeholder {
  color: var(--color-text-muted);
}
.base-input:hover:not(:disabled):not(:focus) {
  border-color: var(--color-border-strong);
}
.base-input:focus {
  border-color: var(--color-active-blue);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-light-blue);
}
.base-input.invalid {
  border-color: var(--color-danger);
}
.base-input:disabled {
  background-color: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
@media (max-width: 767px) {
  .base-input {
    height: 44px;
  }
}
</style>
