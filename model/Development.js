const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DevelopSchema = new Schema({
    filename: {
        type: String
    },
    filesrc:{
        type:String
    },
    submitname:{
        type:String
    },
    remark:{
        type:String
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
module.exports = Develop = mongoose.model("develop", DevelopSchema)