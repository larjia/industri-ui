<template>
  <div class="app-container">
    <!-- 搜素表单 -->
    <el-form :inline="true">
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="queryParams.prodDate"
          type="date"
          placeholder="选择日期"
          clearable
          size="small"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="物料号">
        <!-- <el-select v-model="queryParams.partNumber" placeholder="物料号" clearable size="small">
          <el-option
            v-for="part in partOptions"
            :key="part.partId"
            :label="part.partNumber"
            :value="part.partNumber"
          />
        </el-select> -->
        <el-input
          v-model="queryParams.partNumber"
          type="text"
          size="small"
          clearable
          placeholder="输入物料号"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled='single'
          @click="handleUpdate"
        >修改</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled='single'
          @click="handleDelete"
        >删除</el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
        >导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      v-loading='loading'
      :data='reportHistList'
      row-key='id'
      border
      stripe
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="prodDate" label="生产日期" width="110">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.prodDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="partNumber" label="物料号" width="140"></el-table-column>
      <el-table-column prop="operator" label="操作员" width="90"></el-table-column>
      <el-table-column prop="shift" label="班次" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.shift | shiftDisp }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prodDept" label="车间部门" width="100"></el-table-column>
      <el-table-column prop="prodSFGroup" label="班组" width="110"></el-table-column>
      <el-table-column prop="prodSFOp" label="工序" width="120"></el-table-column>
      <el-table-column prop="qtyCompleted" label="完成数" width="80"></el-table-column>
      <el-table-column prop="qtyRejected" label="不良数" width="80"></el-table-column>
      <el-table-column prop="qtyScrapped" label="报废数" width="80"></el-table-column>
      <el-table-column prop="qtyAccepted" label="合格数" width="80"></el-table-column>
      <el-table-column prop="ppm" label="PPM" width="80"></el-table-column>
      <el-table-column prop="ftq" label="FTQ" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ftq | perDisp }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-show="false">
        <template slot-scope="scope">
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click='handleDelete(scope.row)'
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show='total > 0'
      :total='total'
      :page.sync='queryParams.pageNum'
      :limit.sync='queryParams.pageSize'
      @pagination='getReportHistList'
    />

    <!-- 添加或修改报工对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" :close-on-press-escape="false" 
      width="1000px" class="dialog" top="3vh !important">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- 表单行-生产日期 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产日期" prop="prodDate">
              <el-date-picker
                v-model="form.prodDate"
                type="date"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="工作时间">
              <el-time-select
                v-model="form.startTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                size="small"
                placeholder="起始时间"
              />
              <el-time-select
                v-model="form.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                size="small"
                placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-物料号 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="partProjName">
              <!-- <el-select v-model="form.partNumber" placeholder="物料号" clearable size="small">
                <el-option
                  v-for="part in partOptions"
                  :key="part.partId"
                  :label="part.partNumber"
                  :value="part.partNumber"
                />
              </el-select> -->
              <el-select 
                v-model="form.partProjName" 
                value-key="id" 
                filterable 
                clearable
                size="small" 
                placeholder="请选择" 
                @change="partSelectionChanged">
                <el-option
                  v-for="item in partOptions"
                  :key="item.id"
                  :label="item.partProjName"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ERP编码" prop="partNumber">
              <el-input
                v-model="form.partNumber"
                size="small"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="零件名称" prop="componentName">
              <el-select v-model="form.componentName" size="small" placeholder="请选择">
                <el-option
                  v-for="item in componentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批序号" prop="serialNumber">
              <el-input
                v-model="form.serialNumber"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-车间班组工序 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产车间" prop="prodDept">
              <el-select v-model="form.prodDept" value-key="deptId" placeholder="生产车间" clearable size="small" @change='deptSelectionChanged($event)'>
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.deptId"
                  :label="dept.deptName"
                  :value="dept"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组" prop="prodSFGroup">
              <el-select v-model="form.prodSFGroup" value-key="groupId" placeholder="班组" clearable size="small" @change="groupSelectionChanged($event)">
                <el-option
                  v-for="group in groupOptions"
                  :key="group.groupId"
                  :label="group.groupName"
                  :value="group"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工序" prop="prodSFOp">
              <el-select v-model="form.prodSFOp" value-key="operationId" placeholder="工序" clearable size="small">
                <el-option
                  v-for="op in opOptions"
                  :key="op.operationId"
                  :label="op.operationName"
                  :value="op"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if='showReason' :span="6">
            <el-form-item label="不良原因" prop="rejectReason">
              <el-select v-model="form.rejectReason" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="reason in rejectReasons"
                  :key="reason.label"
                  :label="reason.label"
                  :value="reason.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-班次 操作员 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作员" prop="operator">
              <!-- <el-select v-model="form.operator" placeholder="选择操作员" size="small">
                <el-option
                  v-for="operator in operatorOptions"
                  :key="operator.id"
                  :label="operator.name"
                  :value="operator.id"
                />
              </el-select> -->
              <el-input
                v-model="form.operator"
                placeholder="操作员姓名"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="班次" prop="shift">
              <!-- <el-select v-model="form.shift" placeholder="选择班次" clearable size="small">
                <el-option
                  v-for="shift in shiftOptions"
                  :key="shift.id"
                  :label="shift.name"
                  :value="shift.id"
                />
              </el-select> -->
              <template>
                <el-radio v-model="form.shift" label="0">白班</el-radio>
                <el-radio v-model="form.shift" label="1">夜班</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-完成数 合格数 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="完成数" prop="qtyCompleted">
              <el-input-number
                v-model="form.qtyCompleted"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-不良数 FTQ -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="不良数" prop="qtyRejected">
              <el-input-number
                v-model="form.qtyRejected"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-报废数 PPM -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="报废数" prop="qtyScrapped">
              <el-input-number
                v-model="form.qtyScrapped"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="needReason" label="不良原因" prop="reason">
              <el-select v-model="form.rejectReason" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="reason in rejectReasons"
                  :key="reason.label"
                  :label="reason.label"
                  :value="reason.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="合格数" prop="qtyAccepted">
              <el-input
                v-bind:value='qtyAccepted'
                clearable
                size="small"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="FTQ" prop="ftq">
              <el-input
                v-bind:value='ftq | perDisp(ftq)'
                clearable
                size="small"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="PPM" prop="ppm">
              <el-input
                v-bind:value='ppm'
                clearable
                size="small"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitAndAdd">确定并继续</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReportHist, getReportHistById, addReportHist, updateReportHist, deleteReportHistById } from '@/api/production/report/prodreport'
import { listProdDept } from '@/api/system/dept'
import { listPart } from '@/api/masterdata/part'
import { listGroup } from '@/api/production/shopfloor/group/group'
import { listOperation } from '@/api/production/shopfloor/operation/operation'

export default {
  name: 'ProdReport',
  data () {
    /**
     * --- 字段 ---
     * 生产日期: form.prodDate
     * 开始时间: form.startTime
     * 结束时间: form.endTime
     * 产品名称: form.partProjName
     * 物料编码: form.partNumber
     * 零件名称: form.componentName
     * 批序号  : form.serialNumber
     * 生产车间: form.dept
     * 班组    : form.group
     * 工序    : form.op
     * 操作员  : form.operator
     * 班次    : form.shift
     * 不良原因: form.reason
     * 完成数  : form.qtyCompleted
     * 不良数  : form.qtyRejected
     * 报废数  : form.qtyScrapped
     * 合格数  : form.qtyAccepted
     * FTQ     : form.ftq
     * PPM     : form.ppm
     * 
     * --- 下拉框 ---
     * 产品名称: partOptions
     * 零件名称: componentOptions
     * 生产车间: deptOptions
     * 班组    : groupOptions
     * 工序    : opOptions
     * 原因    : reasonOptions
     */
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      reportHistList: [],
      // 物料数据
      partOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        prodDate: undefined,
        partNumber: undefined
      },
      // 部门列表
      deptOptions: [],
      // 班组列表
      groupOptions: [],
      // 工序列表
      opOptions: [],
      // 员工列表
      operatorOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否需要选择不良原因
      needReason: true,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    }
  },
  created () {
    this.getReportHistList()
  },
  filters: {
    perDisp (value) {
      let res = value ? (parseFloat((value * 100).toFixed(2)) + '%') : value
      return res
    },
    shiftDisp (value) {
      return value === '0' ? '白班' : '夜班'
    }
  },
  computed: {
    qtyAccepted () {
      // get () {
        return this.form.qtyCompleted - this.form.qtyRejected - this.form.qtyScrapped
      // }
    },
    ftq () {
      if (this.form.qtyCompleted !== 0) {
        let res = parseFloat((this.qtyAccepted / this.form.qtyCompleted).toFixed(4))
        return res
      }
      return ''
    },
    ppm () {
      if (this.form.qtyCompleted !== 0) {
        let res = parseFloat((1000000 * (this.form.qtyRejected + this.form.qtyScrapped) / this.form.qtyCompleted).toFixed(0))
        return res
      }
      return ''
    }
  },
  methods: {
    /**
     * Index View的方法
     */
    // 获取生产报工列表
    getReportHistList () {
      this.loading = true
      listReportHist(this.queryParams).then(response => {
        this.reportHistList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 表格选择行变化
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 搜索按钮操作
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getReportHistList()
    },
    // 新增按钮操作
    handleAdd () {
      this.reset()
      this.getPartList()
      this.getDeptList()
      this.open = true
      this.title = '新增报工记录'
    },
    // 修改按钮操作
    handleUpdate (row) {
      this.reset()
      const id = row.id || this.ids
      getReportHistById(id).then(response => {
        this.getDeptList()
        this.form = response.data
        this.open = true
        this.title = '修改报工记录'
      })
    },
    // 删除按钮操作
    handleDelete (row) {
      const id = row.id || this.ids
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteReportHistById(id)
      }).then(() => {
        this.getReportHistList()
        this.msgSuccess('删除成功')
      }).catch(function () {})
    },

    /**
     * 新增或修改页面方法
     */
    // 获取产品名称 物料号
    getPartList () {
      listPart().then(response => {
        this.partOptions = response.rows
      })
    },
    // 产品名称选中值发生变化
    partSelectionChanged (part) {
      if (part) {
        this.form.partNumber = part.partNumber
      } else {
        this.form.partNumber = undefined
      }
    },
    // 获取零件名称俩表
    getComponentList () {

    },
    // 获取车间部门列表
    getDeptList () {
      listProdDept().then(response => {
        this.deptOptions = response.data
      })
    },
    // 部门选择值发生变化
    deptSelectionChanged (dept) {

    },
    // 班组选择值发生变化
    groupSelectionChanged (group) {

    },
    // 获取当前所选车间下的班组
    getGroups (dept) {
      // console.log(dept)
      // console.log(this.form.prodDept)
      // let dept = this.deptOptions.find((item) => {
      //   return item.deptName = name
      // })

      let query = {
        groupName: undefined,
        deptId: dept ? dept.deptId : -1
      }

      this.groupOptions = []
      listGroup(query).then(response => {
        this.groupOptions = response.rows
      })
    },
    // 获取当前所选班组下的工序
    getOperations (group) {
      let query = {
        operationName: undefined,
        groupId: group ? group.groupId : -1
      }
      this.opOptions = []
      listOperation(query).then(response => {
        this.opOptions = response.rows
      })
    },
    // 表单重置
    reset () {
      this.form = {
        prodDate: new Date(), // 默认当前日期
        shift: '0', // 默认白班
        qtyCompleted: 0,
        qtyRejected: 0,
        qtyScrapped: 0,
        // qtyAccepted: this.qtyAccepted
      };
      this.resetForm('form')
    },
    // 点击确定按钮
    submitForm () {
      // console.log(this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) { // 修改
            console.log(this.form)

            if (this.form.prodDept instanceof Object) {
              this.form.prodDept = this.form.prodDept.deptName
            }
            if (this.form.prodSFGroup instanceof Object) {
              this.form.prodSFGroup = this.form.prodSFGroup.groupName
            }
            if (this.form.prodSFOp instanceof Object) {
              this.form.prodSFOp = this.form.prodSFOp.operationName
            }
            this.form.qtyAccepted = this.qtyAccepted
            this.form.ppm = this.ppm
            this.form.ftq = this.ftq

            updateReportHist(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getReportHistList()
              } else {
                this.msgError(response.msg)
              }
            })

          } else { // 新增
            this.form.prodDept = this.form.prodDept.deptName
            this.form.prodSFGroup = this.form.prodSFGroup.groupName
            this.form.prodSFOp = this.form.prodSFOp.operationName
            this.form.qtyAccepted = this.qtyAccepted
            this.form.ppm = this.ppm
            this.form.ftq = this.ftq

            addReportHist(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getReportHistList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    }
  }
}
</script>

<style scoped>
.app-container ::v-deep .el-dialog__body {
  padding: 20px 25px 0 25px;
}

.app-container ::v-deep .el-dialog__header {
  padding: 15px 25px 10px 25px;
  background-color: #eee;
}

.app-container ::v-deep .el-dialog__headerbtn {
  top: 15px;
}

.app-container ::v-deep .el-dialog__footer {
  padding-left: 25px;
  padding-right: 25px;
}

.el-input-number--small {
  width: 210px;
}

/* .el-dialog {
  margin-top: 3vh !important;
} */

.el-dialog .el-input {
  width: 210px;
}

/* .el-date-editor {
  width: 205px;
} */

.el-date-editor+.el-date-editor {
  margin-left: 10px;
}

</style>
