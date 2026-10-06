
const express = require('express')
const mysql = require('mysql')
const Stripe = require("stripe")
const emailer = require("nodemailer")

const router = express.Router()


require('dotenv').config()

const stripe = new Stripe(process.env.STRIPE_KEY)


const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const CHARSET = process.env.CHARSET



const db = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    charset: CHARSET
})

db.connect((error) => {
    if (error) {
        console.log(error)
        return;
    }
    console.log('router mysql...')
})



router.post('/details/order', (req, res) => {
    const { id } = req.body
    db.query("SELECT * FROM orders WHERE id=?", [id], (error, order) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        const productId = order[0].productId
        const userId = order[0].userId
        db.query("SELECT * FROM product WHERE id=?", [productId], (error, product) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }

            db.query("SELECT * FROM users WHERE id=?", [userId], (error, user) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ error: error })
                    return;
                }
                res.status(200).json({ order: order[0], product: product[0], user: user[0] })

            })



        })
    })
})



// details




router.post('/payment', async (req, res) => {
    const { productId, productPrice, productName, userId, quantity, color, size } = req.body
    try {

        const account = await stripe.accounts.retrieve();

        console.log("BACKEND STRIPE ACCOUNT:", account.id);

        const sessins = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: productName
                    },
                    unit_amount: productPrice * 100

                },
                quantity: quantity
            }],
            mode: "payment",
            metadata: {
                productId: productId,
                userId: userId,
                quantity: quantity,
                color: color.length > 0 ? color : null,
                size: size.length > 0 ? size : null,

            },

            success_url: 'http://localhost:5173/profile',
            cancel_url: 'http://localhost:5173/'
        })
        console.log("SESSION ID:", sessins.id);
        console.log("SESSION URL:", sessins.url);

        res.json({ url: sessins.url })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
        return;
    }
})

// })




router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers['stripe-signature']
    const FORWARD = process.env.FORWARD
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, FORWARD)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
        return;
    }
    if (event.type == "checkout.session.completed") {
        const sessins = event.data.object

        const productId = sessins.metadata.productId
        const userId = sessins.metadata.userId
        const quantity = sessins.metadata.quantity
        const status = 'success'
        const payment_method = 'card'
        const size = sessins.metadata.size
        const color = sessins.metadata.color




        try {
            db.query("INSERT INTO orders SET?", {
                productId: productId,
                userId: userId,
                quantity: quantity,
                color: color,
                size: size,
                status: status,
                payment_method: payment_method
            }, async (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ error: error })
                    return
                }
                console.log("stripe true ")

                db.query("SELECT * FROM users WHERE id=?", [userId], (error, userAr) => {
                    if (error) {
                        console.log(error)
                        res.status(500).json({ error: error })
                        return
                    }

                    const user = userAr[0]

                    db.query("SELECT * FROM user_message WHERE id=1", async (error, message_da) => {
                        if (error) {
                            console.log(error)
                            res.status(500).json({ error: error })
                            return
                        }
                        const message = message_da[0]

                        const emailCreate = emailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.MY_EMAIL,
                                pass: process.env.EMAIL_KEY,
                            }
                        })

                        const emailsend = await emailCreate.sendMail({
                            from: process.env.MY_EMAIL,
                            to: user.email,
                            text: message.success + " Contact us http://wa.me/" + message.code + message.phone,
                            subject: "RPCTR-12345.",
                        })

                    })

                })

            })
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('no card')
    }
    res.json({ received: true });

})
















router.post('/send/email', async (req, res) => {

    const { user, message } = req.body

    try {
        const email = await emailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.EMAIL_KEY,

            }


        })
        const info = await email.sendMail({
            from: process.env.MY_EMAIL,
            to: user,
            text: message,
            subject: "RPCTR-12345.",
        })
        console.log([
            { message: message },
            { message: typeof message },
            { accepted: info.accepted },
            { rejected: info.rejected },
            { response: info.response },
            { messageId: info.messageId }

        ])
        res.status(200).json({ message: 'Sent successfully.' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
        return;
    }
})


router.get('/orders_req/day', (req, res) => {
    const created = req.query['item']
    const startDate = created + ' 00:00:00'
    const toDate = created + ' 23:59:59'
    console.log(toDate)
    db.query("SELECT * FROM orders WHERE created_at >= ? AND created_at <=? ", [startDate, toDate], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        console.log(results)
        res.status(200).json({ orders: results })
    })
})




router.get("/importMessage", (req, res) => {
    db.query("SELECT * FROM user_message ", (error, data) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ data: data[0] })
    })
})

router.post('/message/user', (req, res) => {
    const { success, cancel, phone, code } = req.body
    db.query("UPDATE user_message SET?", {
        success: success,
        cancel: cancel,
        phone: phone,
        code: code
    }, (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }

        res.status(200).json({ success: success, cancel: cancel, phone: phone })
    })
})




router.post("/Type_Browser", (req, res) => {
    const { platform, brand } = req.body

    const now = new Date()
    const splitDate = now.toISOString().split('T')[0]
    const startDate = `${splitDate.slice(0, -2)}01`
    const endDate = `${splitDate.slice(0, -2)}30`
    console.log(startDate)

    db.query("SELECT * FROM user_agent WHERE date >= ? AND date <= ? AND brand =? ",
        [startDate, endDate, brand], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            // console.log(results)
            if (results.length == 0) {
                db.query("INSERT INTO user_agent SET?", {
                    platform: platform,
                    brand: brand
                }, (error, results) => {
                    if (error) {
                        console.log(error)
                        res.status(500).json({ error: error })
                        return;
                    }
                    console.log({ navintor: "add caller" })
                    res.status(200).json({ navintor: "add caller" })

                })
                return;
            }

            db.query("UPDATE user_agent SET person= person + 1 WHERE date >= ? AND date <= ? AND brand =?",
                [startDate, endDate, brand],
                (error, results) => {
                    if (error) {
                        console.log(error)
                        res.status(500).json({ error: error })
                        return;
                    }
                    console.log({ navintor: "update caller" })

                    res.status(200).json({ navintor: "update caller" })
                })
        })

})


router.get('/users/agent', (req, res) => {
    const now = new Date()
    const splitDate = now.toISOString().split('T')[0]
    const startDate = `${splitDate.slice(0, -2)}01`
    const endDate = `${splitDate.slice(0, -2)}30`

    db.query("SELECT * FROM user_agent WHERE date >=? AND date <=?",
        [startDate, endDate],
        (error, data) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            res.status(200).json({ agent: data })
        })
})


router.get("/latest/transactions", (req, res) => {
    db.query("SELECT * FROM orders WHERE status=? ORDER BY id DESC LIMIT 5", ['success'], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        console.log(results)
        res.status(200).json({ data: results })
    })
})


// router.get("/popular", (req, res) => {
//     db.query("SELECT productId, COUNT(*) AS count_product FROM orders GROUP BY productId ORDER BY count_product DESC LIMIT 5", (error, results) => {
//         if (error) {
//             console.log(error)
//             res.status(500).json({ error: error })
//             return;
//         }
//         console.log(results)
//         res.status(200).json({ results: results })
//     })
// })


router.post("/add_didden", (req, res) => {
    const id = req.body['id']
    db.query("UPDATE product SET is_visible = 0 WHERE id=?", [id], (error, product) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ message: 'update add_didden' })
    })
})



router.post("/disable_hiding", (req, res) => {
    const id = req.body['id']
    db.query("UPDATE product SET is_visible = 1 WHERE id=?", [id], (error, product) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ message: 'update add_didden' })
    })
})

router.get("/hidden_banner", (req, res) => {

    db.query("SELECT * FROM product WHERE is_visible = 0 ORDER BY id DESC", (error, product) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ product: product })
    })
})


router.post("/add_admin", (req, res) => {
    const email = req.body['email']

    db.query('SELECT * FROM users WHERE email=?', [email], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        if (results.length == 0) {
            res.status(400).json({ message: 'email not find' })
            return
        }

        db.query("UPDATE users SET role=? WHERE email=?", ['admin', email], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            console.log(results)
            res.status(201).json({ message: 'update role admin' })
        })
    })
})





router.get("/all_admins", (req, res) => {
    db.query("SELECT * FROM users WHERE role=? ORDER BY id ASC", ['admin'], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ admins: results })
    })
})


router.post("/remove_admin", (req, res) => {
    const id = req.body['id']

    db.query("UPDATE users SET role=? WHERE id=?", ['user', id], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(201).json({ message: 'update role user' })
    })
})


router.post("/details/product", (req, res) => {
    const id = req.body['id']
    db.query("SELECT * FROM product WHERE id=?", [id], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        if (results.length == 0) {
            res.status(400).json({ message: "product not find" })
            return
        }
        res.status(200).json({ product: results[0] })
    })
})


router.get("/product/user/all", (req, res) => {
    db.query("SELECT * FROM product WHERE is_visible = 1 ORDER BY id DESC ",
        (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            res.status(200).json({ products: results })
        })
})




router.post('/add_basket', (req, res) => {
    const { userId, productId, quantity, color, size } = req.body

    db.query("SELECT * FROM basket WHERE userId = ? AND productId = ?",
        [userId, productId],
        (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            if (results.length > 0) {
                res.status(400).json({ message: 'Already in the cart' })
                return;
            }
            db.query("INSERT INTO basket SET?", {
                userId: userId,
                productId: productId,
                quantity: quantity,
                color: color ? color.length > 0 ? color : null : null,
                size: size ? size.length > 0 ? size : null : null
            }, (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ error: error })
                    return;
                }
                res.status(200).json({ message: 'true add basket' })

            })
        })
})


router.post('/user/basket', (req, res) => {
    const userId = req.body['id']

    db.query("SELECT * FROM basket WHERE userId = ? ORDER BY id DESC",
        [userId], (error, basket) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            res.status(200).json({ basket: basket })

        })
})


router.get("/delete/basket", (req, res) => {
    const id = req.query['id']
    db.query("DELETE FROM basket WHERE id=?", [id], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ message: "delete basket" })
    })
})


router.post("/user/order", (req, res) => {
    const userId = req.body['id']
    db.query("SELECT * FROM orders WHERE userId = ? ORDER BY id DESC", [userId], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }

        res.status(200).json({ orders: results })
    })
})

router.get("/All_Data_Registered", (req, res) => {
    db.query("SELECT * FROM users ORDER BY id ASC", (error, users) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        db.query("SELECT * FROM product ORDER BY id ASC", (error, products) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error })
                return;
            }
            db.query("SELECT * FROM orders ORDER BY id ASC", (error, orders) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ error: error })
                    return;
                }
                db.query("SELECT * FROM basket ORDER BY id ASC", (error, baskets) => {
                    if (error) {
                        console.log(error)
                        res.status(500).json({ error: error })
                        return;
                    }
                    console.log({ users: users.length, products: products.length, orders: orders.length, baskets: baskets.length })
                    res.status(200).json({
                        users: users.length,
                        products: products.length,
                        orders: orders.length,
                        baskets: baskets.length
                    })
                })
            })
        })
    })
})




router.get("/top_product", (req, res) => {
    db.query("SELECT productId, COUNT(productId) AS won_product FROM orders GROUP BY productId ORDER BY won_product DESC LIMIT 5", (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: error })
            return;
        }
        res.status(200).json({ results: results })
    })
})

















module.exports = router
