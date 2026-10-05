<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, default: null },
  message: { type: String, default: null },
  confirmLabel: { type: String, default: null },
  cancelLabel: { type: String, default: null },
  confirmVariant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'danger'].includes(v),
  },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel', 'update:open'])
const { t } = useI18n()

const dialogRef = ref(null)
const confirmRef = ref(null)

function onKey(e) {
  if (!props.open) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

function close() {
  emit('cancel')
  emit('update:open', false)
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

watch(
  () => props.open,
  async (v) => {
    if (v) {
      await nextTick()
      confirmRef.value?.$el?.focus?.() || confirmRef.value?.focus?.()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="backdrop" @click.self="close">
      <div
        ref="dialogRef"
        class="dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'confirm-title' : undefined"
      >
        <h3 v-if="title" id="confirm-title" class="title">{{ title || t('confirm.title') }}</h3>
        <p v-if="message || $slots.default" class="body">
          <slot>{{ message || t('confirm.message') }}</slot>
        </p>
        <div class="actions">
          <BaseButton variant="secondary" @click="close">
            {{ cancelLabel || t('confirm.cancelLabel') }}
          </BaseButton>
          <BaseButton
            ref="confirmRef"
            :variant="confirmVariant"
            :loading="loading"
            @click="emit('confirm')"
          >
            {{ confirmLabel || t('confirm.confirmLabel') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}
.dialog {
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  max-width: 440px;
  width: 100%;
  box-shadow: var(--shadow-elevated);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.title {
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-semibold);
}
.body {
  color: var(--color-text-secondary);
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
</style>
