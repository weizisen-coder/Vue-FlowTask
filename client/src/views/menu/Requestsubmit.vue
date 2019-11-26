<template>
  <div class="fillcontain">
    <!-- 头部搜索区域和添加表单 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="提交人">
        <el-input v-model="formInline.user" placeholder="提交人"></el-input>
      </el-form-item>
      <el-form-item label="需求类型">
        <el-select v-model="formInline.region" placeholder="需求类型">
          <el-option label value></el-option>
          <el-option label="新功能" value="shanghai"></el-option>
          <el-option label="功能升级" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" >查询</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="success" icon="view" @click="dialogFormVisible=true">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 抽屉表单 -->
    <el-dialog title="需求提交" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="需求类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="新功能" value="新功能"></el-option>
            <el-option label="功能升级" value="功能升级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能模块" :label-width="formLabelWidth">
          <el-select v-model="form.moduel" placeholder="请选择">
            <el-option label="市场管理" value="市场管理"></el-option>
            <el-option label="运维管理" value="运维管理"></el-option>
            <el-option label="设计管理" value="设计管理"></el-option>
            <el-option label="装备管理" value="装备管理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-select v-model="form.menu" placeholder="请选择">
            <el-option label="测试菜单1" value="测试菜单1"></el-option>
            <el-option label="测试菜单2" value="测试菜单2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求说明" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.desc"></el-input>
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
        <el-form-item label="人员选择" :label-width="formLabelWidth">
          <el-cascader
            placeholder="请选择人员"
            :options="options"
            :props="{ multiple: true,}"
            filterable
            :show-all-levels="false"
            @change="handleChange"
            v-model="people"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="upLoad()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示列表 -->
    <el-table :data="tableData" border style="width:100%" @cell-dblclick="dbcheck">
      <el-table-column prop="flowstate" label="流程状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.flowstate === '审批中' ? 'primary' : 'success'"
            disable-transitions
            size="medium "
            effect="dark"
          >{{scope.row.flowstate}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reqcode" label="需求编号" align="center"></el-table-column>
      <el-table-column prop="reqtype" label="需求类型" align="center"></el-table-column>
      <el-table-column prop="modulename" label="功能模块" align="center"></el-table-column>
      <el-table-column prop="menuname" label="一级菜单" align="center"></el-table-column>
      <el-table-column prop="menuname" label="二级菜单" align="center"></el-table-column>
      <el-table-column prop="submitdepartment" label="提交部门" align="center"></el-table-column>
      <el-table-column prop="submitperson" label="提交人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
      <el-table-column prop="attchname" label="附件" align="center">
        <template slot-scope="scope">
          <div
            @click="seeOnline(scope.row.attchsrc)"
            style="
cursor:pointer;"
          >{{scope.row.attchname}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
  methods: {
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
    },
    handleChange(value) {
      console.log(this.people);
      this.people = value;
    },
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
      console.log(this.people);
      let peoplearry = this.people.map(v => {
        return {
          name: v[v.length - 1].name,
          id: v[v.length - 1].id,
          partment: v[v.length - 2]
        };
      });
      console.log(peoplearry);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      if (this.fileList.length) {
        let formData = new FormData();
        formData.append("code", "code111111");
        formData.append("type", this.form.type);
        formData.append("moduel", this.form.moduel);
        formData.append("menu", this.form.menu);
        formData.append("desc", this.form.desc);
        formData.append("submitperson", this.$store.state.user.name);
        formData.append("submitpersonid", this.$store.state.user.id);
        formData.append("receivename", peoplearry[0].name);
        formData.append("receiveid", peoplearry[0].id);
        formData.append("flowid", this.guid());
        formData.append("file", this.fileList[0].raw);
        this.$axios
          .post("api/reqsubmit/formsubmit", formData, config)
          .then(res => {
            this.fileList = [];
            this.dialogFormVisible = false;
            this.form.type = "";
            this.form.moduel = "";
            this.form.menu = "";
            this.form.desc = "";
            this.getinfo();
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
    handleClick(row) {
      alert("查看功能还没做呢");
      console.log(row);
    },
    handleClose(done) {
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            done();
          }, 2000);
        })
        .catch(_ => {});
    },
    getinfo() {
      // 获取表格数据
      this.$axios.get("/api/reqsubmit/reqGetinfo").then(res => {
        //console.log(res)
        let data = res.data.map(v => {
          v.createTime = this.$moment(v.createTime).format("YYYY-MM-DD");
          return v;
        });
        this.tableData = data;
        this.allTableData = data;
        this.setPaginations();
      });
    },
    dbcheck(row, column, cell, event) {
      alert("双击每条数据的功能还没做呢");
      console.log(row);
      console.log(column);
      console.log(cell);
      console.log(event);
    },
    seeOnline(src) {
      //console.log(src)
      let href = `http://10.1.6.14:3001/document/${src}`;
      window.open(href, "_blank");
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  },
  data() {
    return {
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      allTableData: [],
      people: [],
      tableData: [],
      fileList: [],
      formInline: {
        user: "",
        region: ""
      },
      dialogFormVisible: false,
      form: {
        type: "",
        moduel: "",
        menu: "",
        desc: ""
      },
      formLabelWidth: "70px",
      options: [
        {
          value: "zhinan",
          label: "天津水泥工业设计研究院",
          children: [
            {
              value: "shuzisuo",
              label: "数字所",
              children: [
                {
                  value: {
                    name: "魏子森",
                    id: "5dd78f9f1481427e6822e871"
                  },
                  label: "魏子森"
                },
                {
                  value: {
                    name: "张锦",
                    id: "5ddb7347e310de57e547b2a2"
                  },
                  label: "季可越"
                },
                {
                  value: {
                    name: "张明生",
                    id: "5ddc84f451c01b4dbd791cfa"
                  },
                  label: "张明生"
                },
                {
                  value: {
                    name: "王倩",
                    id: "5ddc850d51c01b4dbd791cfb"
                  },
                  label: "王倩"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  created() {
    //console.log(111);
    this.getinfo();

    // console.log(this.guid());
    // console.log(this.$store.state.user.name);
    // console.log(this.$store.state.user.id);
  }
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.pagination {
  text-align: center;
  margin-top: 10px;
}
.btnRight {
  float: right;
}
</style>