import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import {readFile} from 'node:fs/promises';
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
const path=new URL('../seed/seed.json',import.meta.url);
try{
 const data=JSON.parse(await readFile(path,'utf8'));
 for(const p of data.paintings||[])await pool.query(`INSERT INTO paintings(id,title,artist,description,price,image_url,status) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET title=excluded.title,artist=excluded.artist,description=excluded.description,price=excluded.price,image_url=excluded.image_url,status=excluded.status`,[p.id,p.title,p.artist,p.description||'',Number(p.price),p.imageUrl,p.status==='sold'?'sold':'available']);
 for(const [key,value] of Object.entries({potteryItems:data.potteryItems||[],glazes:data.glazes||[],ratePerSqFt:Number(data.mural?.ratePerSqFt||0),muralDesigns:data.mural?.designs||[]}))await pool.query('INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=excluded.value',[key,JSON.stringify(value)]);
 if(data.studioAccount?.email&&data.studioAccount?.password){const a=data.studioAccount,hash=await bcrypt.hash(a.password,12);await pool.query("INSERT INTO users(id,name,email,password_hash,role) VALUES($1,$2,lower($3),$4,'admin') ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,role='admin'",['studio-admin',a.name||'Meadowbell Studio',a.email,hash]);console.log(`Seeded admin sign-in: ${a.email}`)}else console.log('No studioAccount was present; add admin credentials privately to seed/seed.json before seeding.');
 console.log(`Seeded ${data.paintings?.length||0} paintings, ${data.potteryItems?.length||0} pottery items, and ${data.glazes?.length||0} glazes.`);
}finally{await pool.end()}
