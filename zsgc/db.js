const mysql = require('mysql2');

// 创建数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'zsgc0810'
});
connection.connect();

// 统一的错误处理函数，确保回调是函数类型
const handleCallback = (callback, err, result) => {
    if (typeof callback !== 'function') {
        console.error('Callback is not a function.');
        return;
    }
    callback(err, result);
};

// 查询所有学生数据
const queryStudents = (callback) => {
    const sql = `SELECT * FROM student`;
    connection.query(sql, (err, result) => {
        handleCallback(callback, err, result);
    });
};

// 查询指定 ID 的学生数据或编辑时显示
const queryStudentById = (id, callback) => {
    const sql = 'SELECT * FROM student WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        handleCallback(callback, err, result ? result[0] : null); // 如果没有找到数据，返回 null
    });
};

// 查询指定 ID 或 name 的学生数据
// const queryStudentByIdOrName = (idOrName, callback) => {
//     const sql = 'SELECT * FROM student WHERE id = ? OR name = ?';
//     connection.query(sql, [idOrName, idOrName], (err, result) => {
//         handleCallback(callback, err, result);
//     });
// };
// 查询指定 ID 或 name 的学生数据（使用模糊查询）
const queryStudentByIdOrName = (idOrName, callback) => {
    // 使用 LIKE 来进行模糊查询，id 保持精确匹配
    const sql = 'SELECT * FROM student WHERE id = ? OR name LIKE ?';
    connection.query(sql, [idOrName, `%${idOrName}%`], (err, result) => {
        handleCallback(callback, err, result);
    });
};




// 添加学生
const addStudent = (name, score, site, callback) => {
    const sql = 'INSERT INTO student (name, score, site) VALUES (?, ?, ?)';
    connection.query(sql, [name, score, site], (err, result) => {
        handleCallback(callback, err, result);
    });
};

// 更新学生
const updateStudent = (id, name, score, site, callback) => {
    const sql = 'UPDATE student SET name = ?, score = ?, site = ? WHERE id = ?';
    connection.query(sql, [name, score, site, id], (err, result) => {
        handleCallback(callback, err, result);
    });
};

// 删除学生
const deleteStudent = (id, callback) => {
    const sql = 'DELETE FROM student WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        handleCallback(callback, err, result);
    });
};

// 如果你希望使用 Promise 风格，使用以下方法：
const queryStudentsPromise = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM student`;
        connection.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// 如果你希望使用 async/await 风格，封装查询方法：
const queryStudentsAsync = async () => {
    const sql = `SELECT * FROM student`;
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    queryStudents,
    queryStudentById,
    queryStudentByIdOrName,
    addStudent,
    updateStudent,
    deleteStudent,
    queryStudentsPromise,  // 返回 Promise 风格的查询方法
    queryStudentsAsync      // 返回 async/await 风格的查询方法
};
