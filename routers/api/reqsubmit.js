const express = require('express');
const router = express.Router();
const passport = require('passport');
const Reqsubmit = require('../../model/Reqsubmit');
const FlowTask = require('../../model/Workflow');
const formidable = require('formidable');
const moment = require('moment');
// var path = require('path');
// var fs = require('fs');

router.post('/formsubmit', passport.authenticate("jwt", { session: false }), (req, res) => {
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = "D:/document";
  form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.parse(req, function (err, fields, files) {
    // fields 是普通表单数据 
    // files 是文件数据
    // console.log(files.file.path);
    //console.log(files.file.name); 
    if (err) throw err;
    let uploadData = {};
    uploadData.reqcode = fields.code;
    uploadData.reqtype = fields.type;
    uploadData.modulename = fields.moduel;
    uploadData.menuname = fields.menu;
    uploadData.reqdecs = fields.desc;
    uploadData.linkflowid = fields.flowid;
    uploadData.submitperson = fields.submitperson;
    uploadData.submitpersonid = fields.submitpersonid;
    uploadData.attchsrc = files.file.path.substring(12);
    uploadData.attchname = files.file.name;
    uploadData.submitdepartment = "部门";
    uploadData.flowstate = "审批中";
    //console.log(uploadData)
    //向业务表中插入数据
    let p1 = new Promise((resolve, reject) => {
      new Reqsubmit(uploadData).save().then(data => {
        resolve(data)
      }).catch(err => {
        if (err) {
          reject(err)
        }
      })
    })
    //向流程表中插入数据
    let p2 = new Promise((resolve, reject) => {
      new FlowTask({
        flowcomponent:"reqsubmitFlow",
        flowname: "需求提交流程",
        flowstate: 0,
        instanceid:fields.flowid,
        sendername:fields.submitperson,
        recevename:fields.receivename,
        receveid:fields.receiveid,
        stepname:"首次发起"
      }).save().then(v => {
        resolve(v)
      }).catch(err => {
        if (err) {
          reject(err)
        }
      })
    })
    Promise.all([p1, p2]).then(data => {
      res.json(data.status)
    }).catch(err => {
      res.json(err)
    })

  })
})

router.get('/reqGetinfo', passport.authenticate("jwt", { session: false }), (req, res) => {
  Reqsubmit.find().then(data => {
    res.json(data)
  }).catch(err => {
    //console.log(err)
    res.status(404).json(err)
  })
})

router.get('/flowinfo/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
  //console.log(req.params.id)
  Reqsubmit.findOne({
    linkflowid:req.params.id
  }).then(data => {
    res.json(data)
  }).catch(err => {
    //console.log(err)
    res.status(404).json(err)
  })
})

router.get('/document/*', (req, res) => {
  res.sendFile(`D:${req.url}`)
})

module.exports = router