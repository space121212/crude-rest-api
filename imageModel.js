var mongoose = require('mongoose')
const schema = mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    summary: String,
    image: String
},{
    timestamps:true
})

module.exports = mongoose.model('images',schema)