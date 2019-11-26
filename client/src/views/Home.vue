<template>
  <div>
    <div class="fillcontain">
      <!-- home中心 -->
      <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
        <el-tab-pane label="消息中心" name="1">
          <!-- 第一个标签页 -->
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in counts" :key="index">
              <el-card class="box-card" shadow="hover" :class="[item.color]">
                <div class="d-flex">
                  <i
                    :class="[item.icon,item.color]"
                    class="indexClass"
                    style="width: 40px;height: 40px;line-height: 40px;"
                  ></i>
                  <div style="font-size:20px;color:#ffffff;font-weight:bolid">
                    <h4 class="bottom">{{item.num}}</h4>
                    <small class="text-muted">{{item.desc}}</small>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- 第一个标签页的表格 -->
          <el-row :gutter="20" style="margin-top:20px">
            <el-col :span="16">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column label="接收日期" width="200">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="发送人" width="100">
                  <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="流程名称" width="180">
                  <template slot-scope="scope">
                    <el-tag size="medium" type="warning">{{ scope.row.flowname }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="当前步骤" width="90">
                  <template slot-scope="scope">
                    <el-tag size="medium" type="warning">{{ scope.row.stepname }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">处理</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="8">这部分还没想好放啥 -_-</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          v-for="(item) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          closable
        >
          <keep-alive>
            <component
              :is="item.componentIndex"
              :val="item.fatherVal"
              :tablearry="editableTabs"
              @close="childrenclose"
              :arryindex="item.name"
            ></component>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
import reqsubmitFlow from "../components/Form/reqsubmitFlow";

export default {
  components: {
    reqsubmitFlow,
  },
  data() {
    return {
      tableData: [],
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 1,
      counts: [
        {
          icon: "el-icon-user-solid",
          desc: "我的待办",
          num: "30",
          color: "bg-danger"
        },
        {
          icon: "el-icon-s-finance",
          desc: "我的已办",
          num: "120",
          color: " bg-Brand"
        },
        {
          icon: "el-icon-s-order",
          desc: "我发起的流程",
          num: "5",
          color: "bg-success"
        },
        {
          icon: "el-icon-s-data",
          desc: "未读消息",
          num: "100",
          color: "bg-warning"
        }
      ]
    };
  },
  methods: {
    childrenclose(data) {
      //console.log(data);
      this.removeTab(data);
      this.getInfoFlow();
    },
    removeTab(targetName) {
      //console.log(targetName);
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      if (!this.editableTabs.length) {
        this.editableTabsValue = "1";
      }
    },
    handleEdit(data1, data2) {
      // console.log(data1)
      //console.log(data2);
      let newTabName = ++this.tabIndex + "";
      //console.log(newTabName);
      this.editableTabs.push({
        title: data2.flowname,
        name: newTabName,
        componentIndex: data2.componentIndex,
        fatherVal: data2
      });
      this.editableTabsValue = newTabName;
    },
    getInfoFlow() {
      this.$axios.get(`/api/home/homeflow/${this.$store.state.user.id}`).then(data => {
        //console.log(data.data);
        let test = data.data.filter(v=>{
          return v.stepname!="完成"
        })
        //console.log(test)
        this.tableData = test.map(v => {
          return {
            date: this.$moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
            name: v.sendername,
            flowname: v.flowname,
            instanceid: v.instanceid,
            flowstatue: v.flowstate,
            componentIndex: v.flowcomponent,
            stepname:v.stepname
          };
        });
      });
    }
  },
  created() {
    // console.log(111);
    
    this.getInfoFlow();
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
  text-align: right;
  margin-top: 10px;
}
.btnRight {
  float: right;
}

.d-flex {
  display: flex;
  align-items: center;
}
.indexClass {
  margin-bottom: 0;
  color: #ffffff;
  text-align: center;
  margin-right: 10px;
  font-size: 40px;
}
.bottom {
  margin-bottom: 5px;
}
.bg-success {
  background-color: #67c23a;
}
.bg-Brand {
  background-color: #409eff;
}
.bg-danger {
  background-color: #f56c6c;
}
.bg-warning {
  background-color: #e6a23c;
}
</style>