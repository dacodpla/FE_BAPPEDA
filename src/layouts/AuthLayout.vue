<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="auth-layout">
    <div class="brand-panel">
      <div class="brand-mark">SP</div>
      <h1 class="brand-name">{{ t('app.name') }}</h1>
      <p class="brand-sub">{{ t('auth.loginSubtitle') }}</p>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.brand-panel {
  background: linear-gradient(160deg, var(--color-brand-navy), var(--color-brand-navy-dark));
  color: var(--color-text-inverse);
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-3);
}
.brand-mark {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-card);
  background-color: var(--color-inverse-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
}
.brand-name {
  font-size: var(--text-page-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-inverse);
}
.brand-sub { color: var(--color-text-inverse); opacity: 0.85; max-width: 380px; }

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background-color: var(--color-bg-page);
}

@media (max-width: 900px) {
  .auth-layout { grid-template-columns: 1fr; }
  .brand-panel { padding: var(--space-6); min-height: 180px; }
}
</style>
