const express = require('express');
const router = express.Router();
const passport = require('passport');
const Homeflow = require('../../../model/Workflow');
const Reqsubmit = require('../../../model/Reqsubmit');
//聚合管道 联合查询
router.get('/homeflow/:id',passport.authenticate("jwt", { session: false }), (req, res) => {
    //console.log(req.params.id)
    Homeflow.aggregate([
        {
            $match: {
                "receveid": req.params.id
            },

        },
        {
            $sort: { "createTime": 1 }
        },
        {
            $group: {
                _id: "$instanceid",
                itemid: {
                    $last: "$_id"
                },
                flowname: {
                    $last: "$flowname"
                },
                flowcomponent: {
                    $last: "$flowcomponent"
                },
                flowstate: {
                    $last: "$flowstate"
                },
                instanceid: {
                    $last: "$instanceid"
                },
                sendername: {
                    $last: "$sendername"
                },
                senderid: {
                    $last: "$senderid"
                },
                recevename: {
                    $last: "$recevename"
                },
                receveid: {
                    $last: "$receveid"
                },
                createTime: {
                    $last: "$createTime"
                },
                stepname: {
                    $last: "$stepname"
                }
            }
        },
        {
            $sort: { "createTime": -1 }
        },



    ]).then(data => {
        //console.log(data)
        res.json(data)
    })
})

router.post('/sendnext', passport.authenticate("jwt", { session: false }),(req, res) => {
    console.log(req.body.iscomplete)
    let sendNextInfo = {}
    sendNextInfo.flowname = req.body.flowname;
    sendNextInfo.flowstate = req.body.flowstate;
    sendNextInfo.instanceid = req.body.instanceid;
    sendNextInfo.sendername = req.body.sendername;
    sendNextInfo.recevename = req.body.recievename;
    sendNextInfo.receveid = req.body.receivedid;
    sendNextInfo.flowremark = req.body.flowremark;
    sendNextInfo.flowstep = req.body.flowstep;
    sendNextInfo.flowcomponent = req.body.flowcomponent;
    sendNextInfo.stepname = req.body.stepname;
    if (req.body.iscomplete === 1) {
        new Homeflow(sendNextInfo).save().then(data => {
            Reqsubmit.updateOne({linkflowid:req.body.instanceid},{flowstate:"已完成"}).then(v=>{
                res.json(v)
            })
            
        }).catch(err => {
            res.json(err)
        })
    } else {
        new Homeflow(sendNextInfo).save().then(data => {
            res.json(data)
        }).catch(err => {
            res.json(err)
        })
    }



})
module.exports = router