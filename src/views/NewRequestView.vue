<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle, Lock } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StepIndicator from '@/components/base/StepIndicator.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import SkeletonBlock from '@/components/base/SkeletonBlock.vue'
import AlertBanner from '@/components/base/AlertBanner.vue'
import StepTripDetails from '@/components/domain/StepTripDetails.vue'
import StepPolicyCheck from '@/components/domain/StepPolicyCheck.vue'
import StepDocuments from '@/components/domain/StepDocuments.vue'
import FormActions from '@/components/domain/FormActions.vue'
import { useTravelRequestStore } from '@/stores/travelRequest'
import { useToastStore } from '@/stores/toast'
import { useFormErrors } from '@/composables/useFormErrors'
import { useApiError } from '@/composables/useApiError'

const TOTAL_STEPS = 3
const FIELD_IDS = {
  destination: 'req-destination',
  departDate: 'req-depart-date',
  returnDate: 'req-return-date',
  purpose: 'req-purpose',
  transport: 'req-transport',
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTravelRequestStore()
const toast = useToastStore()
const { notify } = useApiError()
const { errors, setFromApi, clear, focusFirst } = useFormErrors()

/** loading | ready | error | locked */
const pageState = ref('loading')
const busy = ref(false)
const policyLoading = ref(false)
const policyFailed = ref(false)

const steps = computed(() => [
  { key: 'trip', label: t('form.steps.trip') },
  { key: 'policy', label: t('form.steps.policy') },
  { key: 'documents', label: t('form.steps.documents') },
])
const stepTitle = computed(() => steps.value[store.step - 1].label)
const isLastStep = computed(() => store.step === TOTAL_STEPS)
const policyBlocksNext = computed(
  () => store.step === 2 && (policyLoading.value || policyFailed.value || !store.policy?.compliant),
)

async function init() {
  clear()
  const id = route.params.id
  if (!id) {
    store.reset()
    pageState.value = 'ready'
    return
  }
  // After the first save we replace /new with /:id/edit; the store already has it.
  if (store.id === id) {
    pageState.value = store.isEditable ? 'ready' : 'locked'
    return
  }
  pageState.value = 'loading'
  try {
    await store.load(id)
    pageState.value = store.isEditable ? 'ready' : 'locked'
  } catch (err) {
    pageState.value = 'error'
    notify(err)
  }
}
watch(() => route.params.id, init, { immediate: true })

watch(
  () => store.step,
  (step) => {
    if (step === 2) runPolicy()
  },
)

async function runPolicy() {
  policyLoading.value = true
  policyFailed.value = false
  try {
    await store.runPolicyCheck()
  } catch (err) {
    policyFailed.value = true
    await handleConflict(err)
  } finally {
    policyLoading.value = false
  }
}

function validateTrip() {
  const f = store.form
  const next = {}
  if (!f.destination.trim()) next.destination = t('validation.required')
  if (!f.departDate) next.departDate = t('validation.required')
  if (!f.returnDate) next.returnDate = t('validation.required')
  else if (f.departDate && f.returnDate < f.departDate)
    next.returnDate = t('validation.returnBeforeDepart')
  if (!f.purpose.trim()) next.purpose = t('validation.required')
  else if (f.purpose.trim().length < 5) next.purpose = t('validation.min', { min: 5 })
  if (!f.transport) next.transport = t('validation.required')
  errors.value = next
  return Object.keys(next).length === 0
}

/** 409: the status changed elsewhere — tell the user and reload the request. */
async function handleConflict(err) {
  notify(err)
  if (err?.response?.status === 409 && store.id) {
    try {
      await store.load(store.id)
      pageState.value = store.isEditable ? 'ready' : 'locked'
    } catch (reloadErr) {
      notify(reloadErr)
    }
  }
}

async function saveTrip() {
  if (!validateTrip()) {
    store.step = 1
    await focusFirst(FIELD_IDS)
    return false
  }
  try {
    const { created } = await store.saveTrip()
    if (created) await router.replace({ name: 'requests-edit', params: { id: store.id } })
    return true
  } catch (err) {
    if (err?.response?.status === 422) {
      setFromApi(err)
      store.step = 1
      await focusFirst(FIELD_IDS)
    } else {
      await handleConflict(err)
    }
    return false
  }
}

async function onSaveDraft() {
  busy.value = true
  try {
    if (await saveTrip()) toast.success(t('form.saved'))
  } finally {
    busy.value = false
  }
}

async function onNext() {
  busy.value = true
  try {
    if (store.step === 1) {
      if (await saveTrip()) store.step = 2
    } else if (store.step === 2) {
      store.step = 3
    } else {
      await onSubmit()
    }
  } finally {
    busy.value = false
  }
}

async function onSubmit() {
  clear()
  try {
    await store.submit()
    toast.success(t('form.submitted'))
    store.reset()
    router.push('/requests')
  } catch (err) {
    if (err?.response?.status === 422) setFromApi(err)
    else await handleConflict(err)
  }
}
</script>

<template>
  <AppLayout>
    <div class="stack-5">
      <div v-if="pageState === 'loading'" class="stack-3" role="status">
        <SkeletonBlock shape="title" />
        <SkeletonBlock shape="card" />
        <SkeletonBlock shape="card" />
      </div>

      <BaseCard v-else-if="pageState === 'error'">
        <EmptyState :icon="AlertCircle" :title="t('errors.loadFailed')">
          <BaseButton variant="secondary" @click="init">{{ t('common.retry') }}</BaseButton>
        </EmptyState>
      </BaseCard>

      <BaseCard v-else-if="pageState === 'locked'">
        <EmptyState :icon="Lock" :title="t('form.cannotEdit')">
          <BaseButton variant="primary" to="/requests">{{ t('form.backToList') }}</BaseButton>
        </EmptyState>
      </BaseCard>

      <template v-else>
        <BaseCard padding="sm">
          <StepIndicator :steps="steps" :current="store.step" />
        </BaseCard>

        <BaseCard :title="stepTitle">
          <AlertBanner v-if="errors.policy" tone="danger" class="banner">
            {{ t('policy.submitBlocked') }}
          </AlertBanner>

          <StepTripDetails
            v-if="store.step === 1"
            :errors="errors"
            :ids="FIELD_IDS"
            @clear="clear"
          />
          <StepPolicyCheck
            v-else-if="store.step === 2"
            :loading="policyLoading"
            :failed="policyFailed"
            @retry="runPolicy"
          />
          <StepDocuments
            v-else
            :error="errors.documents ? t('documents.required') : errors.files || null"
            @clear="clear"
          />
        </BaseCard>

        <FormActions>
          <template #start>
            <BaseButton
              v-if="store.step > 1"
              variant="ghost"
              :disabled="busy"
              @click="store.step--"
            >
              {{ t('common.back') }}
            </BaseButton>
          </template>
          <template #end>
            <BaseButton variant="secondary" :disabled="busy" @click="onSaveDraft">
              {{ t('common.saveDraft') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              :loading="busy"
              :disabled="policyBlocksNext"
              @click="onNext"
            >
              {{ isLastStep ? t('common.submit') : t('common.next') }}
            </BaseButton>
          </template>
        </FormActions>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.banner {
  margin-bottom: var(--space-4);
}
</style>
