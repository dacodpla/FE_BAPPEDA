<script setup>
defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: {
    type: Array,
    default: () => [],
    // items: { value, label } or { value, labelKey }
  },
  placeholder: { type: String, default: null },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: null },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <select
    :id="id"
    class="base-select"
    :class="{ invalid }"
    :value="modelValue"
    :disabled="disabled"
    v-bind="$attrs"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<style scoped>
.base-select {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-6) 0 var(--space-3);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: var(--text-body);
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--color-text-secondary) 50%),
    linear-gradient(135deg, var(--color-text-secondary) 50%, transparent 50%);
  background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  cursor: pointer;
}
.base-select:focus {
  border-color: var(--color-active-blue);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-light-blue);
}
.base-select.invalid {
  border-color: var(--color-danger);
}
.base-select:disabled {
  background-color: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
@media (max-width: 767px) {
  .base-select {
    height: 44px;
  }
}
</style>
