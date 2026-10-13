<script setup>
import { useI18n } from 'vue-i18n'
import FormField from '@/components/base/FormField.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import TransportPicker from './TransportPicker.vue'
import { useTravelRequestStore } from '@/stores/travelRequest'

defineProps({
  /** { fieldName: message } from client validation or the API */
  errors: { type: Object, default: () => ({}) },
  /** Field name -> DOM id, shared with the view's focusFirst(). */
  ids: { type: Object, required: true },
})
const emit = defineEmits(['clear'])

const { t } = useI18n()
const store = useTravelRequestStore()
</script>

<template>
  <div class="stack-4">
    <FormField
      :id="ids.destination"
      :label="t('form.destination')"
      :error="errors.destination"
      required
    >
      <template #default="{ bindings }">
        <BaseInput
          v-model="store.form.destination"
          :placeholder="t('form.destinationPlaceholder')"
          v-bind="bindings"
          @update:model-value="emit('clear', 'destination')"
        />
      </template>
    </FormField>

    <div class="date-row">
      <FormField
        :id="ids.departDate"
        :label="t('form.departDate')"
        :error="errors.departDate"
        required
      >
        <template #default="{ bindings }">
          <BaseDatePicker
            v-model="store.form.departDate"
            v-bind="bindings"
            @update:model-value="emit('clear', 'departDate')"
          />
        </template>
      </FormField>
      <FormField
        :id="ids.returnDate"
        :label="t('form.returnDate')"
        :error="errors.returnDate"
        required
      >
        <template #default="{ bindings }">
          <BaseDatePicker
            v-model="store.form.returnDate"
            :min="store.form.departDate || undefined"
            v-bind="bindings"
            @update:model-value="emit('clear', 'returnDate')"
          />
        </template>
      </FormField>
    </div>

    <FormField :id="ids.purpose" :label="t('form.purpose')" :error="errors.purpose" required>
      <template #default="{ bindings }">
        <BaseTextarea
          v-model="store.form.purpose"
          :placeholder="t('form.purposePlaceholder')"
          v-bind="bindings"
          @update:model-value="emit('clear', 'purpose')"
        />
      </template>
    </FormField>

    <FormField :id="ids.transport" :label="t('form.transport')" :error="errors.transport" required>
      <template #default="{ bindings }">
        <TransportPicker
          v-model="store.form.transport"
          v-bind="bindings"
          @update:model-value="emit('clear', 'transport')"
        />
      </template>
    </FormField>
  </div>
</template>

<style scoped>
.date-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
@media (min-width: 768px) {
  .date-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
