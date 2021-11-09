const express = require('express')
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

// File Upload Package
const fileUpload = require('express-fileupload');
// Validation Middleware
const validateMiddleWare = (req, res, next) => {
    if (req.files == null || req.body.title == null) {
        return res.redirect('/posts/new');
    }
    next();
}

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true });

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/posts/store', validateMiddleWare);

app.get('/', async (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/index.html'))
    const blogposts = await BlogPost.find({})
    res.render('index', {
        blogposts
    });
})
app.get('/about', (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/about.html'))
    res.render('about');
})
app.get('/contact', (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/contact.html'))
    res.render('contact');
})
app.get('/post/:id', async (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/post.html'))
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', {
        blogpost
    });
})
app.get('/posts/new', (req, res) => {
    res.render('create');
})

// Create data
app.post('/posts/store', async (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        });
        res.redirect('/');
    })
})

app.listen(4000, () => {
    console.log('App listening on port 4000');
})