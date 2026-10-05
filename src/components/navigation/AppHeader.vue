<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Bell, HelpCircle, User, Menu } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  showMenuToggle: { type: Boolean, default: false },
})

defineEmits(['toggle-menu'])

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()

const titleKey = computed(() => route.meta?.titleKey || 'pageTitle.dashboard')
void props
</script>

<template>
  <header class="app-header">
    <div class="left">
      <button
        v-if="showMenuToggle"
        type="button"
        class="icon-btn"
        :aria-label="t('common.search')"
        @click="$emit('toggle-menu')"
      >
        <Menu :size="18" aria-hidden="true" />
      </button>
      <h1 class="title" tabindex="-1">{{ t(titleKey) }}</h1>
    </div>
    <div class="right">
      <slot name="actions" />
      <button type="button" class="icon-btn" :aria-label="t('nav.notifications')">
        <Bell :size="18" aria-hidden="true" />
      </button>
      <button type="button" class="icon-btn" :aria-label="t('nav.help')">
        <HelpCircle :size="18" aria-hidden="true" />
      </button>
      <div class="user" :aria-label="t('nav.profile')">
        <User :size="16" aria-hidden="true" />
        <span class="user-name">{{ auth.user?.name || '' }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  position: sticky;
  top: 0;
  z-index: 20;
}
.left { display: flex; align-items: center; gap: var(--space-3); }
.right { display: flex; align-items: center; gap: var(--space-3); }
.title {
  font-size: var(--text-section-title);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
.title:focus-visible { outline: none; }
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-input);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
}
.icon-btn:hover { background-color: var(--color-surface-alt); color: var(--color-text-primary); }
.user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-pill);
  background-color: var(--color-surface-alt);
  color: var(--color-text-primary);
  font-size: var(--text-small);
  font-weight: var(--font-weight-medium);
}
.user-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 767px) {
  .app-header { padding: 0 var(--space-4); }
  .user-name { display: none; }
}
</style>
