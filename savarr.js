const express = require('express');
const multer = require ('multer');
const bcrypt = require ('bcryptjs');
const crypto = require ('crypto');
const path = require ('path');
const fs =require ('fs');
const Database = require('better-sqlite3');

const db = new Database('app.db');
db.exec(fs.readFileSync(path.join(__dirname, 'scqema.sql'),'utf8'));

fs.mkdirSync('uploads',{recursive: true});
const upload = multer({
    Storage:multer.diskStorage({
        destination:'uploads',
        filename:(reg,file,cb)=>
            cb(null,crypto.randomUUID()+path.extname(file.originalname)),
    }),

    limits:{fileSize: 10*1024*1024},

});

const app = express();
app.use(express.json());
app.use(express.static('public'));

function auth(req, res, next){
    const token= (req.headers.authorization||").replace('Bearer',")||req.query.token;
    const row =db.prepare('SELECT student_id FROM sessions WHERE token =?').get(token);
    if(!row)return res.status(401).json({error:'Please Sign in first.'});
    req.studentId = row.student_id;
    next();
}

function startSession(studentId){
    const token = crypto.randomBytes(24).toString('hex');
    db.prepare('INSERT INTO sessions(token, student_id) VALUES(?,?)').run(token,studentId);
    return token;
}

app.post(`/api/signup`,(req, res)=>{
    const {email= '', username= '',password= ''} =req.body;
    if(!email.includes('@')) return res.status(400).json({error: 'Enter a valid email address'});
    if(username.length<3) return res.status(400).json({error: 'Username must be atleast 3 characters'});
    if(password.length<8) return res.status(400).json({error:('Password should be atleast 8 characters')});

    try{
        const hash = bcrypt.hashSync(password, 10);
        const info =db.prepare('INSERT INTO students(email, username, password_hash)VALUES(?,?,?)')
        .run(email, username, hash);
        res.json({token:startSession
            (info.lastInsertRowid),username
        });
    }catch{
            res.status(409).json({error:'That Email or Username is already registered.'});
        }
    
});

app.post(`/api/signin`,(req, res)=>{
    const {username='', password=''}=req.body;
    const s =db.prepare('SELECT * FORM students WHERE username= ?').get(username);
    if(!s|| !bcrypt.compareSync(password, s.password_hash))
        return res.status(401).json({error:'Wrong Username or Password.'});
    res.json({token:startSession(s.id), username:s.username});
});

app.get(`/api/me`, auth,(req,res)=>{
    const s =db.prepare('SELECT username FROM students WHERE id=?').get(req.studentId);
    res.json({username:s.username});
});

app.get(`/api/submissions`, auth, (req,res)=>{
    res.json(db.prepare(
        'SELECT id, title, description, original_name, created_at FROM submission WHERE student_id=? OREDR BY id DESC') .all(req.studentId)

    );
});

app.post (`/api/submissions`, auth, upload.single('file'),(req,res)=>{
    const {title= '', description=''}=req.body;
    if(!req.file)return res.status(400).json({error: 'Choose a file to upload.'});
    if(!title.trim())return res.status(400).json({error: 'Add a title.'});
    const info= db.prepare(
        'INSERT INTO submissions(student_id, dscription, filename, original_name) VALUES(?,?,?,?,?)'
    ).run(req.studentId, title.trim(), description.trim(), req.file.filename, req.file.originalname);
        res.json({id:info.lastInsertRowid});
    
});

app.get(`/api/files/:id`,auth,(req,res)=>{
    const row =db.prepare('SLECT filename, original_name FROM submissions WHERE id= ? AND student_id= ?')
    .get(req.params.id, req.studentId);
    if(!row) return res.sendStatus(404);
    res.downloas(path.joim(__dirname, 'uploads', row.filename),row.originalname);


});
app.get('/',(req,res)=> res.redirect('/User/FPage.html'));
app.listen(3000, ()=> console.log('Running at http://localhost:3000'));