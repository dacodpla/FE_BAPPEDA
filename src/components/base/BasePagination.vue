<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['update:page'])
const { t } = useI18n()

const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>

<template>
  <nav v-if="pages > 1" class="pagination" :aria-label="t('common.pageOf', { page, pages })">
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
    >
      {{ t('common.previous') }}
    </BaseButton>
    <span class="status text-numeric">{{ t('common.pageOf', { page, pages }) }}</span>
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="page >= pages"
      @click="emit('update:page', page + 1)"
    >
      {{ t('common.next') }}
    </BaseButton>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
.status {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
</style>
