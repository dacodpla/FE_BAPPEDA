<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Bell } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const titleKey = computed(() => route.meta?.titleKey || 'app.name')
</script>

<template>
  <header class="mobile-header">
    <div class="brand">
      <div class="brand-mark">SP</div>
      <div class="brand-text">
        <span class="brand-name">{{ t('app.name') }}</span>
        <span class="page-title">{{ t(titleKey) }}</span>
      </div>
    </div>
    <button type="button" class="icon-btn" :aria-label="t('nav.notifications')">
      <Bell :size="18" aria-hidden="true" />
    </button>
  </header>
</template>

<style scoped>
.mobile-header {
  height: var(--header-height);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  position: sticky;
  top: 0;
  z-index: 20;
}
.brand { display: flex; align-items: center; gap: var(--space-3); }
.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-input);
  background-color: var(--color-brand-navy);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--text-small);
}
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-name { font-size: var(--text-label); color: var(--color-text-muted); text-transform: uppercase; }
.page-title { font-size: var(--text-card-title); font-weight: var(--font-weight-semibold); }
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-input);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
