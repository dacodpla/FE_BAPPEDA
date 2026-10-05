<script setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { t } = useI18n()
</script>

<template>
  <div class="not-found">
    <EmptyState :title="t('empty.noData')" :description="t('empty.noDataDescription')">
      <BaseButton variant="primary" to="/dashboard">{{ t('nav.dashboard') }}</BaseButton>
    </EmptyState>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-page);
}
</style>
