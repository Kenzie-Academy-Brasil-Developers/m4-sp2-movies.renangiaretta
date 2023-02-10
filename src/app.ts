import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovie, deleteMovie, listMovies, retrieveMovie, updateMovie } from "./logic";
import { ensureMovieExists } from "./middlewares";

const app: Application = express()
app.use(express.json())

app.post('/movies', createMovie )
app.get('/movies', listMovies)
app.get('/movies/:id', ensureMovieExists, retrieveMovie)
app.delete('/movies/:id', ensureMovieExists, deleteMovie)
app.patch('/movies/:id', ensureMovieExists, updateMovie)


app.listen(3000, async () => {
    await startDatabase()
    console.log('Server is online.')
})