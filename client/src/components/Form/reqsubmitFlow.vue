<template>
  <div class="fillcontain">
    <div>
      <div style="display:flex;justify-content:flex-start ">
        <el-tag
          type="warning"
          size="medium "
          effect="dark"
          style="font-size:20px;margin-bottom:20px"
        >流程处理</el-tag>
        <el-tag
          type="primary"
          size="medium "
          effect="dark"
          style="font-size:20px;margin-bottom:20px;margin-left:20px;cursor:pointer;"
          @click="dialogVisible = true"
        >流程图</el-tag>
      </div>
      <el-form :inline="true" :model="formInline">
        <el-form-item label="处理意见">
          <el-select v-model="formInline.region" placeholder="请选择" :class="selectwidth">
            <el-option label="同意" value="同意"></el-option>
            <el-option label="不同意" value="不同意"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="请输入意见" :class="inputwidth"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="clear()">退回</el-button>
          <el-button
            type="success"
            @click="sendNext(0)"
            v-if="(val.flowstatue+3)!=flowStep.length"
          >发送</el-button>
          <el-button type="success" v-else @click="sendNext(1)">完成</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display:flex;justify-content:flex-start ">
      <el-tag
        type="danger"
        size="medium "
        effect="dark"
        style="font-size:20px;margin-top:20px;"
      >流程内容信息</el-tag>
    </div>

    <div style="margin-top:20px">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item label="流程发起人">
          <el-input v-model="form.sendFlowname" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="需求单编号">
          <el-input v-model="form.code" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="需求类型">
          <el-input v-model="form.type" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="功能模块">
          <el-input v-model="form.modul" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="form.menu" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="需求说明">
          <el-input type="textarea" v-model="form.desc" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-tag
            type="danger"
            v-model="form.attachedname"
            class="hover"
            @click="srcView()"
          >{{form.attachedname}}</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <!-- 流程图 -->
    <el-dialog title="流程图" :visible.sync="dialogVisible">
      <el-steps
        :active="val.flowstatue+1"
        align-center
        finish-status="success"
        style="margin-top:20px"
      >
        <el-step :title="item.name" v-for="(item,index) in flowStep" :key="index"></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    val: {
      type: Object
    },
    tablearry: {
      type: Array
    },
    arryindex: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      people: [],
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
      ],
      inputwidth: "inputwidth",
      selectwidth: "selectwidth",
      form: {
        code: "",
        type: "",
        modul: "",
        menu: "",
        desc: "",
        attachedname: "",
        attachedsrc: "",
        sendFlowname: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      flowStepNow: "",
      flowStep: [{ name: "首次发起" }, { name: "需求审核" }, { name: "完成" }]
    };
  },
  methods: {
    handleChange(value) {
      console.log(this.people);
      this.people = value;
      // let arry = value.map(v => {
      //   let { name, id } = v.find(o => {
      //     console.log(typeof o);
      //     if (typeof o == "object") {
      //       return o;
      //     }
      //   });
      //   return { name, id, partment: v[1] };
      // });
      // console.log(arry);
    },
    srcView() {
      let href = `http://10.1.6.14:3001/document/${this.form.attachedsrc}`;
      window.open(href, "_blank");
    },
    sendNext(num) {
      if (this.formInline.region != "" && this.formInline.user != "") {
        // console.log(num)
        // console.log( this.flowStep[this.val.flowstatue+1].name);
        let formdata = {
          flowname: this.val.flowname,
          flowstate: this.val.flowstatue + 1,
          instanceid: this.val.instanceid,
          sendername: this.$store.state.user.name,
          recievename: "黄子韬",
          receivedid: this.$store.state.user.id,
          flowcomponent: this.val.componentIndex,
          flowstep: this.formInline.region,
          flowremark: this.formInline.user,
          stepname: this.flowStep[this.val.flowstatue + 1 + num].name,
          iscomplete: num
        };
        this.$axios.post("/api/home/sendnext", formdata).then(res => {
          console.log(res);
          this.$emit("close", this.arryindex);
        });
      } else {
        this.$message({
          message: "请填写完全处理意见",
          type: "warning"
        });
      }
    }
  },
  created() {
    //console.log(this.val);
    //console.log(this.val.flowstatue);
    // let flowStepIndex = this.val.flowstatue;
    this.flowStepNow = this.flowStep[this.val.flowstatue + 1].name;
    //console.log(this.flowStepNow);

    this.$axios
      .get(`/api/reqsubmit/flowinfo/${this.val.instanceid}`)
      .then(data => {
        //console.log(data.data);
        this.form.sendFlowname = data.data.submitperson;
        this.form.code = data.data.reqcode;
        this.form.type = data.data.reqtype;
        this.form.modul = data.data.modulename;
        this.form.menu = data.data.menuname;
        this.form.desc = data.data.reqdecs;
        this.form.attachedname = data.data.attchname;
        this.form.attachedsrc = data.data.attchsrc;
      });
    // console.log(this.tablearry)
    // console.log(this.arryindex)
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
.hover {
  cursor: pointer;
}
.inputwidth {
  width: 800px;
}
.selectwidth {
  width: 100px;
}
</style>