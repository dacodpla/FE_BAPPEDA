<script setup>
import { useI18n } from 'vue-i18n'
import { FileText, X } from 'lucide-vue-next'
import FileDropzone from '@/components/base/FileDropzone.vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { travelRequestsApi } from '@/api/travelRequests'
import { useTravelRequestStore } from '@/stores/travelRequest'
import { useApiError } from '@/composables/useApiError'
import { formatBytes } from '@/utils/format'

defineProps({
  /** Error shown under the dropzone (e.g. API `documents` field). */
  error: { type: String, default: null },
})
const emit = defineEmits(['clear'])

const { t } = useI18n()
const store = useTravelRequestStore()
const { notify } = useApiError()

async function onFiles(files) {
  emit('clear')
  await store.uploadFiles(files)
}

async function onRemove(docId) {
  try {
    await store.removeDocument(docId)
  } catch (err) {
    notify(err)
  }
}

function uploadError(upload) {
  if (upload.error.message) return upload.error.message
  if (upload.error.code) return t(`errors.code.${upload.error.code}`)
  return t('documents.failed')
}
</script>

<template>
  <div class="stack-4">
    <div class="stack-1">
      <p class="text-secondary">{{ t('documents.hint') }}</p>
    </div>

    <FileDropzone id="req-documents" multiple @files="onFiles" />
    <p v-if="error" class="field-error" role="alert">{{ error }}</p>

    <ul v-if="store.uploads.length" class="file-list" aria-live="polite">
      <li v-for="u in store.uploads" :key="u.key" class="file-row">
        <div class="file-main">
          <span class="file-name">{{ u.name }}</span>
          <span v-if="u.error" class="field-error">{{ uploadError(u) }}</span>
          <ProgressBar v-else :value="u.progress" :aria-label="t('documents.uploading')" />
        </div>
        <BaseButton v-if="u.error" variant="ghost" size="sm" @click="store.dismissUpload(u.key)">
          {{ t('common.close') }}
        </BaseButton>
      </li>
    </ul>

    <ul v-if="store.documents.length" class="file-list">
      <li v-for="d in store.documents" :key="d.id" class="file-row">
        <FileText :size="18" class="file-icon" aria-hidden="true" />
        <div class="file-main">
          <a
            class="file-name"
            :href="travelRequestsApi.documentUrl(store.id, d.id)"
            target="_blank"
            rel="noopener"
          >
            {{ d.name }}
          </a>
          <span class="text-small text-muted">{{ formatBytes(d.size) }}</span>
        </div>
        <button
          type="button"
          class="remove"
          :aria-label="`${t('common.remove')}: ${d.name}`"
          @click="onRemove(d.id)"
        >
          <X :size="16" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <p v-else-if="!store.uploads.length" class="text-muted text-small">
      {{ t('documents.empty') }}
    </p>
  </div>
</template>

<style scoped>
.file-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.file-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  background-color: var(--color-surface);
}
.file-icon {
  color: var(--color-brand-navy);
  flex-shrink: 0;
}
.file-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.file-name {
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.field-error {
  font-size: var(--text-small);
  color: var(--color-danger);
}
.remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  border-radius: var(--radius-input);
  color: var(--color-text-secondary);
}
.remove:hover {
  background-color: var(--color-danger-soft);
  color: var(--color-danger);
}
@media (max-width: 767px) {
  .remove {
    width: var(--space-10);
    height: var(--space-10);
  }
}
</style>
