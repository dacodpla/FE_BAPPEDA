<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  /** [{ key, label }] */
  steps: { type: Array, required: true },
  /** 1-based current step */
  current: { type: Number, required: true },
})

const { t } = useI18n()
const { isMobile } = useBreakpoint()

const mobileLabel = computed(() =>
  `Langkah ${props.current} dari ${props.steps.length}`,
)
const currentStep = computed(() => props.steps[props.current - 1])
void t
</script>

<template>
  <div class="step-indicator">
    <div v-if="isMobile" class="mobile">
      <span class="mobile-count">{{ mobileLabel }}</span>
      <span class="mobile-title">{{ currentStep?.label }}</span>
    </div>
    <ol v-else class="steps">
      <li
        v-for="(step, i) in steps"
        :key="step.key"
        class="step"
        :class="{
          done: i + 1 < current,
          active: i + 1 === current,
        }"
      >
        <span class="marker">
          <Check v-if="i + 1 < current" :size="14" aria-hidden="true" />
          <span v-else>{{ i + 1 }}</span>
        </span>
        <span class="label">{{ step.label }}</span>
        <span v-if="i < steps.length - 1" class="line" aria-hidden="true" />
      </li>
    </ol>
  </div>
</template>

<style scoped>
.steps {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-small);
  font-weight: var(--font-weight-semibold);
}
.marker {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}
.line {
  width: 40px;
  height: 1px;
  background-color: var(--color-border);
  margin: 0 var(--space-2);
}
.step.active .marker {
  background-color: var(--color-brand-navy);
  color: var(--color-text-inverse);
  border-color: var(--color-brand-navy);
}
.step.active .label { color: var(--color-text-primary); }
.step.done .marker {
  background-color: var(--color-success);
  color: var(--color-text-inverse);
  border-color: var(--color-success);
}
.step.done .label { color: var(--color-text-secondary); }

.mobile {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.mobile-count {
  font-size: var(--text-label);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.mobile-title {
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-semibold);
}
</style>
