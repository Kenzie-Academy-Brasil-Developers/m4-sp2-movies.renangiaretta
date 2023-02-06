import { QueryResult } from "pg"



interface IMoviesRequest {
    id         : number,
    name       : string
    description: string
    duration   : number
    price      : number
}

interface IMovies extends IMoviesRequest {
    id: number
}

type MoviesResult = QueryResult<IMovies>

export { IMoviesRequest, IMovies, MoviesResult }