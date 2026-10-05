<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { itemsFor } from '@/constants/navigation'

const { t } = useI18n()
const auth = useAuthStore()

const items = computed(() => (auth.role ? itemsFor(auth.role, { mobileOnly: true }) : []))
</script>

<template>
  <nav class="bottom-nav" :aria-label="t('nav.dashboard')">
    <RouterLink
      v-for="item in items"
      :key="item.key"
      :to="item.to"
      class="item"
    >
      <component :is="item.mobileIcon || item.icon" :size="20" aria-hidden="true" />
      <span class="label">{{ t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  z-index: 20;
}
.item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--text-label);
  text-decoration: none;
  min-height: 44px;
}
.item.router-link-active { color: var(--color-brand-navy); }
.label { font-weight: var(--font-weight-medium); }
</style>
