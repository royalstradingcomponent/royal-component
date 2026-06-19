const mongoose = require("mongoose");

const crmFollowUpSchema =
new mongoose.Schema(
{
  contactId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"CrmContact",
    required:true
  },

  title:{
    type:String,
    required:true
  },

  note:String,

  followUpDate:{
    type:Date,
    required:true
  },

  priority:{
    type:String,
    enum:[
      "low",
      "medium",
      "high"
    ],
    default:"medium"
  },

  status:{
    type:String,
    enum:[
      "pending",
      "completed"
    ],
    default:"pending"
  }

},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
"CrmFollowUp",
crmFollowUpSchema
);