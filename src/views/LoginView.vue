<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import FormField from '@/components/base/FormField.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useFormErrors } from '@/composables/useFormErrors'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { errors, generalError, setFromApi, clear } = useFormErrors()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const emailRef = ref(null)
const passwordRef = ref(null)

onMounted(() => {
  emailRef.value?.$el?.focus?.()
})

function clientValidate() {
  const next = {}
  if (!form.email.trim()) next.email = t('validation.required')
  else if (!/.+@.+\..+/.test(form.email)) next.email = t('validation.email')
  if (!form.password) next.password = t('validation.required')
  errors.value = next
  return Object.keys(next).length === 0
}

async function onSubmit() {
  clear()
  if (!clientValidate()) {
    await nextTick()
    focusFirstError()
    return
  }
  loading.value = true
  try {
    await auth.login(form.email.trim(), form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.replace(redirect)
  } catch (err) {
    setFromApi(err)
    await nextTick()
    focusFirstError()
  } finally {
    loading.value = false
  }
}

function focusFirstError() {
  if (errors.value.email) emailRef.value?.$el?.focus?.()
  else if (errors.value.password) passwordRef.value?.$el?.focus?.()
}
</script>

<template>
  <AuthLayout>
    <div class="login-panel">
      <BaseCard>
        <template #header>
          <div class="stack-2">
            <h2 class="title">{{ t('auth.loginTitle') }}</h2>
            <p class="subtitle">{{ t('auth.loginSubtitle') }}</p>
          </div>
        </template>

        <form class="stack-4" novalidate @submit.prevent="onSubmit">
          <div v-if="generalError" class="general-error" role="alert">
            {{ generalError.message || t('errors.generic') }}
          </div>

          <FormField
            id="login-email"
            :label="t('auth.email')"
            :error="errors.email"
            required
          >
            <template #default="{ bindings }">
              <BaseInput
                ref="emailRef"
                v-model="form.email"
                type="email"
                autocomplete="username"
                :placeholder="t('auth.emailPlaceholder')"
                v-bind="bindings"
              />
            </template>
          </FormField>

          <FormField
            id="login-password"
            :label="t('auth.password')"
            :error="errors.password"
            required
          >
            <template #default="{ bindings }">
              <BaseInput
                ref="passwordRef"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                :placeholder="t('auth.passwordPlaceholder')"
                v-bind="bindings"
              />
            </template>
          </FormField>

          <BaseButton type="submit" variant="primary" :loading="loading" block>
            {{ t('auth.signInButton') }}
          </BaseButton>
        </form>
      </BaseCard>
    </div>
  </AuthLayout>
</template>

<style scoped>
.login-panel {
  width: 100%;
  max-width: 420px;
}
.title {
  font-size: var(--text-section-title);
  font-weight: var(--font-weight-semibold);
}
.subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}
.general-error {
  padding: var(--space-3);
  border: 1px solid var(--color-danger);
  background-color: var(--color-danger-soft);
  color: var(--color-on-danger-soft);
  border-radius: var(--radius-input);
  font-size: var(--text-small);
}
</style>
