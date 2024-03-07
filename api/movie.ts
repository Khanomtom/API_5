import express from "express";
import { conn } from "./dbconnect";
import { MovieRes } from "./model/movie_post";
import mysql from "mysql"

export const router = express.Router();

router.post("/", (req, res) => {
    const data = req.body;
    console.log(data);
    
    let sql = "INSERT INTO movie (Title, Image, Plot, Rating, Type) VALUES (?, ?, ?, ?, ?)";
    sql = mysql.format(sql, [
        data.Title,
        data.Image,
        data.Plot,
        data.rating, // Corrected to lowercase 'rating'
        JSON.stringify(data.type) // Corrected to lowercase 'type'
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json(   
            {
                affected_row: result.affectedRows,
                last_idx: result.insertId
            }
        );
    });
});

router.get("/", (req, res) => {
   conn.query("select * from movie",(err,result)=>{
    if(err)throw err;
    res.json(result);
   });
});
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    let sql = "DELETE FROM movie where MID = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.status(200).json(
            {
                affected_row : result.affectedRows
            }
        );
    })
});
router.get("/search/:Title", (req, res) => {
    let responseData = {
      movies: [],
      persons: []
    };
    console.log(req.params.Title);
    
    let sql = `SELECT person.* FROM person 
    WHERE PID IN ( 
        SELECT stars.PID 
        FROM stars INNER JOIN movie ON stars.MID = movie.MID 
        WHERE movie.Title LIKE "%bat%" 
        
        UNION 
        
        SELECT creaters.PID 
        FROM creaters 
        INNER JOIN movie ON creaters.MID = movie.MID 
        WHERE movie.Title LIKE "%bat%" 
    )`;
    sql = mysql.format(sql, [`%${req.params.Title}%`,`%${req.params.Title}%`]);
    conn.query(sql, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        responseData.persons = result;
        checkAndSendResponse();
      }
    });
  
    let sql1 = 'SELECT * FROM movie WHERE Title LIKE ?'
    sql1 = mysql.format(sql1, [`%${req.params.Title}%`]);
    conn.query(sql1, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        responseData.movies = result;
        checkAndSendResponse();
      }
    });
  
    function checkAndSendResponse() {
      if (responseData.persons.length > 0 && responseData.movies.length > 0) {
        res.json(responseData);
      }
    }
  });