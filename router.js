/*
 * router.js 路由模块
 * 职责：
 *      处理路由
 *      根据不同的请求方法+请求路径设置具体的请求处理函数
 * 模块职责要单一，不要乱写
 * 划分模块的目的就是为了增强项目代码的可维护性
 * 提升开发效率
 */

// 原生node用法
// module.exports = function(app) {
//     app.get('/', function(req, res) {
//         fs.readFile("./db.json", function(err, data) {
//             if(err) {
//                 res.render('./views/404.html');
//             } else {
//                 res.render('./template.html', {
//                     students: JSON.parse(data).students,
//                 })
//             }
//         })
//     })
//     console.log('router.js');
// }

//express提供了一种更好的方式
// 1. 专门用来包装路由
var express = require('express');
var fs = require('fs');

// 2. 创建一个路由容器
var router = express.Router();
var myFriends = [
    {name: "baidu", link:"https://www.baidu.com", info: ""},
    {name: "oschina", link:"https://tool.oschina.net/commons"},
    {name: "cnblogs", link:"https://w.cnblogs.com/2050/p/3877280.html"},
    {name: "csdn", link:"https://mp.csdn.net/console/article"},
];

// 整理数组id
function organizeTheStudentId(arr) {
    for(let i = 0; i < arr.length; i ++) {
        arr[i].id = i;
    }
}

// 3. 把路由都挂载到router路由容器中

//渲染个人主页 首页
router.get('/', function(req, res) {
   res.render('./index.html', {
        name: "Jack",
        age: 13,
        hobbies:[
            "code",
            "write",
            "listen",
            "read"
        ],
        title: "Self Message",
        link: "/view/blog",
        friends: myFriends
    });
})

//渲染 添加友情链接页面
router.get('/post',function(req, res) {
    res.render("./post.html");
})

//渲染 get表单提交页面
router.get('/add', function(req, res) {
    myFriends.push(req.query);
    res.redirect("/");
})

//渲染 学生数据列表首页
router.get('/student', function(req, res) {
    fs.readFile('./db.json', function(err, data) {
        if(err) {
            res.render("./404.html");
            return res.satus(500).send('Server err');
        } else {
            let students = JSON.parse(data).students;

            res.render("./template.html", {
                students: students,
                second_title: "学生列表"
            })
        }
    })
})

//处理添加 功能
router.post('/student/addInfo', function(req, res) {
    // 1. 获取表单数据
    // 2. 处理
    // 3. 发送响应
    fs.readFile('./db.json', function(err, data) {
        if(err) {
            return res.satus(500).send('Server err');
        } else {
            let students = JSON.parse(data).students;
            let stuMsg = req.body;
            let id = 0;
            let stu = {
                "id": id,
                "name": stuMsg.stu_name,
                "gender": stuMsg.sex,
                "birth": stuMsg.birth,
                "location": stuMsg.address,
                "hobbies": stuMsg.hobbies,
            };
            students.unshift(stu);
            // 对学生的id 进行重新赋值
            organizeTheStudentId(students);

            fs.writeFile('./db.json', JSON.stringify({students: students}), function(err, data) {
                if(err) {
                    return callback(err);
                }
           })
            res.redirect("/student");
        }
    })
})

//处理修改功能
router.post("/modifyInfo", function(req, res) {
    fs.readFile("./db.json", function(err, data) {
        if(err) {
            return res.status(500).send('Sever err');
        } else {
            let students = JSON.parse(data).students;
            let stuMsg = req.body;
            let id = parseInt(stuMsg.stu_id_modify);

            for(let i = 0; i < students.length; i ++) {
                if(students[i].id ===  id) {
                    students[i].location = stuMsg.stu_addr_modify;
                    students[i].hobbies = stuMsg.stu_hobbies_modify;
                }
            }
            fs.writeFile('./db.json', JSON.stringify({students: students}), function(err, data) {
                if(err) {
                    return callback(err);
                }
           })
            res.redirect("/student");
        }
    })
})

//处理删除功能
router.post("/deleteInfo", function(req, res) {
    fs.readFile("./db.json", function(err, data) {
        if(err) {
            return res.status(500).send('Sever err');
        } else {
            let students = JSON.parse(data).students;
            let stuMsg = req.body;
            let id = parseInt(stuMsg.stu_id_delete);

            for(let i = 0; i < students.length; i ++) {
                if(students[i].id ===  id) {
                    console.log(students[i]);
                    students.splice(i, 1);
                }
            }

            organizeTheStudentId(students); // 对列表id按顺序初始化 0+
            fs.writeFile('./db.json', JSON.stringify({students: students}), function(err, data) {
                if(err) {
                    return callback(err);
                }
           })
            res.redirect("/student");
        }
    })
})
// 4. 把router导出
module.exports = router;
