
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const bcrypt = require("bcryptjs")
const multer = require("multer")
const path = require("path")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const { OAuth2Client } = require("google-auth-library")
const app = express()
require("dotenv").config()




const router = require("./router/router")
app.use('/api/stripe', router)

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(cookie())
app.use('/', router)


const client = new OAuth2Client(process.env.GOOGLE_KEY)

const upload = path.join(__dirname, 'uploads')
app.use(express.static(upload))

const publics = path.join(__dirname, 'public')
app.use(express.static(publics))




const PORT = process.env.PORT
const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const CHERSET = process.env.CHERSET
const DATABASE = process.env.DATABASE

const db = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    charset: CHERSET,

})


db.connect((error) => {
    if (error) {
        console.log(error)
        return;
    }
    console.log('mysql connect...')
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const urlmu = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + urlmu + ext)
    }
})


const uploads = multer({ storage: storage })


app.post("/register", uploads.single('avatar'), (req, res) => {
    const { name, email, password } = req.body

    db.query("SELECT email FROM users WHERE email=?", [email], async (error, results) => {
        if (error) {
            console.log(error)
            res.status(404).json({ error: error })
            return;
        }
        if (results.length > 0) {
            res.status(404).json({ message: "email found" })
            return;
        }
        const passhash = await bcrypt.hash(password, 8)
        db.query("INSERT INTO users SET?", {
            name: name,
            email: email,
            avatar: req.file ? 'http://localhost:3000/' + req.file.filename : null,
            password: passhash
        }, (error, results) => {
            if (error) {
                console.log(error)
                res.status(404).json({ error: error })
                return;
            }
            console.log(results)

            const iduser = results.insertId;

            const token = jwt.sign(
                { id: iduser },
                process.env.REFRESH_JWT || 'refresh_select_key_tok',
                { expiresIn: "7d" }
            )
            const cookies = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1E3),
                httpOnly: true,
                secure: false
            }

            const present_token = jwt.sign(
                { id: iduser },
                process.env.PRESENT_JWT || 'present_select_key_tok',
                { expiresIn: '15s' }
            )

            res.cookie("jwt", token, cookies)

            res.status(200).json({
                name: name,
                email: email,
                avatar: req.file ? 'http://localhost:3000/' + req.file.filename : null,
                password: passhash,
                token: present_token,
            })
        })
    })
})




app.post("/login", (req, res) => {
    const { email, password } = req.body
    db.query("SELECT * FROM users WHERE email=?", [email], async (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        const user = results[0]
        if (!user) {
            console.log('passwor no found')
            res.status(500).json({ message: 'user no found' })
            return;
        }
        const passcompare = await bcrypt.compare(password, user.password)
        if (!passcompare) {
            console.log('passwor no found')
            res.status(500).json({ message: 'passwor no found' })
            return;
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.REFRESH_JWT || 'refresh_select_key_tok',
            { expiresIn: '7d' }
        )
        const cookies = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1E3),
            httpOnly: true,
            secure: false
        }
        res.cookie("jwt", token, cookies)

        const present_token = jwt.sign(
            { id: user.id },
            process.env.PRESENT_JWT || 'present_select_key_tok',
            { expiresIn: '15s' }
        )


        res.status(200).json({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: present_token
        })

    })
})





app.post("/google/sing_in", async (req, res) => {
    const credential = req.body['credential'];
    if (!credential) {
        return res.status(500).json({ error: 'Missing credential token' });
    }

    try {
        const checkout = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_KEY
        })
        const payload = checkout.getPayload()


        db.query('SELECT * FROM users WHERE email=?', [payload.email], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }

            if (results.length > 0) {

                const user = results[0]
                const token = jwt.sign(
                    { id: results[0].id },
                    process.env.REFRESH_JWT || 'refresh_select_key_tok',
                    { expiresIn: '7d' }
                )
                const cookies = {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1E3),
                    httpOnly: true,
                    secure: false
                }


                const present_token = jwt.sign(
                    { id: user.id },
                    process.env.PRESENT_JWT || 'present_select_key_tok',
                    { expiresIn: '15s' }
                )

                res.cookie("jwt", token, cookies)

                res.status(201).json({ payload: user, token: present_token, message: 'login' })
                return;

            }

            db.query("INSERT INTO users SET?", {
                name: payload.name,
                email: payload.email,
                avatar: payload.picture
            }, (error, data) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ error: error })
                    return;
                }
                console.log(payload)
                const token = jwt.sign(
                    { id: data.insertId },
                    process.env.REFRESH_JWT || 'refresh_select_key_tok',
                    { expiresIn: '7d' }
                )
                const cookies = {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1E3),
                    httpOnly: true,
                    secure: false
                }

                const present_token = jwt.sign(
                    { id: data.insertId },
                    process.env.PRESENT_JWT || 'present_select_key_tok',
                    { expiresIn: '15s' }
                )

                res.cookie("jwt", token, cookies)
                res.status(201).json({ payload: payload, token: present_token, message: 'register' })
            })
        })



    } catch (error) {
        console.log(error)
    }
})



app.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.status(200).json({ message: 'delete cookie' })
})

// picture 
// `http://localhost:3000/google/register?credential=${params}`



const refresh_token = (req, res, next) => {
    const token = req.cookies.jwt

    jwt.verify(
        token,
        process.env.REFRESH_JWT || 'refresh_select_key_tok',
        (error, result) => {
            if (error) {
                // console.log(error)
                res.status(500).json({ error: error })
                return;
            }

            const present_Token = jwt.sign(
                { id: result.id },
                process.env.PRESENT_JWT || 'present_select_key_tok',
                { expiresIn: '15s' }
            )
            req.token_P = present_Token
            req.userId = result.id

            next()
        }

    )
}





app.get('/refresh_Tok', refresh_token, (req, res) => {
    const token = req.token_P
    if (!token) {
        console.log('no token')
        res.status(401).json({ message: 'no token' })
        return;
    }
    res.status(200).json({ token: token, type: "refresh_token" })

})



const authHeader = (req, res, next) => {
    const token = req.body['authhead']
    if (token == '' || !token) {
        res.status(500).json({ message: "no token" })
        return;
    }

    jwt.verify(
        token,
        process.env.PRESENT_JWT || 'present_select_key_tok',
        (error, user) => {
            if (error) {
                // console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            req.userId = user.id
            next()
        }
    )
}





app.post("/select_data", authHeader, (req, res) => {
    const userId = req.userId


    db.query("SELECT * FROM users WHERE id=?", [userId], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        const user = results[0]
        res.status(200).json({
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            id: user.id,
            email: user.email

        })
    })
})




app.post('/role', authHeader, (req, res) => {

    const userId = req.userId
    db.query("SELECT * FROM users WHERE id=?", [userId], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        const user = results[0]

        if (user.role == 'user') {

            console.log("role no admin")
            res.status(400).json({ role: user.role })
            return;
        }
        if (user.role == 'admin') {
            res.status(200).json({ role: user.role })
        } else {
            res.status(400).json({ role: null })
        }

    })

})



app.post('/add/user', uploads.single('avatar'), (req, res) => {
    const { name, email, password } = req.body
    db.query('SELECT email FROM users WHERE email=?', [email], async (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        if (results.length > 0) {
            res.status(400).json({ message: 'user found' })
            return;
        }

        const passwordHash = await bcrypt.hash(password, 8)

        db.query('INSERT INTO users SET?', {
            name: name,
            email: email,
            password: passwordHash,
            avatar: req.file ? 'http://localhost:3000/' + req.file.filename : null
        }, (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            res.status(201).json({ message: 'add user' })

        })
    })

})



app.get('/users', (req, res) => {
    db.query("SELECT * FROM users ORDER BY id DESC", (error, users) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }

        res.status(200).json({ users: users })

    })
})



app.post('/delete/user', (req, res) => {
    const id = req.query['id']

    db.query('DELETE FROM users WEHER id=?', [id], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ message: 'delete user' })
    })
})


// /add_product



const storagepub = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    },
    filename: (req, file, cb) => {
        const exts = path.extname(file.originalname)
        const urlpu = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + urlpu + exts)
    }

})


const public = multer({ storage: storagepub })

app.post('/add/product', public.single('image'), (req, res) => {
    const { name, price, category, sizes, colors, description } = req.body

    console.log(name, price, category, sizes, colors, description, req.file ? req.file.filename : null)

    db.query("INSERT INTO product SET?", {
        name: name,
        price: price,
        category: category,
        sizes: sizes,
        colors: colors,
        description: description,
        image: req.file ? 'http://localhost:3000/' + req.file.filename : null
    }, (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        console.log(results)
        res.status(201).json({ results: results })
    })
})


app.get('/products', (req, res) => {
    db.query("SELECT * FROM product ORDER BY id DESC", (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(201).json({ products: results })
    })
})


app.get('/delete/product', (req, res) => {
    const id = req.query['id']


    db.query('DELETE FROM product WHERE id=?', [id], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(201).json({ message: 'true delete' })

    })

})



app.post('/add/category', (req, res) => {
    const { name } = req.body
    db.query("SELECT * FROM category WHERE name=?", [name], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        if (results.length > 0) {
            res.status(422).json({ message: 'category is found' })
            return;
        }
        db.query('INSERT INTO category SET?', { name: name }, (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            res.status(201).json({ message: 'category add' })
        })
    })
})




app.get('/categorys', (req, res) => {
    db.query("SELECT * FROM category ORDER BY id ASC", (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ category: results })
    })
})


router.post('/add/order', (req, res) => {
    const { userId, productId, payment_method, quantity } = req.body
    db.query("INSERT INTO orders SET?", {
        userId: userId,
        productId: productId,
        payment_method: payment_method,
        quantity: quantity
    }, (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ message: "Successfully added." })
    })

})

// created_at


router.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY id DESC", (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }

        res.status(200).json({ orders: results })
    })
})

router.get("/orders/success", (req, res) => {
    db.query("SELECT * FROM orders WHERE status=? ORDER BY id DESC", ['success'], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }

        res.status(200).json({ orders: results })
    })
})


router.get('/delete/order', (req, res) => {
    const id = req.query['id']

    db.query('DELETE FROM orders WHERE id=?', [id], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(201).json({ message: 'true delete' })

    })

})







const http = require("http")
const { Server } = require("socket.io")
const { type } = require("os")
const { resolveAny } = require("dns")
const { resourceLimits } = require("worker_threads")
const { error } = require("console")


const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: "*" }
})

const onlineUsers = {};

io.on("connection", (socket) => {
    socket.on("join", (userId) => {
        onlineUsers[userId] = socket.id
        console.log(Object.keys(onlineUsers))
        io.emit('onlineUser', Object.keys(onlineUsers))
    })
    socket.on("disconnect", () => {
        for (const userId in onlineUsers) {
            if (onlineUsers[userId] == socket.id) {
                delete onlineUsers[userId]
                break;
                console.log(Object.keys(onlineUsers))
                io.emit('onlineUser', Object.keys(onlineUsers))
            }
        }
    })
})





server.listen(PORT, () => {
    console.log("server on port " + PORT + '...')
})

// email
// k@gmail.com
// password
// cxcsxcsxc

