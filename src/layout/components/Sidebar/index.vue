<template>
  <div :class="{'has-logo': showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'

export default {
  name: 'Sidebar',
  components: { Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>

</style>
