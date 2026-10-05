import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const MOBILE_MAX = 768
const TABLET_MAX = 1024

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
  const onResize = () => (width.value = window.innerWidth)

  onMounted(() => window.addEventListener('resize', onResize))
  onBeforeUnmount(() => window.removeEventListener('resize', onResize))

  return {
    width,
    isMobile: computed(() => width.value < MOBILE_MAX),
    isTablet: computed(() => width.value >= MOBILE_MAX && width.value < TABLET_MAX),
    isDesktop: computed(() => width.value >= TABLET_MAX),
  }
}
