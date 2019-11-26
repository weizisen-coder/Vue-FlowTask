const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReqsubmitSchema = new Schema({
    flowstate:{
        type:String
    },
    reqcode: {
        type: String
    },
    reqtype: {
        type: String
    },
    modulename: {
        type: String
    },
    menuname: {
        type: String
    },
    reqdecs: {
        type: String
    },
    attchsrc: {
        type: String
    },
    attchname: {
        type: String
    },
    submitperson: {
        type: String
    },
    submitpersonid: {
        type: String
    },
    submitdepartment: {
        type: String
    },
    linkflowid: {
        type: String
    },  
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})
module.exports = Reqsubmit = mongoose.model("reqsubmit", ReqsubmitSchema)