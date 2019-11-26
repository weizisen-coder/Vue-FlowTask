const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../model/Profile');

router.get('/profile', (req, res) => {
    res.json({ msg: "profile" })
})
//添加数据
router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileFiles = {}
    if (req.body.type) profileFiles.type = req.body.type;
    if (req.body.describe) profileFiles.describe = req.body.describe;
    if (req.body.income) profileFiles.income = req.body.income;
    if (req.body.expend) profileFiles.expend = req.body.expend;
    if (req.body.cash) profileFiles.cash = req.body.cash;
    if (req.body.remark) profileFiles.remark = req.body.remark;

    new Profile(profileFiles).save().then(profile => {
        res.json(profile)
    })
})

//查询所有
router.get('/', passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.find().then(profile => {
        if (!profile) {
            res.status(404).json('没有任何内容')
        }
        return res.json(profile)
    }).catch(err => {
        console.log(err)
        res.status(404).json(err)
    })
})
//查询1条
router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({
        _id: req.params.id
    }).then(profile => {
        if (!profile) {
            res.status(404).json('没有任何内容')
        }
        return res.json(profile)
    }).catch(err => {
        console.log(err)
        res.status(404).json(err)
    })
})

//编辑一条数据
router.post('/edit/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileFiles = {}
    if (req.body.type) profileFiles.type = req.body.type;
    if (req.body.describe) profileFiles.describe = req.body.describe;
    if (req.body.income) profileFiles.income = req.body.income;
    if (req.body.expend) profileFiles.expend = req.body.expend;
    if (req.body.cash) profileFiles.cash = req.body.cash;
    if (req.body.remark) profileFiles.remark = req.body.remark;

    Profile.findOneAndUpdate(
        { _id: req.params.id },
        { $set: profileFiles },
        { new: true }
    ).then(data => {
        res.json(data)
    })
})
router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
   Profile.findByIdAndRemove({_id:req.params.id}).then(data=>{
       data.save().then(profile=>{
           res.json(profile)
       })
   }).catch(err=>{
       res.status(404).json('删除失败')
   })
})

module.exports = router