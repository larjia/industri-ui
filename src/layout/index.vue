<template>
  <div :class="classObj" class="app-wrapper">
    <!-- sidebar here -->
    <sidebar class="sidebar-container"/>
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <!-- navbar here -->
        <navbar />
        <!-- tags-view here -->
        <tags-view v-if="needTagsView"/>
      </div>
      <!-- main app here -->
      <app-main/>
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, TagsView, Sidebar } from './components'

import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    TagsView,
    Sidebar
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background-color: azure;
}

</style>
