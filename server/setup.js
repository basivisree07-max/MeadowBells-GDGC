import 'dotenv/config';
import pg from 'pg';
import {readFile} from 'node:fs/promises';
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
try{
 await pool.query(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));
 const data=JSON.parse(await readFile(new URL('../seed/seed.json',import.meta.url),'utf8'));
 const designs=data.mural?.designs;
 if(Array.isArray(designs))await pool.query('INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=excluded.value',['muralDesigns',JSON.stringify(designs)]);
 console.log('Meadowbell database tables are ready.');
}finally{await pool.end()}
