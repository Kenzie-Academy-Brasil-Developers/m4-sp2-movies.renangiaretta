import { NextFunction, Request, Response } from "express"
import { QueryConfig } from "pg"
import { client } from "./database"
import { MoviesResult } from "./interface"

const ensureMovieExists = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const id: number          = parseInt(request.params.id)
    const queryString: string = `
    SELECT
        *
    FROM
        movies
    WHERE
        id = $1
    `
    const queryConfig: QueryConfig = {
        text  : queryString,
        values: [id]
    }
    console.log('entrou no middleware')
    const queryResult: MoviesResult = await client.query(queryConfig)
    if(!queryResult.rowCount){
        console.log('não passou pelo middleware')
        return response.status(404).json({
            message: 'Movie not found!'
        })
    }else {
        console.log('passou pelo middleware')
        return next()

    }
}

export { ensureMovieExists }