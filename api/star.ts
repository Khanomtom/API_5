import express, { query } from 'express'
import { conn } from './dbconnect'
import mysql, { format } from 'mysql'

export const router = express.Router();

router.get('/',(req,res)=>{
    conn.query('select person.* from stars,person where stars.PID = person.PID',(err,result,fields)=>{
        res.json(result);
    })
})
router.post('/',(req,res)=>{
    const star = req.body;
    let sql = 'insert into stars (MID,PID) values(?,?)';
    sql = format(sql,[star.MID,star.PID])
    conn.query(sql,(err,result)=>{
        if(err)throw err;
        res.status(200).json(
            {
                affected_row : result.affectedRows,
                lastIdx : result.insertId
            }
        );
    })
})
router.delete('/',(req,res)=>{
    const id = req.query.id;
    let sql = 'delete from stars where PID = ?';
    sql = format(sql,[id]);
    conn.query(sql,(err,result)=>{
        if(err) throw err;
        res.json(
            {
                affected_row : result.affectedRows
            }
        )
    })
})