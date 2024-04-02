<template>
  <div class="w-full h-full flex">
    <Navigation @onResize="handleNavigationResize" :expanded="expanded" />
    <div :style="getContentStyles" id="content">
      <ErrorPage v-if="error" />
      <PageLoader v-else-if="loading" />
      <router-view class="page" v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { mutations } from '@/store'
import { getProjectWithUsersAndIssues } from '@/graphql/queries/project'
import Navigation from '@/components/Navigation/Navigation.vue'
import PageLoader from '@/components/Loader.vue'
import ErrorPage from '@/components/ErrorPage.vue'
export default defineComponent({
  components: {
    Navigation,
    PageLoader,
    ErrorPage
  },
  setup() {
    console.log("Now route in project")

    const { loading, result, error, onError } = useQuery(
      getProjectWithUsersAndIssues,
      {},
    );
    const expanded = ref<boolean>(true)
    const handleNavigationResize = (isExpanded: boolean) => {
      expanded.value = isExpanded
    }

    const getContentStyles = computed(() => ({
      'padding-left': `${expanded.value ? 240 : 20}` + 'px',
      'margin-left': '64px'
    }))

    const match = window.matchMedia('(max-width: 1100px)')
    const matchHandler = (e: MediaQueryListEventInit) => (expanded.value = !e.matches)

    matchHandler(match)
    match.addListener(matchHandler)
    console.log("before useQuery", getProjectWithUsersAndIssues)

    watch(result, (value) => {
      console.log("value from watch", value)
      mutations.setProject(value.getProjectWithUsersAndIssues);
    })

    onError(err => {
      console.log("err while fetching project", err)
    })

    return {
      loading,
      error,
      expanded,
      handleNavigationResize,
      getContentStyles
    }
  }
})
</script>
