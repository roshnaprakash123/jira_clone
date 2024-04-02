<template>
  <div id="root">
    <Modals />
    <Login v-if="!isAppReady" />
    <PageLoader v-if="!isAppReady" />
    <div id="app-frame">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref, computed } from 'vue'
import Navigation from '@/components/Navigation/Navigation.vue'
import PageLoader from '@/components/Loader.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import Modals from '@/components/Modals/Modals.vue'
import { getters } from './store'
import Login from './views/Auth.vue'
export default defineComponent({
  components: {
    Navigation,
    PageLoader,
    ErrorPage,
    Modals,
    Login
  },
  setup() {
    const expanded = ref<boolean>(true)
    const handleNavigationResize = (isExpanded: boolean) => {
      expanded.value = isExpanded
    }

    const isAppReady = computed(() => getters.isAuthenticated() && Object.keys(getters.currentUser()).length !== 0)

    const getContentStyles = computed(() => ({
      'padding-left': `${expanded.value ? 240 : 20}` + 'px',
      'margin-left': '64px'
    }))

    const match = window.matchMedia('(max-width: 1100px)')
    const matchHandler = (e: MediaQueryListEventInit) =>
      (expanded.value = !e.matches)

    matchHandler(match)
    match.addListener(matchHandler)


    return {
      isAppReady,
      expanded,
      handleNavigationResize,
      getContentStyles
    }
  }
})
</script>
