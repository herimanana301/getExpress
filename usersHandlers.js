const database = require('./database')

const getUsers=(req,res)=>{
     database
     .query("select * from users")
     .then(([result])=>{
        res.status(200).json(result)
     })
     .catch((err)=>{
        console.log(err)
     })

}
const getUsersById =(req,res)=>{
    const id = parseInt(req.params.id)
    database
    .query("select * from users where id = ?", [id])
    .then (([result])=>{
        if(result[0]!=null){
            res.status(200).json(result[0])
        }else{
            res.status(400).send("Not Found")
        }
    }
    )
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = {
    getUsers,
    getUsersById
}