<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH + '/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB.xls?Expires=1606364416&OSSAccessKeyId=TMP.3Keo6U3QjfEGJxr6mED3newyBmiiqGLeDSFLee7HPgt61v9QTat1TW2CNo8jA5e7EQV3ogMYisCpwFbF6CwExu7gkwP9Zf&Signature=%2Bkrt37T2dBQufzPhPJO4%2Ft%2BXPJU%3D&versionId=CAEQFxiBgIDIj4GKsBciIDFkYmY1MGI4ZmUxNjQ4NjY4MmM0ODlhOTZjZmIyYThi&response-content-type=application%2Foctet-stream'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/subject/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
    data () {
        return {
            BASE_API: process.env.BASE_API, // 接口API地址
            OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
            fileUploadBtnText: '上传到服务器', // 按钮文字
            importBtnDisabled: false, // 按钮是否禁用,
            loading: false
        }
    },
    methods: {
        submitUpload() {
            this.fileUploadBtnText = '正在上传'
            this.importBtnDisabled = true
            this.loading = true
            this.$refs.upload.submit()
        },

       fileUploadSuccess(response) {
            if (response.success === true) {
            this.fileUploadBtnText = '导入成功'
            this.loading = false
            this.$message({
                type: 'success',
                message: response.message
            })
            } else {
            this.fileUploadBtnText = '导入失败'
            this.loading = false
            const messages = response.data.messageList
            let msgString = '<ul>'
            messages.forEach(msg => {
                msgString += `<li>${msg}</li>`
            })
            msgString += '</ul>'
            this.$alert(msgString, response.message, {
                dangerouslyUseHTMLString: true
            })
            }
        },

        fileUploadError(response) {
            this.fileUploadBtnText = '导入失败'
            this.loading = false
            this.$message({
            type: 'error',
            message: '导入失败'
            })
        }
    }
}
</script>