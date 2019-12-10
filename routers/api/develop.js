const express = require('express');
const router = express.Router();
const passport = require('passport');
const Development = require('../../model/Development');
const formidable = require('formidable');

router.post('/uploadDevFile', passport.authenticate("jwt", { session: false }), (req, res) => {
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
        uploadData.submitname = fields.submitperson;
        uploadData.filesrc = files.file.path.substring(12);
        uploadData.filename = files.file.name;
        uploadData.remark = "备注备注";
        //console.log(uploadData)
        //向业务表中插入数据
        new Development(uploadData).save().then(data => {
            res.json(data)
        }).catch(err => {
            if (err) {
                console.log(err)
            }
        })
    })
})


router.get('/getFilesInfo', passport.authenticate("jwt", { session: false }), (req, res) => {
    Development.find().then(data => {
      res.json(data)
    }).catch(err => {
      //console.log(err)
      res.status(404).json(err)
    })
  })
module.exports = router