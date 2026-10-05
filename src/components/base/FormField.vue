<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  error: { type: String, default: null },
  hint: { type: String, default: null },
  required: { type: Boolean, default: false },
})

const slots = useSlots()
const errorId = computed(() => `${props.id}-error`)
const hintId = computed(() => `${props.id}-hint`)
const describedBy = computed(() => {
  const ids = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : null
})

// Provide the id, invalid state, and describedBy to the slotted input via
// a scoped slot so BaseInput/BaseSelect/BaseTextarea can bind them.
const bindings = computed(() => ({
  id: props.id,
  invalid: !!props.error,
  'aria-invalid': props.error ? 'true' : undefined,
  'aria-describedby': describedBy.value || undefined,
  'aria-required': props.required ? 'true' : undefined,
}))

void slots
</script>

<template>
  <div class="form-field">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required" aria-hidden="true">*</span>
    </label>
    <slot :bindings="bindings" />
    <p v-if="hint && !error" :id="hintId" class="form-hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="form-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.form-label {
  font-size: var(--text-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.required {
  color: var(--color-danger);
  margin-left: 2px;
}
.form-hint {
  font-size: var(--text-small);
  color: var(--color-text-muted);
}
.form-error {
  font-size: var(--text-small);
  color: var(--color-danger);
}
</style>
