<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plane, ClipboardCheck, Wallet, AlertCircle } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatCard from '@/components/base/StatCard.vue'
import DataTable from '@/components/base/DataTable.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import SkeletonBlock from '@/components/base/SkeletonBlock.vue'
import QuickActions from '@/components/domain/QuickActions.vue'
import BudgetCard from '@/components/domain/BudgetCard.vue'
import RequestDetailDrawer from '@/components/domain/RequestDetailDrawer.vue'
import { dashboardApi } from '@/api/dashboard'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/constants/roles'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'

const { t } = useI18n()
const auth = useAuthStore()
const { format: formatMoney } = useCurrency()
const { formatRange } = useDate()

const summary = ref(null)
const trips = ref([])
const loading = ref(true)
const failed = ref(false)
const detailId = ref(null)

const pendingHint = computed(() =>
  auth.role === ROLES.EMPLOYEE
    ? t('dashboard.pendingHintEmployee')
    : t('dashboard.pendingHintApprover'),
)

const columns = computed(() => [
  { key: 'destination', label: t('dashboard.cols.trip'), mobile: 'title' },
  { key: 'dates', label: t('dashboard.cols.dates'), mobile: 'subtitle' },
  { key: 'status', label: t('dashboard.cols.status') },
  { key: 'actions', label: '', align: 'right', mobile: 'subtitle' },
])

async function load() {
  loading.value = true
  failed.value = false
  try {
    const [s, u] = await Promise.all([dashboardApi.summary(), dashboardApi.upcomingTrips()])
    summary.value = s.data
    trips.value = u.data
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>

<template>
  <AppLayout>
    <div class="stack-6">
      <div class="stack-1">
        <h2 class="welcome">{{ t('dashboard.welcome', { name: auth.user?.name || '' }) }}</h2>
        <p class="text-secondary">{{ t('dashboard.subtitle') }}</p>
      </div>

      <BaseCard v-if="failed">
        <EmptyState :icon="AlertCircle" :title="t('errors.loadFailed')">
          <BaseButton variant="secondary" @click="load">{{ t('common.retry') }}</BaseButton>
        </EmptyState>
      </BaseCard>

      <template v-else>
        <div class="stat-grid">
          <template v-if="loading">
            <BaseCard v-for="n in 3" :key="n"><SkeletonBlock shape="card" /></BaseCard>
          </template>
          <template v-else>
            <StatCard
              :label="t('dashboard.activeTrips')"
              :value="summary.activeTrips"
              :hint="t('dashboard.activeTripsHint')"
              :icon="Plane"
            />
            <StatCard
              :label="t('dashboard.pendingApprovals')"
              :value="summary.pendingApprovals"
              :hint="pendingHint"
              :icon="ClipboardCheck"
            />
            <StatCard
              :label="t('dashboard.budgetUsed')"
              :value="formatMoney(summary.budgetUsed)"
              :hint="
                t('dashboard.budgetUsedHint', { amount: formatMoney(summary.budgetAllocation) })
              "
              :icon="Wallet"
            />
          </template>
        </div>

        <div class="main-grid">
          <BaseCard :title="t('dashboard.upcomingTrips')">
            <div v-if="loading" class="stack-3">
              <SkeletonBlock shape="line" />
              <SkeletonBlock shape="line" />
              <SkeletonBlock shape="line" />
            </div>
            <EmptyState
              v-else-if="!trips.length"
              :icon="Plane"
              :title="t('dashboard.noUpcomingTitle')"
              :description="t('dashboard.noUpcomingDescription')"
            >
              <BaseButton variant="primary" to="/requests/new">{{
                t('nav.newRequest')
              }}</BaseButton>
            </EmptyState>
            <DataTable v-else :columns="columns" :rows="trips">
              <template #cell-destination="{ row }">
                <div class="trip">
                  <span class="trip-name">{{ row.destination }}</span>
                  <span class="text-small text-muted">{{ row.sppdRef }}</span>
                </div>
              </template>
              <template #cell-dates="{ row }">{{
                formatRange(row.departDate, row.returnDate)
              }}</template>
              <template #cell-status="{ value }"><StatusBadge :status="value" /></template>
              <template #cell-actions="{ row }">
                <BaseButton variant="secondary" size="sm" @click="detailId = row.id">
                  {{ t('common.details') }}
                </BaseButton>
              </template>
            </DataTable>
          </BaseCard>

          <div class="side stack-4">
            <QuickActions />
            <BudgetCard
              v-if="summary"
              :used="summary.budgetUsed"
              :remaining="summary.budgetRemaining"
              :percent="summary.budgetUsedPercent"
            />
          </div>
        </div>
      </template>
    </div>

    <RequestDetailDrawer :request-id="detailId" @close="detailId = null" />
  </AppLayout>
</template>

<style scoped>
.welcome {
  font-size: var(--text-page-title);
  font-weight: var(--font-weight-bold);
}
.stat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  align-items: start;
}
.trip {
  display: flex;
  flex-direction: column;
}
.trip-name {
  font-weight: var(--font-weight-semibold);
}
@media (min-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: 2fr 1fr;
  }
}
@media (max-width: 767px) {
  .welcome {
    font-size: var(--text-section-title);
  }
}
</style>
