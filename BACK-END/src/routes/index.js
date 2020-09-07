const express = require('express')
const router = express.Router()
const pool = require('../database')
const { isLoggedIn } = require('../lib/auth')

// Main route
router.get('/', isLoggedIn, async (req, res) => {
    var posts = await pool.query('SELECT * FROM posts WHERE (deleted = "1" AND proposed = "1") ORDER BY id DESC')

    for(let i = 0; i < posts.length; i++){
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [posts[i].user_id]) 
        posts[i].by = user[0].username
    }

    posts = posts.slice(0,6)
    res.render('../views/landing/post_list', {posts: posts})
})

router.get('/postlist', isLoggedIn, async (req, res) => {
    const posts = await pool.query('SELECT * FROM posts WHERE (deleted = "1" AND proposed = "1") ORDER BY id DESC')

    for(let i = 0; i < posts.length; i++){
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [posts[i].user_id]) 
        posts[i].by = user[0].username
    }
    res.render('../views/landing/post_preview', {posts: posts})
})

// API REST FOR POSTS
router.get('/posts/get', async (req, res) => {
    const posts = await pool.query('SELECT * FROM posts WHERE (post_type = ? AND deleted = "1" AND proposed = "1") ORDER BY id DESC', ['POST'])

    for(let i = 0; i < posts.length; i++){
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [posts[i].user_id]) 
        posts[i].by = user[0].username
    }
    res.send(posts)
})

router.get('/events/get', async (req, res) => {
    const posts = await pool.query('SELECT * FROM posts WHERE (post_type = ? AND deleted = "1" AND proposed = "1") ORDER BY id DESC', ['EVENT'])

    for(let i = 0; i < posts.length; i++){
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [posts[i].user_id]) 
        posts[i].by = user[0].username
    }
    res.send(posts)
})

router.get('/users/get', async (req, res) => {
    const users = await pool.query('SELECT username, role, name, image_url, description FROM users')
    res.send(users)
})

router.get('/admins/get', async (req, res) => {
    const admins = await pool.query('SELECT username, image_url FROM users WHERE role = "Administrator"')
    res.send(admins)
})

module.exports = router