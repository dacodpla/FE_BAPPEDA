<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: null },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    :id="id"
    class="base-textarea"
    :class="{ invalid }"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
.base-textarea {
  width: 100%;
  padding: var(--space-3);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: var(--text-body);
  font-family: var(--font-sans);
  line-height: var(--line-height-body);
  resize: vertical;
  min-height: 80px;
}
.base-textarea::placeholder { color: var(--color-text-muted); }
.base-textarea:focus {
  border-color: var(--color-active-blue);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-light-blue);
}
.base-textarea.invalid { border-color: var(--color-danger); }
.base-textarea:disabled {
  background-color: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
</style>
