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
const postUser = (req,res)=>{
    const {firstname,lastname,email,city,language}=req.body
    database
    .query ("INSERT INTO users (firstname,lastname,email,city,language) VALUES (?,?,?,?,?)", [firstname,lastname,email,city,language])
    .then(([result])=>{
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
    }
    )
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error saving the user");
    })
}
const updateUser = (req, res)=>{
    const id = parseInt(req.params.id)
    const {firstname,lastname,email,city,language}=req.body
    database
    .query("update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",[firstname,lastname,email,city,language])
    .then((result)=>{
        if(result.affectedRows === 0){
            res.status(404).send("Not Found")
        }else{
            res.sendStatus(204)
        }
    })
    .catch((err)=>{
        console.error(err)
        res.sendStatus(500).send("Error editing the movie")
    })
}

const deleteUser = (req, res)=>{
    const id = parseInt(req.params.id)
    database
    .query("delete from users where id= ?", [id])
    .then((result)=>{
        if(result.affectedRows===0){
            res.status(404).send("Not found")
        }else{
            res.sendStatus(204)
        }
    })
    .catch((err)=>{
        console.error(err)
        res.status(500).send("Error deleting the user")
    })
}

module.exports = {
    getUsers,
    getUsersById,
    postUser,
    updateUser,
}
