<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import FormField from '@/components/base/FormField.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { useLocale, SUPPORTED_LOCALES } from '@/composables/useLocale'

const { t } = useI18n()
const { locale, setLocale } = useLocale()

const options = computed(() =>
  SUPPORTED_LOCALES.map((value) => ({ value, label: t(`settings.${value}`) })),
)
</script>

<template>
  <AppLayout>
    <BaseCard :title="t('pageTitle.settings')">
      <div class="narrow">
        <FormField
          id="setting-language"
          :label="t('settings.language')"
          :hint="t('settings.languageHint')"
        >
          <template #default="{ bindings }">
            <BaseSelect
              :model-value="locale"
              :options="options"
              v-bind="bindings"
              @update:model-value="setLocale"
            />
          </template>
        </FormField>
      </div>
    </BaseCard>
  </AppLayout>
</template>

<style scoped>
.narrow {
  max-width: 360px;
}
</style>
