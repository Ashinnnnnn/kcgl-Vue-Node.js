var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
// 1. 导入中间件
const adminAuth = require('./middlewares/admin-auth')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminArticlesRouter = require('./routes/admin/articles')
const adminCategoriesRouter = require('./routes/admin/categories')
const adminSettingsRouter = require('./routes/admin/settings')
const adminUsersRouter = require('./routes/admin/users')
const adminCoursesRouter = require('./routes/admin/courses')
const adminChaptersRouter = require('./routes/admin/chapters')
const adminChartsRouter = require('./routes/admin/charts')
const adminAuthRouter = require('./routes/admin/auth')


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 2.使用中间件. 后台管理系统的路由需要登录, token验证通过才能访问
app.use('/admin/articles', adminAuth, adminArticlesRouter)
app.use('/admin/categories', adminAuth, adminCategoriesRouter)
app.use('/admin/settings', adminAuth, adminSettingsRouter)
app.use('/admin/users', adminAuth, adminUsersRouter)
app.use('/admin/courses', adminAuth, adminCoursesRouter)
app.use('/admin/chapters', adminAuth, adminChaptersRouter)
app.use('/admin/charts', adminAuth, adminChartsRouter)
// 3.用于登录,所以不需要adminAuth中间件
app.use('/admin/auth', adminAuthRouter)

module.exports = app;
