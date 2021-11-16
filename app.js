const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server running at http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieNamesQuery = `SELECT movie_name FROM movie;`;
  const movieNamesArray = await db.all(getMovieNamesQuery);
  //response.send(movieNamesArray);
  response.send(
    movieNamesArray.map((eachMovie) =>
      convertDbObjectToResponseObject(eachMovie)
    )
  );
});
/*
app.post("/movies/", async (request, response) => {
  const getMovieIdQuery = `SELECT movie_id from movie ORDER BY movie_id DESC LIMIT 1;`;
  const movieId = await db.get(getMovieIdQuery);
  const { movie_id } = movieId;
  next_movie_id = movie_id + 1;
  //console.log(next_movie_id);
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  //console.log(`${directorId},${movieName},${leadActor}`);
  const addMovieDetailsQuery = `INSERT INTO movie(movie_id,director_id,movie_name,lead_actor) 
  VALUES (
      ${next_movie_id},
      ${directorId},
      '${movieName}',
      '${leadActor}');`;
  await db.run(addMovieDetailsQuery);
  response.json(`Movie Successfully Added`);
});
*/

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie ( director_id, movie_name, lead_actor)
  VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

/*
app.get("/movies/allMovies/", async (request, response) => {
  const getMovieDetails = `SELECT * FROM movie`;
  const dbResponse = await db.all(getMovieDetails);
  response.send(dbResponse);
});
*/
const DbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const getMovieDetailsQuery = `SELECT * FROM movie WHERE movie_id = ${movieId}`;
  const dbResponse = await db.get(getMovieDetailsQuery);
  response.send(DbObjectToResponseObject(dbResponse));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  console.log(movieDetails);
  const { directorId, movieName, leadActor } = movieDetails;
  console.log(movieId);
  console.log(`${directorId},${movieName},${leadActor}`);
  const updateMovieDetails = `UPDATE movie 
  SET 
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE 
  movie_id = ${movieId}`;
  await db.run(updateMovieDetails);
  response.send(`Movie Details Updated`);
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  let deleteMovieDetails = `DELETE FROM movie WHERE movie_id = ${movieId}`;
  await db.run(deleteMovieDetails);
  response.send("movie Removed");
});

const dbObjectToResponseObject1 = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const getDirectors = `SELECT * FROM director`;
  const dbResponse = await db.all(getDirectors);
  //response.send(dbResponse);
  response.send(
    dbResponse.map((eachDirector) => dbObjectToResponseObject1(eachDirector))
  );
});

const dbObjectToResponseObject2 = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  console.log(directorId);
  const getMovieNames = `SELECT movie_name FROM movie WHERE director_id = ${directorId}`;
  const dbResponse = await db.all(getMovieNames);
  //response.send(dbResponse);
  response.send(
    dbResponse.map((eachMovieName) => dbObjectToResponseObject2(eachMovieName))
  );
});

module.exports = app;
