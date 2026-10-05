<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoint } from '@/composables/useBreakpoint'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import AppHeader from '@/components/navigation/AppHeader.vue'
import MobileHeader from '@/components/navigation/MobileHeader.vue'
import BottomNav from '@/components/navigation/BottomNav.vue'

const { isMobile, isTablet, isDesktop } = useBreakpoint()

const drawerOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (drawerOpen.value = false))
</script>

<template>
  <div class="app-layout" :class="{ mobile: isMobile }">
    <!-- Desktop sidebar -->
    <AppSidebar v-if="isDesktop" class="sidebar-slot" />

    <!-- Tablet: icon rail + optional drawer -->
    <AppSidebar v-else-if="isTablet && !drawerOpen" class="sidebar-slot" collapsed />
    <div v-else-if="isTablet && drawerOpen" class="drawer-overlay" @click.self="drawerOpen = false">
      <AppSidebar class="sidebar-slot drawer" />
    </div>

    <div class="main-col">
      <MobileHeader v-if="isMobile" />
      <AppHeader v-else :show-menu-toggle="isTablet" @toggle-menu="drawerOpen = !drawerOpen">
        <template v-if="$slots['header-actions']" #actions>
          <slot name="header-actions" />
        </template>
      </AppHeader>

      <main class="content">
        <div class="container">
          <slot />
        </div>
      </main>

      <BottomNav v-if="isMobile" />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
}
.app-layout.mobile { flex-direction: column; }

.sidebar-slot { flex-shrink: 0; }

.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--color-overlay);
  z-index: 30;
  display: flex;
}
.drawer {
  width: var(--sidebar-width);
  height: 100vh;
  box-shadow: var(--shadow-elevated);
}

.main-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content {
  flex: 1;
  padding: var(--space-6);
  background-color: var(--color-bg-page);
}
.container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 767px) {
  .content {
    padding: var(--space-4);
    padding-bottom: calc(var(--bottom-nav-height) + var(--space-4));
  }
}
</style>
