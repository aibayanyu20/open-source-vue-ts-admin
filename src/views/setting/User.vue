<template>
  <div>
    <el-form
      ref="refForm"
      :inline="true"
      :model="formData"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item prop="username">
        <el-input
          v-model="formData.username"
          placeholder="账号搜索"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="formData.status"
          style="width: 100px"
          placeholder="状态"
        >
          <el-option
            label="禁用"
            value="0"
          />
          <el-option
            label="启用"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          @click="resetForm"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-button
      type="success"
      size="small"
      style="width: 120px;margin-bottom: 10px;"
      plain
      @click="createUser"
    >
      创建用户
    </el-button>
    <el-table
      v-loading="tableLoading"
      :data="userData"
      style="width: 100%"
      stripe
    >
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="50"
      />
      <el-table-column
        prop="username"
        label="用户账号"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        prop="mobile"
        show-overflow-tooltip
        label="手机号"
      />
      <el-table-column
        prop="email"
        show-overflow-tooltip
        label="邮箱"
      />
      <el-table-column
        prop="roles"
        show-overflow-tooltip
        label="权限"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="(item,index) in scope.row.roles"
            :key="'role_tag_'+index"
          >
            {{ item.role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="last_login_ip"
        label="最后登录ip"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        prop="last_login_time"
        label="最后登录时间"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        prop="expire_time"
        label="过期时间"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="canDel(scope.row.id)"
            @click="editUser(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            :disabled="canDel(scope.row.id)"
            type="text"
            size="small"
            :style="canDel(scope.row.id)?'':'color:red'"
            @click.native.prevent="deleteRow(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="paginationInfo.page"
      :page-sizes="pageSizes"
      :page-size="paginationInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationInfo.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <add-edit-model
      :edit="eddEdit"
      :visible="addEditModelDialog"
      :data="addEditFormData"
      @close="addEditHandleClose"
    />
  </div>
</template>

<script lang="ts">
import AddEditModel from '@/views/setting/components/user/AddEditModel.vue'
import { Component, Mixins, Ref } from 'vue-property-decorator'
import { CommonMixins } from '@/mixins/common'
import { ElForm } from 'element-ui/types/form'
import { getUsersData, delUser } from '@/api/user'
import { UserModule } from '@/store/modules/user'
@Component({
  name: 'settingUser',
  components: {
    AddEditModel
  }
})
export default class User extends Mixins(CommonMixins) {
  private formData = {
    username: '',
    status: ''
  }

  private tableLoading = false

  async created() {
    await this.__init()
  }

  public canDel(id:number) {
    // 判断当前登录的用户的id是否和当前库存的一致
    return (UserModule.userInfo as any).id === id
  }

  async __init() {
    this.tableLoading = true
    try {
      const { data } = await getUsersData({ ...this.formData, ...this.paginationInfo })
      const { total, list } = data
      this.paginationInfo.total = total
      this.userData = list
    } catch (e) {
      console.log('user fail')
    }
    this.tableLoading = false
  }

  @Ref('refForm') readonly refForm!:ElForm
  /**
   * 搜索提交
   * @private
   */
  private async onSubmit() {
    this.paginationInfo.page = 1
    await this.__init()
  }

  /**
   * 重置表单
   * */
  private async resetForm() {
    this.refForm.resetFields()
    this.paginationInfo.page = 1
    await this.__init()
  }

  /**
   * 用户数据
   */
  private userData:object[] = []

  /**
   * 删除用户的数据
   */
  private async deleteRow(id:number) {
    this.tableLoading = true
    try {
      await delUser(id)
      this.$message.success('删除成功')
      await this.__init()
    } catch (e) {
      console.log('del User fail')
      this.tableLoading = false
    }
  }

  /**
   * 页面配置数据
   */

  private async handleSizeChange(val:number) {
    this.paginationInfo.limit = val
    await this.__init()
  }

  private async handleCurrentChange(val:number) {
    this.paginationInfo.page = val
    await this.__init()
  }

  /**
   * 创建用户
   */
  private addEditModelDialog:boolean = false
  private addEditFormData:object = {}
  private eddEdit:boolean = false

  private createUser() {
    // 显示当前的弹出层
    if (this.addEditModelDialog) {
      this.addEditModelDialog = false
    }
    this.addEditModelDialog = true
  }

  // 定义隐藏当前的数据
  private addEditHandleClose(event:string) {
    // 将数据初始化为之前的状态
    this.eddEdit = false
    this.addEditFormData = {}
    this.addEditModelDialog = false
    if (event === 'submit') {
      this.paginationInfo.page = 1
      this.__init()
    }
  }

  // 编辑用户的数据
  private editUser(data:any) {
    this.eddEdit = true
    this.addEditFormData = data
    if (this.addEditModelDialog) {
      this.addEditModelDialog = false
    }
    this.addEditModelDialog = true
  }
}
</script>

<style lang="scss" scoped>
.el-pagination{
  margin-top: 20px;
  float: right;
}
</style>
