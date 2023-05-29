const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { route } = require("./auth");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST")



router.get('/allposts',requireLogin,(req,res)=>{
    POST.find()
    .populate("postedBy","_id name")
    .populate("comments","_id name")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err))
})

router.post('/Createpost', requireLogin,(req,res)=>{
    const {body,pic}=req.body;
    if(!pic || !body){
        return res.status(422).json({error:"Please add all the field"})
    }
    req.user
    const post=new POST({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
})
router.get("/myposts",requireLogin,(req,res)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myposts =>{
        res.json(myposts)
    })
})
router.put("/like", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name Photo")
    .then((result)=>{
        return res.json(result)
    }).catch(err=>console.log(err))
})

router.put("/unlike", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name Photo")
        .then(result => {
            return res.json(result)
        }).catch(err=>console.log(err))
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        comment:req.body.text,
        postedBy:req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .then(result => {
        return res.json(result)
    }).catch(err=>console.log(err))
})
module.exports=router;