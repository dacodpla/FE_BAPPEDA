<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import { useCurrency } from '@/composables/useCurrency'

const props = defineProps({
  /** Server-computed figures from GET /dashboard/summary. */
  used: { type: Number, required: true },
  remaining: { type: Number, required: true },
  percent: { type: Number, required: true },
})

const { t } = useI18n()
const { format } = useCurrency()

const tone = computed(() =>
  props.percent >= 90 ? 'danger' : props.percent >= 70 ? 'warning' : 'brand',
)
</script>

<template>
  <BaseCard :title="t('dashboard.budget.title')">
    <div class="stack-3">
      <div class="figures">
        <div>
          <div class="text-label">{{ t('dashboard.budget.used') }}</div>
          <div class="amount text-numeric">{{ format(used) }}</div>
        </div>
        <div class="right">
          <div class="text-label">{{ t('dashboard.budget.remaining') }}</div>
          <div class="amount text-numeric">{{ format(remaining) }}</div>
        </div>
      </div>
      <ProgressBar :value="percent" :tone="tone" :aria-label="t('dashboard.budget.title')" />
      <p class="text-small text-secondary">{{ t('dashboard.budget.percent', { percent }) }}</p>
    </div>
  </BaseCard>
</template>

<style scoped>
.figures {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
}
.right {
  text-align: right;
}
.amount {
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-bold);
}
</style>
