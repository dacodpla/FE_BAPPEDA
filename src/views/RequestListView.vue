<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { FileText, AlertCircle, Plus } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import FormField from '@/components/base/FormField.vue'
import DataTable from '@/components/base/DataTable.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import RequestDetailDrawer from '@/components/domain/RequestDetailDrawer.vue'
import { travelRequestsApi } from '@/api/travelRequests'
import { TRAVEL_REQUEST_STATUS, statusMeta } from '@/constants/statuses'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'

const PAGE_SIZE = 10
const EDITABLE = [TRAVEL_REQUEST_STATUS.DRAFT, TRAVEL_REQUEST_STATUS.REVISION]

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { format: formatMoney } = useCurrency()
const { formatRange } = useDate()

const rows = ref([])
const total = ref(0)
const loading = ref(true)
const failed = ref(false)
const detailId = ref(null)

// Filters live in the URL so the view is shareable and survives refresh.
const status = computed(() => {
  const s = route.query.status
  return typeof s === 'string' && s in TRAVEL_REQUEST_STATUS ? s : ''
})
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const statusOptions = computed(() => [
  { value: '', label: t('common.all') },
  ...Object.values(TRAVEL_REQUEST_STATUS).map((value) => ({
    value,
    label: t(statusMeta(value).labelKey),
  })),
])

const columns = computed(() => [
  { key: 'sppdRef', label: t('requests.cols.sppd'), mobile: 'title' },
  { key: 'destination', label: t('requests.cols.destination'), mobile: 'subtitle' },
  { key: 'dates', label: t('requests.cols.dates') },
  { key: 'estimatedCost', label: t('requests.cols.estimate'), align: 'right' },
  { key: 'status', label: t('requests.cols.status') },
  { key: 'actions', label: t('requests.cols.actions'), align: 'right', mobile: 'subtitle' },
])

async function load() {
  loading.value = true
  failed.value = false
  try {
    const res = await travelRequestsApi.list({
      status: status.value || undefined,
      page: page.value,
      pageSize: PAGE_SIZE,
    })
    rows.value = res.data
    total.value = res.meta.total
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}
watch(() => [status.value, page.value], load, { immediate: true })

function setQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const key of Object.keys(query)) if (!query[key]) delete query[key]
  router.replace({ query })
}
const onStatus = (value) => setQuery({ status: value, page: undefined })
const onPage = (value) => setQuery({ page: value > 1 ? String(value) : undefined })
</script>

<template>
  <AppLayout>
    <div class="stack-5">
      <div class="toolbar">
        <div class="filter">
          <FormField id="filter-status" :label="t('requests.filterStatus')">
            <template #default="{ bindings }">
              <BaseSelect
                :model-value="status"
                :options="statusOptions"
                v-bind="bindings"
                @update:model-value="onStatus"
              />
            </template>
          </FormField>
        </div>
        <BaseButton variant="primary" to="/requests/new">
          <Plus :size="16" aria-hidden="true" />
          {{ t('nav.newRequest') }}
        </BaseButton>
      </div>

      <BaseCard v-if="failed">
        <EmptyState :icon="AlertCircle" :title="t('errors.loadFailed')">
          <BaseButton variant="secondary" @click="load">{{ t('common.retry') }}</BaseButton>
        </EmptyState>
      </BaseCard>

      <BaseCard v-else-if="!loading && !rows.length">
        <EmptyState
          :icon="FileText"
          :title="t('requests.emptyTitle')"
          :description="t('requests.emptyDescription')"
        >
          <BaseButton variant="primary" to="/requests/new">{{ t('nav.newRequest') }}</BaseButton>
        </EmptyState>
      </BaseCard>

      <div v-else>
        <DataTable :columns="columns" :rows="rows" :loading="loading">
          <template #cell-dates="{ row }">{{
            formatRange(row.departDate, row.returnDate)
          }}</template>
          <template #cell-estimatedCost="{ value }">
            {{ value == null ? t('requests.notEstimated') : formatMoney(value) }}
          </template>
          <template #cell-status="{ value }"><StatusBadge :status="value" /></template>
          <template #cell-actions="{ row }">
            <BaseButton
              v-if="EDITABLE.includes(row.status)"
              variant="secondary"
              size="sm"
              :to="{ name: 'requests-edit', params: { id: row.id } }"
            >
              {{ t('common.edit') }}
            </BaseButton>
            <BaseButton v-else variant="secondary" size="sm" @click="detailId = row.id">
              {{ t('common.details') }}
            </BaseButton>
          </template>
        </DataTable>
        <BasePagination :page="page" :page-size="PAGE_SIZE" :total="total" @update:page="onPage" />
      </div>
    </div>

    <RequestDetailDrawer :request-id="detailId" @close="detailId = null" />
  </AppLayout>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.filter {
  min-width: 200px;
}
</style>
