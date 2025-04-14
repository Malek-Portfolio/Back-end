const express = require("express")

const router = express.Router()

//Getting all projects
router.get("/" , (req , res)=> {
    res.send("hello world")
})

// Getting web projects

router.get("/web" , (req , res)=> {
    
})


// getting AI/ml projects

router.get("/ai-ml" , (req , res)=> {
    
})


// getting game-dev projects
router.get("/game-dev" , (req , res)=> {
    
})



module.exports = router