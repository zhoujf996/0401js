<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

        <el-form-item label="课程标题">
          <!-- v-model : 双向数据绑定； --> 
            <el-input v-model="courseInfo.eduCourse.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <!-- 一级分类 -->
        <el-form-item label="课程类别">
            <el-select
                @change="subjectLevelOneChanged"
                v-model="courseInfo.eduCourse.subjectParentId"
                placeholder="请选择">
                <el-option
                v-for="subject in subjectNestedList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>
            <!-- 二级分类 -->
            <el-select v-model="courseInfo.eduCourse.subjectId" placeholder="请选择">
            <el-option
                v-for="subject in subSubjectList"
                :key="subject.value"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>
        </el-form-item>

        <!-- 课程讲师 TODO -->
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
          <el-select
              v-model="courseInfo.eduCourse.teacherId"
              placeholder="请选择">
              <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.eduCourse.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
        <!-- 课程简介-->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.courseDescription.description"/>
        </el-form-item>

        <!-- 课程封面 TODO -->
        <!-- 课程封面-->
        <el-form-item label="课程封面">

          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/oss/file/upload?host=cover'"
            class="avatar-uploader">
            <img :src="courseInfo.eduCourse.cover">
          </el-upload>

        </el-form-item>

        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.eduCourse.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
        </el-form-item>
    </el-form>

  </div>
</template>
<script>

import course from "@/api/edu/course.js"
import subject from "@/api/edu/subject"
import teacher from "@/api/edu/teacher"
import Tinymce from '@/components/Tinymce'


const eduCourse = {
    title: '',
    subjectId: '', // 课程的二级分类
    teacherId: '',
    lessonNum: 0,
    cover: process.env.OSS_PATH + '/cover/1.jpg?Expires=1606568921&OSSAccessKeyId=TMP.3Kg652SKY6EDRxA4w9wA24PpNnpxmDGs2f6VMCciB7z2vrrWM1XMkTrv88U7RgaYaLrJojSBCd9k1HwULnQPK61bW2ENYz&Signature=T%2BbSv3XCl4sH%2BQznfMgEhJba7Bg%3D&versionId=CAEQFxiBgICpzIK7sBciIDE2YTU3NjJhYzJmZjRjMWY4YWRhOGJlN2RkM2E4MGUw&response-content-type=application%2Foctet-stream',
    price: 0,
    subjectParentId:'' // 课程的一级分类

}
const courseDescription = {
    description:''
}

export default {
  components: { Tinymce },
  data() {
    return {
      courseInfo:{eduCourse, courseDescription},
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList:[], // 课程分类的一级类目集合
      subSubjectList:[], // 课程分类二级类目集合
      teacherList:[], //讲师列表
      BASE_API: process.env.BASE_API
    }
  },
  // 当路由发送变化的时候、我们应该有一个监听，监听获取参数
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    console.log('info created')
    //初始化
    this.init()
  },

  methods: {
    init(){
        //1、判断是否有参数
        if(this.$route.params && this.$route.params.id){
            this.courseInfo.eduCourse.id = this.$route.params.id
            //2、如果有，回显
            this.getCourseInfoById(this.courseInfo.eduCourse.id)
        } else {
          this.courseInfo = {eduCourse, courseDescription}
          //3、没有呢、那就是新增
          //4、课程分类一级列表获取
          this.initSubjectList()
          this.initTeacherList()
        }
        
    },
    getCourseInfoById(id){
        course.getCourseInfoById(id)
          .then(response => {
             this.courseInfo = response.data.courseInfo 
             //调用初始化课程分类方法
             subject.getNestedTreeList()
                .then(response =>{
                  this.subjectNestedList = response.data.subjectList
                  for(var i = 0; i < this.subjectNestedList.length; i++){
                  if(this.subjectNestedList[i].id == this.courseInfo.eduCourse.subjectParentId){
                      this.subSubjectList = this.subjectNestedList[i].children 
                      console.log(this.subSubjectList)
                  }
              }
            })
             
            this.initTeacherList()
          })
          .catch()
    },
    initTeacherList(){
       teacher.getList()
        .then(response => {
           this.teacherList = response.data.items
        })
    },
    // 初始化 课程分类列表
    initSubjectList(){
        subject.getNestedTreeList()
          .then(response =>{
              this.subjectNestedList = response.data.subjectList
          })
    },
    subjectLevelOneChanged(value){
        //当一级分类点击发生变化的时候、触发的事件
        //传递一级分类变化的value值 =  subjectId
        //遍历课程分类的subjectList，当一级分类的Id ==  value值的时候，把此一级分类的children 赋值给二级分类的列表
        for(var i = 0; i < this.subjectNestedList.length; i++){
            if(this.subjectNestedList[i].id == value){
                this.subSubjectList = this.subjectNestedList[i].children 
            }
        }
    },
    //根据课程ID判断是保存还是修改
    next() {
      console.log('next')
      if(!this.courseInfo.eduCourse.id){
          this.saveVo()
      } else{
        this.updateVo()
      }
      
    },
    saveVo(){
      course.saveVo(this.courseInfo)
        .then(response => {
            this.$message({
              type:'success',
              message:"保存成功"
            })
            this.$router.push({ path: '/course/chapter/'+ response.data.id })
        })
        .catch(response => {
            this.$message({
              type:'error',
              message:"保存失败"
            })
        })
    },
    updateVo(){
      course.updateVo(this.courseInfo)
        .then(response => {
            this.$message({
              type:'success',
              message:"修改成功"
            })
            this.$router.push({ path: '/course/chapter/'+ this.courseInfo.eduCourse.id })
        })
        .catch(response => {
            this.$message({
              type:'error',
              message:"修改失败"
            })
        })
    },
    // 上传封面后成功回调的方法
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.eduCourse.cover = res.data.url
    },
    // 上传封面之前校验的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
