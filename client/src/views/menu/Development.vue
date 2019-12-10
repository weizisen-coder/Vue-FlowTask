<template>
  <div class="fillcontain">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="文件名称">
        <el-input v-model="formInline.user" placeholder="请输入要查询的文件名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="success" icon="view" @click="dialogFormVisible=true">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 上传附件表单 -->
    <el-dialog title="上传开发文档" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.marks"></el-input>
        </el-form-item>
        <el-form-item label="附件上传" :label-width="formLabelWidth">
          <el-upload
            action
            :multiple="false"
            :file-list="fileList"
            :http-request="handleFile"
            :on-change="documentFile"
            :on-remove="remove"
            :before-upload="beforupload"
            accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
          >
            <el-button size="small" type="primary">点击添加</el-button>
            <!-- <div slot="tip" >只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="upLoad()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="tableData" border style="width:100%">
      <el-table-column prop="filename" label="文件名称" align="center">
        <template slot-scope="scope">
          <div @click="seeOnline(scope.row.filesrc)" style="
cursor:pointer;">{{scope.row.filename}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="submitname" label="提交人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            v-if="paginations.total > 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "70px",
      fileList: [],
      form: {
        marks: ""
      },
      tableData: [],
      allTableData: [],
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      }
    };
  },
  methods: {
    beforupload(file) {
      console.log(file);
    },
    handleFile() {},
    remove(file, fileList) {
      console.log(file);
      console.log(fileList);
      this.fileList = fileList;
    },
    documentFile(file, fileList) {
      this.fileList = fileList;
    },
    upLoad() {
      if (this.fileList.length) {
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        let formData = new FormData();
        formData.append("file", this.fileList[0].raw);
        formData.append("submitperson", this.$store.state.user.name);
        this.$axios
          .post("api/develop/uploadDevFile", formData, config)
          .then(res => {
            this.getFileInfo();
            this.fileList = [];
            this.dialogFormVisible = false;
            this.form.marks = "";
            this.$message({
              message: "提交成功",
              type: "success"
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message({
          message: "请添加附件",
          type: "warning"
        });
      }
    },
    getFileInfo() {
      // 获取表格数据
      this.$axios.get("/api/develop/getFilesInfo").then(res => {
        //console.log(res);
        let data = res.data.map(v => {
          v.createTime = this.$moment(v.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          return v;
        });
        this.tableData = data;
        this.allTableData = data;
        this.setPaginations();
      });
    },
    seeOnline(src) {
      //console.log(src)
      let href = `http://10.1.6.14:3001/document/${src}`;
      window.open(href, "_blank");
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    }
  },
  mounted() {
    this.getFileInfo();
  }
};
</script>
<style scoped>
</style>