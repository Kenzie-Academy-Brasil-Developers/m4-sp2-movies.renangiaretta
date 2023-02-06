import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovie, deleteMovie, listMovies, retrieveMovie, updateMovie } from "./logic";
import { ensureMovieExists } from "./middlewares";

const app: Application = express()
app.use(express.json())

app.post('/create-movie', createMovie )
app.get('/list-movie', listMovies)
app.get('/list-movie/:id', ensureMovieExists, retrieveMovie)
app.delete('/list-movie/:id', ensureMovieExists, deleteMovie)
app.patch('/list-movie/:id', ensureMovieExists, updateMovie)


app.listen(3000, async () => {
    await startDatabase()
    console.log('Server is online.')
})