<template>
  <div class="app-container">
    <!-- 搜素表单 -->
    <el-form :inline="true">
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="queryParams.prodDate"
          type="date"
          placeholder="选择日期"
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

      <!-- 数据表格 -->
      <el-table
        v-loading='loading'
        :data='ppmList'
        row-key='ppmId'
        border
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
    </el-form>
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
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 查询PPM列表
    getList() {
      this.loading = true
      listPPM(this.queryParams).then(response => {
        this.ppmList = response.rows
        this.loading = false
      })
    },
    handleQuery () {

    },
    handleAdd () {

    }
  }
}
</script>

<style scoped>

</style>
