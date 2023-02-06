import { Request, Response } from "express";
import { client } from "./database";
import { IMovies, IMoviesRequest, MoviesResult } from "./interface";
import format from "pg-format";
import { QueryConfig } from "pg";


const createMovie = async ( request: Request, response: Response ):Promise<Response> => {
    try {
        const movieDataRequest: IMoviesRequest = request.body
        const movieData                        = {
            ...movieDataRequest,
        }
        const queryString: string = format(`
        INSERT INTO
            movies(%I)
        VALUES
            (%L)
            RETURNING *;
        `,
        Object.keys(movieData),
        Object.values(movieData)
        )
        const queryResult: MoviesResult = await client.query(queryString)
        const newMovie: IMovies         = queryResult.rows[0]
        return response.status(201).json(newMovie)
        
    } catch (error) {
        if(error instanceof Error){
            return response.status(409).json({
                message: error.message
            })
            
        }
        return response.status(500).json({
            message: 'Internal server error.'
        })
    }
}

const listMovies = async (request: Request, response: Response):Promise<Response> => {
    const per_page: number    = (request.query.per_page === undefined || Number(request.query.per_page) > 5) ? 5 : Number(request.query.per_page)
    let   page: number        = (request.query.page     === undefined || Number(request.query.page) <= 0) ? 1 : Number(request.query.page)
          page                = (per_page * page) - per_page
    const queryString: string = `
    SELECT
        *
    FROM
        movies
    LIMIT $1 OFFSET $2;   
    `
    const queryConfig: QueryConfig = {
        text  : queryString,
        values: [per_page, page]
    }
    const queryResult: MoviesResult = await client.query(queryConfig)
    console.log(queryResult.rows)
    return response.status(201).json(queryResult.rows)
}

const retrieveMovie = async ( request: Request, response: Response ): Promise<Response> => {
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
        try {
            const queryResult: MoviesResult = await client.query(queryConfig)
            console.log(queryConfig)
            return response.status(200).json(queryResult.rows[0])
            
        } catch (error) {
            
                    return response.status(500).json({
                        message: 'Internal server error'
                    })
            
        }
}

const deleteMovie = async (request: Request, response: Response): Promise<Response> => {
    const id: number          = parseInt(request.params.id)
    const queryString: string = `
    DELETE FROM
        movies
    WHERE
        id = $1
    `
    const queryConfig: QueryConfig = {
        text  : queryString,
        values: [id]
    }
    try {
        const queryResult: MoviesResult = await client.query(queryConfig)
        console.log(queryConfig)
        return response.status(204).json()
        
    } catch (error) {
        
        return response.status(500).json({
            message: 'Internal server error'
        })
        
    }
}

const updateMovie = async (request: Request, response: Response): Promise<Response> => {
    try {
        if(request.body.id){
            return response.status(400).json({
                message: 'Cannot update id.'
            })
        }
        const id: number           = parseInt(request.params.id)
        const movieData            = Object.values(request.body)
        const movieKeys            = Object.keys(request.body)
        const formatString: string = format(`
        UPDATE
            movies
        SET
            (%I) = ROW (%L)
        WHERE
            id = $1
            RETURNING *;
        `,
        movieKeys,
        movieData
        )
        const queryConfig: QueryConfig = {
            text  : formatString,
            values: [id]
        }
            const queryResult: MoviesResult = await client.query(queryConfig)
            return response.json(queryResult.rows[0])
    } catch (error) {
        if (error instanceof Error){
            return response.status(409).json({
                message: error.message
            })
        }
        return response.status(500).json({
            message: 'Internal server error.'
        })
    }
}



export { createMovie, listMovies, retrieveMovie, deleteMovie, updateMovie }
