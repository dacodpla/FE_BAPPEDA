<script setup>
import { useI18n } from 'vue-i18n'
import { Plus, FileText, BookOpen } from 'lucide-vue-next'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <BaseCard :title="t('dashboard.quick.title')">
    <div class="stack-2">
      <BaseButton variant="primary" block to="/requests/new">
        <Plus :size="16" aria-hidden="true" />
        {{ t('dashboard.quick.newRequest') }}
      </BaseButton>
      <BaseButton variant="secondary" block to="/reports">
        <FileText :size="16" aria-hidden="true" />
        {{ t('dashboard.quick.submitReport') }}
      </BaseButton>
      <BaseButton variant="secondary" block to="/settings">
        <BookOpen :size="16" aria-hidden="true" />
        {{ t('dashboard.quick.viewPolicies') }}
      </BaseButton>
    </div>
  </BaseCard>
</template>
