<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layouts/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { Plane } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
</script>

<template>
  <AppLayout>
    <div class="stack-6">
      <BaseCard>
        <div class="stack-2">
          <h2>{{ t('pageTitle.dashboard') }}</h2>
          <p class="text-secondary">
            {{ auth.user?.name }} — {{ auth.user?.role }}
          </p>
        </div>
      </BaseCard>
      <BaseCard>
        <EmptyState :icon="Plane" :title="t('empty.noData')" :description="t('empty.noDataDescription')">
          <BaseButton variant="primary" to="/requests/new">{{ t('nav.newRequest') }}</BaseButton>
        </EmptyState>
      </BaseCard>
    </div>
  </AppLayout>
</template>
