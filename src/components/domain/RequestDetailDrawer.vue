<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { X, AlertCircle } from 'lucide-vue-next'
import StatusBadge from '@/components/base/StatusBadge.vue'
import SkeletonBlock from '@/components/base/SkeletonBlock.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { travelRequestsApi } from '@/api/travelRequests'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'
import { formatBytes } from '@/utils/format'

const props = defineProps({
  /** Request id to show; the drawer is open while this is set. */
  requestId: { type: String, default: null },
})
const emit = defineEmits(['close'])

const { t } = useI18n()
const { format: formatMoney } = useCurrency()
const { format: formatDate, formatRange, formatDateTime } = useDate()

const request = ref(null)
const loading = ref(false)
const failed = ref(false)
const closeRef = ref(null)

async function load() {
  if (!props.requestId) return
  loading.value = true
  failed.value = false
  request.value = null
  try {
    const { data } = await travelRequestsApi.get(props.requestId)
    request.value = data
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => props.requestId,
  async (id) => {
    if (!id) return
    await load()
    await nextTick()
    closeRef.value?.focus()
  },
)

function onKey(e) {
  if (props.requestId && e.key === 'Escape') emit('close')
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div v-if="requestId" class="backdrop" @click.self="emit('close')">
      <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header class="head">
          <h2 id="drawer-title" class="title">{{ t('requests.detail.title') }}</h2>
          <button
            ref="closeRef"
            type="button"
            class="close"
            :aria-label="t('common.close')"
            @click="emit('close')"
          >
            <X :size="18" aria-hidden="true" />
          </button>
        </header>

        <div v-if="loading" class="stack-3" role="status">
          <SkeletonBlock shape="title" />
          <SkeletonBlock shape="line" />
          <SkeletonBlock shape="line" />
          <SkeletonBlock shape="card" />
        </div>

        <EmptyState v-else-if="failed" :icon="AlertCircle" :title="t('errors.loadFailed')">
          <BaseButton variant="secondary" @click="load">{{ t('common.retry') }}</BaseButton>
        </EmptyState>

        <div v-else-if="request" class="stack-5">
          <div class="row-between">
            <span class="sppd">{{ request.sppdRef }}</span>
            <StatusBadge :status="request.status" />
          </div>

          <dl class="facts">
            <div>
              <dt>{{ t('requests.detail.employee') }}</dt>
              <dd>{{ request.employee.name }}</dd>
            </div>
            <div>
              <dt>{{ t('requests.detail.destination') }}</dt>
              <dd>{{ request.destination }}</dd>
            </div>
            <div>
              <dt>{{ t('requests.detail.dates') }}</dt>
              <dd>
                {{ formatRange(request.departDate, request.returnDate) }}
                <span class="text-muted"
                  >({{ t('requests.detail.days', { count: request.days }) }})</span
                >
              </dd>
            </div>
            <div>
              <dt>{{ t('requests.detail.transport') }}</dt>
              <dd>{{ t(`transport.${request.transport}`) }}</dd>
            </div>
            <div>
              <dt>{{ t('requests.detail.purpose') }}</dt>
              <dd class="purpose">{{ request.purpose }}</dd>
            </div>
            <div>
              <dt>{{ t('requests.detail.estimate') }}</dt>
              <dd class="text-numeric">
                {{
                  request.estimatedCost == null
                    ? t('requests.notEstimated')
                    : formatMoney(request.estimatedCost)
                }}
              </dd>
            </div>
            <div v-if="request.submittedAt">
              <dt>{{ t('requests.detail.submittedAt') }}</dt>
              <dd>{{ formatDateTime(request.submittedAt) }}</dd>
            </div>
          </dl>

          <section class="stack-2">
            <h3 class="text-label">{{ t('requests.detail.documents') }}</h3>
            <ul v-if="request.documents.length" class="docs">
              <li v-for="d in request.documents" :key="d.id">
                <a
                  :href="travelRequestsApi.documentUrl(request.id, d.id)"
                  target="_blank"
                  rel="noopener"
                >
                  {{ d.name }}
                </a>
                <span class="text-small text-muted"
                  >{{ formatBytes(d.size) }} · {{ formatDate(d.uploadedAt) }}</span
                >
              </li>
            </ul>
            <p v-else class="text-muted text-small">{{ t('requests.detail.noDocuments') }}</p>
          </section>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--color-overlay);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.drawer {
  width: 100%;
  max-width: 480px;
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-elevated);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  font-size: var(--text-section-title);
}
.close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10);
  height: var(--space-10);
  border-radius: var(--radius-input);
  color: var(--color-text-secondary);
}
.close:hover {
  background-color: var(--color-surface-alt);
}
.sppd {
  font-weight: var(--font-weight-semibold);
  font-variant-numeric: tabular-nums;
}
.facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
dt {
  font-size: var(--text-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: var(--space-1);
}
.purpose {
  white-space: pre-wrap;
}
.docs {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.docs li {
  display: flex;
  flex-direction: column;
}
</style>
