<template>
  <el-dropdown
    id="size-select"
    trigger="click"
    @command="handleSetSize"
  >
    <div>
      <svg-icon
        class="size-icon"
        name="size"
      />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size===item.value"
        :command="item.value"
      >
        {{
          item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TagsViewModule } from '@/store/modules/tags-view'

@Component({
  name: 'SizeSelect'
})
export default class extends Vue {
  private sizeOptions = [
    { label: '默认大小', value: 'default' },
    { label: '正常字号', value: 'medium' },
    { label: '中等字号', value: 'small' },
    { label: '超小字号', value: 'mini' }
  ]

  get size() {
    return AppModule.size
  }

  private handleSetSize(size: string) {
    (this as any).$ELEMENT.size = size
    AppModule.SetSize(size)
    this.refreshView()
    this.$message({
      message: '切换字号成功',
      type: 'success'
    })
  }

  private refreshView() {
    // In order to make the cached page re-rendered
    TagsViewModule.delAllCachedViews()
    const { fullPath } = this.$route
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      }).catch(err => {
        console.warn(err)
      })
    })
  }
}
</script>
