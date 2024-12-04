const express = require('express');
const app = express();
const port =3006;
const db =require('./db');
app.set('view engine', 'ejs'); //设置模板引擎未EJS

// 使用 express.urlencoded() 解析 URL 编码的表单数据
app.use(express.urlencoded({ extended: true }));
// 如果要处理 JSON 请求体的话，还需要这个中间件
app.use(express.json());


const path = require('path');

// 配置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));





// 启动定时器，保持数据库连接活跃
setInterval(() => {
    db.queryStudents('SELECT 1', (err, results) => {
      if (err) {
        console.error('Error pinging database:', err);
      } else {
        console.log('Database ping successful');
      }
    });
  }, 600000); // 每10分钟发送一次查询





// 查询学生
app.get('/search', (req, res) => {
    const { query } = req.query; // 获取 URL 查询参数
    if (query) {
        db.queryStudentByIdOrName(query, (err, result) => {
            if (err) {
                return res.send('查询失败');
            }
            res.render('index', { students: result }); // 渲染学生列表
        });
    } else {
        res.redirect('/'); // 如果没有提供查询参数，重定向到主页
    }
});



app.get('/',(req,res)=>{
    // res.send('hello world')

    db.queryStudents((err,result)=>{
        // 确保将查询到的结果传递给模板
        res.render('index',{students: result});
    })

})

// 显示添加学生的表单
app.get('/add', (req, res) => {
    res.render('add');
});

// 处理添加学生请求
app.post('/add', (req, res) => {
    const { name, score, site } = req.body;
    db.addStudent(name, score, site, (err, result) => {
        if (err) {
            return res.status(500).send('Failed to add student');
        }
        res.redirect('/');
    });
});

// 显示编辑学生的表单
app.get('/edit/:id', (req, res) => {
    const studentId = req.params.id;
    db.queryStudentById(studentId, (err, student) => {
        if (err || !student) {
            return res.status(404).send('Student not found');
        }
        res.render('edit', { student });
    });
});

// 处理编辑学生请求
app.post('/edit/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, score, site } = req.body;
    db.updateStudent(studentId, name, score, site, (err, result) => {
        if (err) {
            return res.status(500).send('Failed to update student');
        }
        res.redirect('/');
    });
});

// 处理删除学生请求
app.post('/delete/:id', (req, res) => {
    const studentId = req.params.id;
    db.deleteStudent(studentId, (err, result) => {
        if (err) {
            return res.status(500).send('Failed to delete student');
        }
        res.redirect('/');
    });
});







app.get('/hello',(req,res)=>{
res.render('hello')
})

app.get('/hello/oo',(req,res)=>{
    const ggb =require('./gg');
    res.send(ggb())
})



app.listen(port, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${port}`);
});
