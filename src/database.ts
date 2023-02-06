import { Client } from "pg";


const client: Client = new Client({
    user    : 'postgres',
    password: 'hldnr',
    host    : 'localhost',
    database: 'movies',
    port    : 5432
})

const startDatabase = async(): Promise<void> => {
    await client.connect()
    console.log('Database connected!')
}

export { client, startDatabase }