<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import StatCard from '@/components/base/StatCard.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'
import FormField from '@/components/base/FormField.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import DataTable from '@/components/base/DataTable.vue'
import StepIndicator from '@/components/base/StepIndicator.vue'
import FileDropzone from '@/components/base/FileDropzone.vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import { Plane, LayoutGrid, Bell } from 'lucide-vue-next'
import { useCurrency } from '@/composables/useCurrency'

const { t } = useI18n()
const { format } = useCurrency()

const form = reactive({
  text: '',
  select: '',
  textarea: '',
  date: '',
})

const showConfirm = ref(false)
const step = ref(1)

const columns = [
  { key: 'name', label: 'Nama', mobile: 'title' },
  { key: 'dest', label: 'Tujuan', mobile: 'subtitle' },
  { key: 'cost', label: 'Estimasi', align: 'right', mobile: 'meta' },
  { key: 'status', label: 'Status', mobile: 'meta' },
]
const rows = [
  { id: 1, name: 'Andi Pratama', dest: 'Jakarta', cost: 3500000, status: 'PENDING' },
  { id: 2, name: 'Siti Rahayu', dest: 'Surabaya', cost: 2200000, status: 'APPROVED' },
  { id: 3, name: 'Budi Santoso', dest: 'Bali', cost: 5400000, status: 'REVISION' },
]

const steps = [
  { key: 'trip', label: 'Trip details' },
  { key: 'policy', label: 'Policy check' },
  { key: 'docs', label: 'Documents' },
]

const statuses = ['DRAFT', 'PENDING', 'REVISION', 'APPROVED', 'REJECTED', 'COMPLETED', 'ACTIVE', 'INACTIVE']
</script>

<template>
  <AppLayout>
    <div class="stack-6">
      <BaseCard title="Buttons">
        <div class="grid">
          <BaseButton variant="primary">Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="success">Success</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="primary" loading>Loading</BaseButton>
          <BaseButton variant="primary" disabled>Disabled</BaseButton>
          <BaseButton variant="secondary" size="sm">Small</BaseButton>
          <BaseButton variant="secondary" size="lg">Large</BaseButton>
        </div>
      </BaseCard>

      <BaseCard title="Status badges">
        <div class="grid">
          <StatusBadge v-for="s in statuses" :key="s" :status="s" />
        </div>
      </BaseCard>

      <BaseCard title="Stat cards">
        <div class="stat-grid">
          <StatCard label="Active Trips" :value="12" hint="+2 this week" trend="up" :icon="Plane" />
          <StatCard label="Pending Approvals" :value="5" hint="Same as last week" trend="flat" :icon="Bell" />
          <StatCard label="Budget Used" :value="format(45000000)" hint="of 100.000.000" :icon="LayoutGrid" />
        </div>
      </BaseCard>

      <BaseCard title="Form fields">
        <div class="stack-4">
          <FormField id="c-text" label="Text input" :error="!form.text ? t('validation.required') : null" required>
            <template #default="{ bindings }">
              <BaseInput v-model="form.text" placeholder="Type something" v-bind="bindings" />
            </template>
          </FormField>
          <FormField id="c-select" label="Select" hint="Choose one option">
            <template #default="{ bindings }">
              <BaseSelect
                v-model="form.select"
                placeholder="Choose…"
                :options="[
                  { value: 'a', label: 'Option A' },
                  { value: 'b', label: 'Option B' },
                ]"
                v-bind="bindings"
              />
            </template>
          </FormField>
          <FormField id="c-date" label="Date">
            <template #default="{ bindings }">
              <BaseDatePicker v-model="form.date" v-bind="bindings" />
            </template>
          </FormField>
          <FormField id="c-textarea" label="Textarea">
            <template #default="{ bindings }">
              <BaseTextarea v-model="form.textarea" placeholder="Notes…" v-bind="bindings" />
            </template>
          </FormField>
        </div>
      </BaseCard>

      <BaseCard title="Step indicator">
        <div class="stack-3">
          <StepIndicator :steps="steps" :current="step" />
          <div class="row-2">
            <BaseButton variant="secondary" :disabled="step <= 1" @click="step--">Back</BaseButton>
            <BaseButton variant="primary" :disabled="step >= steps.length" @click="step++">
              Next
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="Data table">
        <DataTable :columns="columns" :rows="rows">
          <template #cell-cost="{ value }">{{ format(value) }}</template>
          <template #cell-status="{ value }"><StatusBadge :status="value" /></template>
        </DataTable>
      </BaseCard>

      <BaseCard title="Data table — loading & empty">
        <div class="stack-4">
          <DataTable :columns="columns" :rows="[]" loading />
          <DataTable :columns="columns" :rows="[]" />
        </div>
      </BaseCard>

      <BaseCard title="File dropzone">
        <FileDropzone id="c-dropzone" />
      </BaseCard>

      <BaseCard title="Progress bars">
        <div class="stack-3">
          <ProgressBar :value="25" tone="brand" aria-label="brand" />
          <ProgressBar :value="60" tone="success" aria-label="success" />
          <ProgressBar :value="80" tone="warning" aria-label="warning" />
          <ProgressBar :value="95" tone="danger" aria-label="danger" />
        </div>
      </BaseCard>

      <BaseCard title="Empty state">
        <EmptyState :icon="Plane" title="No trips yet" description="Create your first travel request to get started.">
          <BaseButton variant="primary">New Request</BaseButton>
        </EmptyState>
      </BaseCard>

      <BaseCard title="Confirm dialog">
        <BaseButton variant="danger" @click="showConfirm = true">Open confirm</BaseButton>
        <ConfirmDialog
          v-model:open="showConfirm"
          title="Reject request?"
          message="This action can be reversed by re-submitting."
          confirm-variant="danger"
          confirm-label="Reject"
          @confirm="showConfirm = false"
        />
      </BaseCard>
    </div>
  </AppLayout>
</template>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}
.stat-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
</style>
