<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">添加</el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>

  </div>
</template>

<script>
import subject from '@/api/edu/subject'
export default {

  data() {
    return {
      filterText: '',
      subjectList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  //监听上面文本框搜索
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val)
    }
  },

  created() {
    this.fetchNodeList()
  },

  methods: {
    fetchNodeList() {
      subject.getNestedTreeList().then(response => {
        if (response.success === true) {
          this.subjectList = response.data.subjectList
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    remove(node, data){
         console.log(node)
        console.log(data)

        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            return subject.removeById(data.id)
        }).then(() => {
            // this.fetchNodeList()// 刷新列表
            this.$refs.subjectTree.remove(node) // 删除节点（效率高）
            this.$message({
                type: 'success',
                message: '删除成功!'
            })
        }).catch((response) => { // 失败
            if (response === 'cancel') {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '删除失败'
                })
            }
        })
    }
  }
}
</script>