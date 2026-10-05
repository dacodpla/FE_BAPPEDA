<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { UploadCloud } from 'lucide-vue-next'

const props = defineProps({
  accept: { type: String, default: 'application/pdf,image/jpeg,image/png' },
  maxSize: { type: Number, default: 5 * 1024 * 1024 },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: null },
})

const emit = defineEmits(['files', 'error'])
const { t } = useI18n()

const isDragging = ref(false)
const inputRef = ref(null)
const localError = ref(null)

const hintText = computed(() =>
  t('dropzone.hint', { size: `${Math.round(props.maxSize / (1024 * 1024))} MB` }),
)

function pick() {
  if (props.disabled) return
  inputRef.value?.click()
}

function onDrop(e) {
  isDragging.value = false
  if (props.disabled) return
  handleFiles(e.dataTransfer.files)
}
function onChange(e) {
  handleFiles(e.target.files)
  e.target.value = '' // allow re-selecting the same file
}

function handleFiles(list) {
  const files = Array.from(list || [])
  const rejected = files.filter((f) => f.size > props.maxSize)
  if (rejected.length) {
    localError.value = t('dropzone.tooLarge')
    emit('error', { code: 'FILE_TOO_LARGE', files: rejected })
    return
  }
  localError.value = null
  emit('files', props.multiple ? files : files.slice(0, 1))
}
</script>

<template>
  <div class="dropzone-wrapper">
    <div
      class="dropzone"
      :class="{ dragging: isDragging, disabled }"
      role="button"
      tabindex="0"
      @click="pick"
      @keydown.enter.prevent="pick"
      @keydown.space.prevent="pick"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <UploadCloud :size="28" aria-hidden="true" class="icon" />
      <p class="cta">{{ t('dropzone.cta') }}</p>
      <p class="hint">{{ hintText }}</p>
      <input
        :id="id"
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="sr-only"
        @change="onChange"
      />
    </div>
    <p v-if="localError" class="error" role="alert">{{ localError }}</p>
  </div>
</template>

<style scoped>
.dropzone {
  border: 1.5px dashed var(--color-border-strong);
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.dropzone:hover:not(.disabled) {
  border-color: var(--color-active-blue);
  background-color: var(--color-light-blue);
}
.dropzone.dragging {
  border-color: var(--color-brand-navy);
  background-color: var(--color-light-blue);
}
.dropzone.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.icon {
  color: var(--color-brand-navy);
}
.cta {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
.hint {
  font-size: var(--text-small);
  color: var(--color-text-muted);
}
.error {
  margin-top: var(--space-2);
  font-size: var(--text-small);
  color: var(--color-danger);
}
</style>
