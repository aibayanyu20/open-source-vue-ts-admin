<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="600px"
    :title="edit?'编辑用户':'创建用户'"
    :close-on-click-modal="false"
    @close="handleClosed"
  >
    <el-form
      ref="refForm"
      v-loading="formLoading"
      :model="formData"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="用户账号"
            prop="username"
          >
            <el-input
              v-model="formData.username"
              placeholder="用户账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="账号状态"
            prop="status"
          >
            <el-switch
              v-model="formData.status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="用户密码"
            prop="password"
          >
            <el-input
              v-model="formData.password"
              placeholder="用户密码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="用户权限"
            prop="role"
          >
            <el-select
              v-model="formData.role"
              clearable
              collapse-tags
              multiple
            >
              <el-option
                v-for="item in roles"
                :key="'roles'+item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="用户邮箱"
            prop="email"
          >
            <el-input
              v-model="formData.email"
              placeholder="用户邮箱"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="用户手机"
            prop="mobile"
          >
            <el-input
              v-model="formData.mobile"
              placeholder="用户手机"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="dialogVisible = false"
      >取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="submitData"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch, Ref } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { createUser, editUser, getRoles } from '@/api/user'
@Component({
  components: {

  }
})
export default class AddEditModel extends Vue {
  // 控制当前的弹出层的显示与隐藏的状态
  @Prop({ type: Boolean, default: false }) visible!:Boolean
  // 编辑的时候才会有值
  @Prop({ type: Object, default: () => {} }) data?:Object
  // 判断是否为编辑
  @Prop({ type: Boolean, default: false }) edit!:Boolean

  @Watch('visible')
  changeVisible(newVal:boolean) {
    this.dialogVisible = newVal
    if (newVal) {
      this.getRoles()
    }
    this.$nextTick(() => {
      this.refForm.clearValidate()
    })
  }

  private formLoading:boolean = false

  // 权限部分获取
  private roles:object[] = [];

  // 获取权限的数据
  private async getRoles() {
    this.formLoading = true
    try {
      const { data } = await getRoles()
      this.roles = data
      if (this.edit) {
        this.formData = { ...this.formData, ...this.data, role: (this.data as any).roles.map((v:any) => v.rid) }
      }
    } catch (e) {
      console.log('get role fail')
    }
    this.formLoading = false
  }

  // 控制弹出框的状态
  private dialogVisible = false

  // 表单的ref
  @Ref('refForm') readonly refForm!:ElForm

  // 表单数据
  private formData = {
    username: '',
    password: '',
    role: '',
    mobile: '',
    email: '',
    status: 1
  }

  // 校验规则
  get rules() {
    if (this.edit) {
      return {
        username: [
          { min: 5, max: 20, message: '用户名长度不能低于5位且不超过20位', trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 20, message: '密码长度不能低于6位且不超过20位', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '至少给定一个权限', trigger: 'blur', type: 'array' }
        ]
      }
    } else {
      return {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户名长度不能低于5位且不超过20位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度不能低于6位且不超过20位', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '至少给定一个权限', trigger: 'blur', type: 'array' }
        ]
      }
    }
  }

  // 监听关闭当前的弹窗
  @Emit('close')
  private handleClosed(event = 'none'):string {
    this.dialogVisible = false
    this.refForm.resetFields()
    return event
  }

  // 提交代码
  private submitData() {
    this.refForm.validate(async(valid:boolean) => {
      if (valid) {
        this.formLoading = true
        // 验证通过，开始编辑或者创建用户
        try {
          if (this.edit) {
            // 当前是编辑数据
            await editUser((this.formData as any).id, { ...this.formData })
            this.$message.success('修改成功')
          } else {
            // 当前是创建用户
            await createUser({ ...this.formData })
            this.$message.success('添加成功')
          }
          this.handleClosed('submit')
        } catch (e) {
          console.log('fail create or update')
        }
        this.formLoading = false
      }
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
