import express from "express";
import { conn } from "./dbconnect";
import mysql from "mysql"

export const router = express.Router();

router.get('/',(req,res)=>{
    conn.query('select * from person',(err,result,fields)=>{
        res.json(result);
    })
})
router.post('/', (req, res) => {
    let person = req.body;     
    let sql = "INSERT INTO `person`(`Name`, `BirthDay`, `Detail`) VALUES (?,?,?)";
    sql = mysql.format(sql, [person.Name, person.BirthDay, person.Detail]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json(   
            {
                affected_row: result.affectedRows,
                last_idx: result.insertId
            }
        );
    });


});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    let sql = "DELETE FROM person where PID = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.status(200).json(
            {
                affected_row : result.affectedRows
            }
        );
    })
   
   
});