<template>
  <div class="app-container">
    <!-- 搜素表单 -->
    <el-form :inline="true">
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="queryParams.prodDate"
          type="date"
          placeholder="选择日期"
          size="small"
        />
      </el-form-item>
      <el-form-item label="物料号">
        <el-select v-model="queryParams.partNumber" placeholder="物料号" clearable size="small">
          <el-option
            v-for="part in partOptions"
            :key="part.partId"
            :label="part.partNumber"
            :value="part.partNumber"
          />
        </el-select>
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
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      v-loading='loading'
      :data='ppmList'
      row-key='ppmId'
      border
      stripe
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="prodDate" label="生产日期" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.prodDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="partNumber" label="物料号" width="130"></el-table-column>
      <el-table-column prop="operator" label="操作员" width="80"></el-table-column>
      <el-table-column prop="shift" label="班次" width="50"></el-table-column>
      <el-table-column prop="prodDept" label="车间部门" width="100"></el-table-column>
      <el-table-column prop="prodSFGroup" label="班组" width="100"></el-table-column>
      <el-table-column prop="prodSFOp" label="工序" width="100"></el-table-column>
      <el-table-column prop="qtyCompleted" label="完成数" width="60"></el-table-column>
      <el-table-column prop="qtyRejected" label="不良数" width="60"></el-table-column>
      <el-table-column prop="qtyScrapped" label="报废数" width="60"></el-table-column>
      <el-table-column prop="qtyAccepted" label="合格数" width="60"></el-table-column>
      <el-table-column prop="ppm" label="PPM" width="80"></el-table-column>
      <el-table-column prop="ftq" label="FTQ" width="80"></el-table-column>
    </el-table>

    <!-- 添加或修改报工对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" :close-on-press-escape="false" width="900px" class="dialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- 表单行-生产日期 -->
        <el-row>
          <el-col :span="16">
            <el-form-item label="生产日期" prop="prodDate">
              <el-date-picker
                v-model="form.prodDate"
                type="date"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="">
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-物料号 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="物料号" prop="partNumber">
              <!-- <el-select v-model="form.partNumber" placeholder="物料号" clearable size="small">
                <el-option
                  v-for="part in partOptions"
                  :key="part.partId"
                  :label="part.partNumber"
                  :value="part.partNumber"
                />
              </el-select> -->
              <el-input
                v-model="form.partNumber"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="描述">
              <el-input
                clearable
                size="small"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-车间班组工序 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产车间" prop="prodDept">
              <el-select v-model="form.prodDept" placeholder="生产车间" clearable size="small">
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.deptId"
                  :label="dept.deptName"
                  :value="dept.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组" prop="prodSFGroup">
              <el-select v-model="form.prodSFGroup" placeholder="班组" clearable size="small">
                <el-option
                  v-for="group in groupOptions"
                  :key="group.groupId"
                  :label="group.groupName"
                  :value="group.groupId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工序" prop="prodSFOp">
              <el-select v-model="form.prodSFOp" placeholder="工序" clearable size="small">
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.deptId"
                  :label="dept.deptName"
                  :value="dept.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单行-班次 操作员 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作员" prop="operator">
              <el-select v-model="form.operator" placeholder="选择操作员" clearable size="small">
                <el-option
                  v-for="operator in operatorOptions"
                  :key="operator.id"
                  :label="operator.name"
                  :value="operator.id"
                />
              </el-select>
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
          <el-col :span="8">
            <el-form-item label="合格数" prop="qtyAccepted">
              <el-input
                v-model='qtyAccepted'
                clearable
                size="small"
                readonly
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPPM } from '@/api/production/quality/ppm/ppm'

export default {
  name: 'ProdPPM',
  data () {
    return {
      // 遮罩层
      loading: false,
      // 表格数据
      ppmList: [],
      // 物料数据
      partOptions: [],
      // 查询参数
      queryParams: {
        prodDate: undefined,
        partNumber: undefined
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    }
  },
  created () {
    this.getList()
  },
  filters: {
    perDisp (value) {
      let res = value ? (parseFloat((value * 100).toFixed(2)) + '%') : value
      return res
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
        return Number(1000000 * (this.form.qtyRejected + this.form.qtyScrapped) / this.form.qtyCompleted).toFixed(0)
      }
      return ''
    }
  },
  methods: {
    // 查询PPM列表
    getList () {
      this.loading = true
      listPPM(this.queryParams).then(response => {
        this.ppmList = response.rows
        this.loading = false
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
    // 搜索按钮操作
    handleQuery () {
    },
    // 新增按钮操作
    handleAdd (row) {
      this.reset()
      if (row != undefined) {

      }
      this.open = true
      this.title = '新增报工记录'
    },
    submitForm () {

    },
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
  width: 205px;
}

.el-date-editor {
  width: 205px;
}
</style>
