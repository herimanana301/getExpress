const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];
const database = require("./database")
const getMovies = (req, res) => {
  database 
    .query("select * from movies")
    .then(([result])=>{
        res.json(result);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Erreur ma gueul")
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((movie) => movie.id === id);
  database
    .query("select * from movies where id = ?", [id])
    .then(([result])=>{
      if(result[0]!= null){
        res.json(result[0])
      }else{
        res.status(400).send("Not found")
      }

    })
    .catch((err)=>{
      console.log(err)
      res.status(500).send("Erreur ma gueul")
    })
};

const postMovie = (req, res)=>{
  const {title, director, year, color, duration}=req.body;
  database
    .query("INSERT INTO movies(title, director, year, color, duration ) VALUES(?, ?, ?, ?, ?)",
    [title, director, year, color, duration]
    )
    .then(([result])=>{
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
})
}
const updateMovie = (req, res) =>{
  const id = parseInt(req.params.id);
  const {title, director, year, color, duration} = req.body

  database
  .query("update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id= ?", [title, director, year, color, duration])
  .then((result)=>{
    if(result.affectedRows===0){
      res.status(404).send("Not Found")
    }else{
      res.sendStatus(204);
    }
  })
  .catch((err)=>{
    console.error(err)
    res.status(500).send("Error editing the movie")
  }
  )
}

const deleteMovie = (req,res)=>{
  const id = req.params.id
  database
  .query("delete from movies where id = ?",[id])
  .then((result)=>{
    if (result.affectedRows===0){
      res.Status(404).send("Not Found")
    }else{
      res.sendStatus(200)
    }
  })
  .catch((err)=>{
    console.error(err);
    res.Status(500).send("Error deleting the movie")
  }
  )
}

const movieFilter = (req,res)=>{
  const sql = "select * from movies";
  const sqlValues = [];
  if (req.query.color!=null){
    sql+=" where color = ?";
    sqlValues.push(req.query.color);
  }
  if (req.query.max_duration !=null){
    sql += " and max_duration <= ?";
    sqlValues.push(req.query.max_duration)
  }
  else if (req.query.max_duration!=null){
    sql+="where max_duration <=?";
    sqlValues.push(req.query.max_duration)
  }
  database
  .query(sql, sqlValues)
  .then(([movies])=>{
    res.json(movies)
  })
  .catch((err)=>{
    console.error(err)
    res.status(500).send("Error retrieving data from database")
  })
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie
};
