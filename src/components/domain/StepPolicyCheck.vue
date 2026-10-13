<script setup>
import { useI18n } from 'vue-i18n'
import AlertBanner from '@/components/base/AlertBanner.vue'
import SkeletonBlock from '@/components/base/SkeletonBlock.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { AlertCircle } from 'lucide-vue-next'
import { useTravelRequestStore } from '@/stores/travelRequest'
import { useCurrency } from '@/composables/useCurrency'

defineProps({
  loading: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
})
defineEmits(['retry'])

const { t } = useI18n()
const { format } = useCurrency()
const store = useTravelRequestStore()
</script>

<template>
  <div class="stack-4">
    <p class="text-secondary">{{ t('policy.subtitle') }}</p>

    <div v-if="loading" class="stack-3" :aria-label="t('policy.checking')" role="status">
      <SkeletonBlock shape="card" />
      <SkeletonBlock shape="line" />
      <SkeletonBlock shape="line" />
    </div>

    <EmptyState
      v-else-if="failed || !store.policy"
      :icon="AlertCircle"
      :title="t('errors.loadFailed')"
    >
      <BaseButton variant="secondary" @click="$emit('retry')">{{ t('common.retry') }}</BaseButton>
    </EmptyState>

    <template v-else>
      <AlertBanner :tone="store.policy.compliant ? 'success' : 'danger'">
        <strong>{{
          store.policy.compliant ? t('policy.compliant') : t('policy.nonCompliant')
        }}</strong>
        <ul v-if="store.policy.issues.length" class="issue-list">
          <li v-for="issue in store.policy.issues" :key="issue.code">
            {{ t(`policy.issues.${issue.code}`, issue.params || {}) }}
          </li>
        </ul>
      </AlertBanner>

      <AlertBanner v-for="w in store.policy.warnings" :key="w.code" tone="warning">
        {{ t(`policy.warnings.${w.code}`) }}
      </AlertBanner>

      <dl class="facts">
        <div class="fact">
          <dt>{{ t('policy.days') }}</dt>
          <dd>
            {{ t('policy.daysValue', { days: store.policy.days, nights: store.policy.nights }) }}
          </dd>
        </div>
        <div class="fact">
          <dt>{{ t('policy.zone') }}</dt>
          <dd>{{ t(`policy.zones.${store.policy.zone}`) }}</dd>
        </div>
        <div class="fact">
          <dt>{{ t('policy.rank') }}</dt>
          <dd>{{ store.policy.rank }}</dd>
        </div>
        <div class="fact">
          <dt>{{ t('policy.dailyRate') }}</dt>
          <dd class="text-numeric">{{ format(store.policy.rates.dailyAllowance) }}</dd>
        </div>
        <div class="fact">
          <dt>{{ t('policy.lodgingCap') }}</dt>
          <dd class="text-numeric">{{ format(store.policy.rates.lodgingCap) }}</dd>
        </div>
      </dl>

      <section class="breakdown" :aria-label="t('policy.breakdown')">
        <h3 class="text-label">{{ t('policy.breakdown') }}</h3>
        <div class="line">
          <span>{{ t('policy.allowance') }}</span>
          <span class="text-numeric">{{ format(store.policy.breakdown.allowance) }}</span>
        </div>
        <div class="line">
          <span>{{ t('policy.lodging') }}</span>
          <span class="text-numeric">{{ format(store.policy.breakdown.lodging) }}</span>
        </div>
        <div class="line">
          <span>{{ t('policy.transport') }}</span>
          <span class="text-numeric">{{ format(store.policy.breakdown.transport) }}</span>
        </div>
        <div class="line total">
          <span>{{ t('policy.total') }}</span>
          <span class="text-numeric">{{ format(store.policy.breakdown.total) }}</span>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.issue-list {
  margin-top: var(--space-2);
  padding-left: var(--space-4);
  list-style: disc;
}
.facts {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}
@media (min-width: 768px) {
  .facts {
    grid-template-columns: repeat(2, 1fr);
  }
}
.fact {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-input);
}
dt {
  font-size: var(--text-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
dd {
  font-weight: var(--font-weight-medium);
}
.breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.line {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}
.line.total {
  margin-top: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-card-title);
}
</style>
