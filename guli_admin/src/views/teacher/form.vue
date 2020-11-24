<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>

import teacher from "@/api/edu/teacher";

    export default{
        data () {
            return {
                teacher: {
                     name: '',
                     sort: 0,
                     level: 1,
                     career: '',
                     intro: '',
                     avatar: ''
                },
                saveBtnDisabled:false //不启用Disabled，保存按钮为亮色
            }
        },
        created() {//在加载的时候实现这个方法，可以调用这个根据id来查询方法
            //执行此方法，获取我们的参数
            if(this.$route.params && this.$route.params.id){//当加载页面的时候就要获取参数的值
                    this.selectById(this.$route.params.id)
            }   
        },
        methods: {

            //1.怎么判断是否是新增还是修改
            //2.根据teacher.id来判断

            saveOrUpdate(){

                //当点击按钮的时候，让保存按钮为浅色，不启用
                this.saveBtnDisabled=true

                if(this.teacher.id){
                    this.updateById()
                }else{
                    this.save()
                }

            },
            save(){
                teacher.save(this.teacher)
                .then(response=>{
                    return this.$message({
                        type: 'success',
                        message: '保存成功!'
                        })
                }).then(response=>{
                    this.$router.push({path:"/teacher/list"})
                })
                .catch(respone=>{
                     return this.$message({
                        type: 'error',
                        message: '保存失败!'
                        })
                })
            },
            updateById(){
                teacher.updateById(this.teacher)
                .then(response=>{
                    //修改提示
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                })
                .then(response=>{
                    this.$route.push({path:"/teacher/list"})
                })
                .catch(response=>{
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                })
            },
             selectById(id){
              teacher.selectById(id)
              .then(response=>{
                  this.teacher=response.data.teacher
              })
              .catch(response=>{
                  this.$message({
                      type:'error',
                      message:'获取失败'
                  })
              })
        }   
    }
    }
</script>