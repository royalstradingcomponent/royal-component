const CrmFollowUp =
require("../models/CrmFollowUp");

exports.createFollowUp =
async (req,res)=>{

try{

const followUp =
await CrmFollowUp.create(
req.body
);

res.status(201).json({
success:true,
followUp
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};

exports.getFollowUps =
async(req,res)=>{

try{

const followUps =
await CrmFollowUp.find()
.populate("contactId")
.sort({
followUpDate:1
});

res.json({
success:true,
followUps
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};