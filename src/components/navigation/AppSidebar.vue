<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { LogOut, Plus } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { itemsFor } from '@/constants/navigation'

const props = defineProps({
  collapsed: { type: Boolean, default: false },
})
void props

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

const items = computed(() => (auth.role ? itemsFor(auth.role) : []))

async function onLogout() {
  await auth.logout()
  router.replace('/login')
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="brand">
      <div class="brand-mark">SP</div>
      <div v-if="!collapsed" class="brand-text">
        <div class="brand-name">{{ t('app.name') }}</div>
        <div class="brand-sub">{{ t('app.tagline') }}</div>
      </div>
    </div>

    <div class="cta">
      <BaseButton
        variant="primary"
        :block="!collapsed"
        :size="collapsed ? 'sm' : 'md'"
        to="/requests/new"
        :aria-label="t('nav.newRequest')"
      >
        <Plus :size="16" aria-hidden="true" />
        <span v-if="!collapsed">{{ t('nav.newRequest') }}</span>
      </BaseButton>
    </div>

    <nav class="nav" :aria-label="t('nav.dashboard')">
      <RouterLink
        v-for="item in items"
        :key="item.key"
        :to="item.to"
        class="nav-item"
        :title="collapsed ? t(item.labelKey) : undefined"
      >
        <component :is="item.icon" :size="18" aria-hidden="true" />
        <span v-if="!collapsed">{{ t(item.labelKey) }}</span>
      </RouterLink>
    </nav>

    <div class="footer">
      <button
        type="button"
        class="nav-item logout"
        :title="collapsed ? t('nav.logout') : undefined"
        @click="onLogout"
      >
        <LogOut :size="18" aria-hidden="true" />
        <span v-if="!collapsed">{{ t('nav.logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  min-height: 100vh;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-4);
  gap: var(--space-5);
  position: sticky;
  top: 0;
}
.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
  align-items: center;
  padding: var(--space-5) var(--space-2);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
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
.brand-name { font-size: var(--text-card-title); font-weight: var(--font-weight-bold); color: var(--color-brand-navy); }
.brand-sub { font-size: var(--text-label); color: var(--color-text-secondary); }

.cta { width: 100%; }

.nav { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-input);
  color: var(--color-text-secondary);
  font-size: var(--text-body);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: background-color var(--transition-fast), color var(--transition-fast);
  width: 100%;
  text-align: left;
}
.sidebar.collapsed .nav-item { justify-content: center; padding: var(--space-3) 0; }
.nav-item:hover { background-color: var(--color-surface-alt); color: var(--color-text-primary); }
.nav-item.router-link-active {
  background-color: var(--color-light-blue);
  color: var(--color-brand-navy);
}
.logout { color: var(--color-text-secondary); background: none; border: none; cursor: pointer; }

.footer { border-top: 1px solid var(--color-border); padding-top: var(--space-3); width: 100%; }
</style>
