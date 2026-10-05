<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'

defineProps({
  titleKey: { type: String, required: true },
  descriptionKey: { type: String, default: null },
})

const { t } = useI18n()
</script>

<template>
  <AppLayout>
    <BaseCard>
      <div class="stack-3">
        <h2>{{ t(titleKey) }}</h2>
        <p class="text-secondary">
          {{ descriptionKey ? t(descriptionKey) : t('empty.noDataDescription') }}
        </p>
      </div>
    </BaseCard>
  </AppLayout>
</template>
