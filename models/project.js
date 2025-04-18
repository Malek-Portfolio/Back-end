const mongoose = require("mongoose")



const projectsSchema = new mongoose.Schema({
    title : {
        type:String ,
        required : true
    },
    description : {
        type:String ,
        required : true
    },
    thumbnail: {
        url: { type: String, required: true },
        altText: { type: String, default: "" }
    },
    type: {
        type : String ,
        enum : ["web" , "ai-ml" , "game-dev" , "web & AI/ML"],
        required : true
    },
    category : {
        type : String,
        required : true
    },
    gallery: [{
        type: { type: String, enum: ["image", "video"] },
        url: { type: String, required: true },
        altText: { type: String, default: "" },
        caption: { type: String, default: "" }
    }] ,
    link : {
        type : String , 
        required : true 
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    } ,
    features : {
        type : [String],
        default : []
    },
    technologies : {
        type : [String],
        default : []
    }
})


module.exports = mongoose.model("Project" , projectsSchema)