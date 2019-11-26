const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlowSchema = new Schema({
    flowname: {
        type: String,
    },
    flowcomponent:{
        type: String,
    },
    flowstate: {
        type: Number,
    },
    instanceid: {
        type: String
    },
    sendername: {
        type: String
    },
    senderid: {
        type: String
    },
    recevename: {
        type: String
    },
    receveid: {
        type: String
    },
    stepname: {
        type: String
    },
    flowremark: {
        type: String
    },
    flowstep: {
        type: String
    },
    createTime: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: { createdAt: 'createTime' }
    })
module.exports = Flow = mongoose.model("workflow", FlowSchema)