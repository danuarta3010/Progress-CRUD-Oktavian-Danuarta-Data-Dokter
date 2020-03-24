const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 8080;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dokter'
})

const secretKey = "thisisverystrongerpassword";

const isAuthorized = (request, result, next)=>{
    if(typeOf(request.headers['x-api-key']) == "Undefined"){
        return result.status(403).json({
            success: false,
            message: "Token isn't provided"
        })
    }

    let token = request.headers['x-xpi-key'];

    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err){
            return result.status(403).json({
                success: false,
                message: "Token is invalid"
            })
        }
    })
    next()
}

app.get('/', (request, result) =>{
    result.json({
        success: true,
        message: "Welcome"
    })
})

app.post('/login', (request, result)=>{
    let data = request.body;

    if(data.username == "dokter" && data.password == "dokter"){
        let token = jwt.sign(data.username + '|' + data.password, secretKey)
        result.json({
            success: true,
            message: "Login success",
            token: token
        })
    }else{
        result.json({
            success: "False",
            message: "Prohibited"
        })
    }
})


//CRUD Dokter
app.get('/dokter', isAuthorized, (req, res) =>{
    let sql = "select * from dokter"

    db.query(sql, (err, result) =>{
        if(err) throw err

        res.json({
            message: "Success",
            data: result
        })
    })
})

app.post('/input/dokter', isAuthorized, (req, res)=>{
    let data = req.body
    let sql = `insert into dokter (nama, alamat, telepon, specialist, id_rumahsakit)
        values('`+data.nama+`', '`+data.alamat+`', '`+data.specialist+`','`+data.id_rumahsakit+`')
    `
    db.query(sql, (err, result) =>{
        if(err) throw err

        res.json({
            success: true,
            message: 'success added dokter'
        })
    })
})

app.put('/update/dokter/:id', isAuthorized, (req, res) =>{
    let data = req.body

    let sql = `update dokter set 
                nama = '`+data.nama+`',
                alamat = '`+data.nama+`',
                telepon = '`+data.telepon+`'
                where id = '`+req.params.id+`'
            `
    db.query(sql, (err, result) =>{
        if(err) throw err
        
        res.json({
            success: true,
            message: 'success update dokter',
            data: result
        })
    })
})

app.delete('/delete/dokter/:id', (req, res) =>{
    let sql = `delete from dokter where id = '`+req.params.id+`'`

    db.query(sql, (err) =>{
        if(err) throw err

        res.json({
            success: true,
            message: 'success delete dokter'
        })
    })
})

app.listen(port, () =>{
    console.log('App run on port ' + port)
})
