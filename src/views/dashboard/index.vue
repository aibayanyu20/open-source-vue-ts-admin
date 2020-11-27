<template>
  <div>
    Hello World
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Dashboard',
  components: {
  }
})
export default class extends Vue {
  get roles() {
    return UserModule.roles
  }

  created() {
  }
}
</script>

<style>
</style>
