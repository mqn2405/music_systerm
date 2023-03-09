const { Pool } = require('pg')

POSTGRES_USER = 'postgres'
POSTGRES_HOST = 'localhost'
POSTGRES_DB = 'music_web_new3'
POSTGRES_PWD = '123456'
POSTGRES_PORT = '5432'

const pgConfig = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PWD,
  port: POSTGRES_PORT,
}

const pool = new Pool(pgConfig)
/**
 *
 * @param {String} queryStr
 * @returns Object
 */

const query = async (queryStr) => {
  const client = await pool.connect()
  try {
    return await client.query(queryStr)
  } catch (error) {
    console.log('error >>>> ', error);
    throw error
  } finally {
    client.release()
  }
}

module.exports.postgresql = {
  query,
}
