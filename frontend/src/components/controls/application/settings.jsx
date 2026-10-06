
import { useState, useEffect } from "react"
function Settings() {

    const [hide_product, sethide_product] = useState([])
    const [all_admin, setalladmin] = useState([])
    const [hide_id, sethide_id] = useState('')
    const [show, setshow] = useState(false)
    const [show_admin, setshow_admin] = useState(false)
    const [email, setemail] = useState('')

    useEffect(() => {
        Hidden_Banner()
        all_admins()
    }, [])

    async function Hidden_Banner() {
        try {
            const api_Hidden_Banner = await fetch("http://localhost:3000/hidden_banner")
            const data_Hidden_Banner = await api_Hidden_Banner.json()
            console.log(data_Hidden_Banner)
            sethide_product(data_Hidden_Banner.product)

        } catch (error) {
            console.log(error)
        }
    }

    async function Add_Hidden() {
        if (hide_id.trim() == '' || hide_id.trim() == 0) return sethide_id('');
        try {
            const api_add_Hidden = await fetch("http://localhost:3000/add_didden", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: hide_id })
            })
            const data_add_Hidden = await api_add_Hidden.json()
            Hidden_Banner()
            console.log(data_add_Hidden)
            sethide_id('')
            setshow(!show)

        } catch (error) {
            console.log(error)
        }
    }

    async function Disable_Hiding(id_product) {
        try {
            const api_Disable_hiding = await fetch("http://localhost:3000/disable_hiding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id_product })
            })

            const data_Disable_hiding = await api_Disable_hiding.json()
            console.log(data_Disable_hiding)
            Hidden_Banner()


        } catch (error) {
            console.log(error)
        }
    }

    async function add_admin() {
        if (email.trim() == '') return;
        try {
            const api_add_admin = await fetch("http://localhost:3000/add_admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email })
            })
            const data_add_admin = await api_add_admin.json()
            console.log(data_add_admin)
            setemail('')
            all_admins()
        } catch (error) {
            console.log(error)
        }
    }

    async function all_admins() {
        try {
            const api_all_admin = await fetch("http://localhost:3000/all_admins")
            const data_all_admin = await api_all_admin.json()
            console.log(data_all_admin)
            setalladmin(data_all_admin.admins)

        } catch (error) {
            console.log(error)
        }
    }

    async function remove_admin(id_user) {
        if (id_user.trim() == '') return;
        try {
            const api_remove_admin = await fetch("http://localhost:3000/remove_admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id_user })
            })
            const data_remove_admin = await api_remove_admin.json()
            all_admins()
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="Settings">
            <h2>Settings</h2>

            <div className="settings_totle">
                <div className="hide_or_show_product">
                    <div className="add_hidden">
                        <button className="show" onClick={() => setshow(!show)}>Do you want to hide the product?</button>
                        {show && <div className="group_add">
                            <label htmlFor="id">enter id product</label>
                            <div className="add_inp">
                                <input onChange={(e) => sethide_id(e.target.value)} value={hide_id} type="number" placeholder="enter id product" id="id" />
                                <button onClick={() => Add_Hidden()}>hidden</button>
                            </div>
                        </div>
                        }
                    </div>

                    <div className="everything_hidden">
                        {hide_product.length == 0 ?
                            'There are no hidden orders.' :
                            <>
                                <div className="t_header">
                                    <p>img</p>
                                    <p>name</p>
                                    <p>id </p>
                                    <p>show</p>
                                </div>
                                {hide_product.map((item, index) => (
                                    <div className="won_product" key={index}>
                                        <img src={item.image} alt="product" />
                                        <p>{item.name}</p>
                                        <p>{item.id}</p>
                                        <button onClick={() => Disable_Hiding(item.id)}>Disable hiding</button>
                                    </div>
                                ))}
                               
                            </>
                        }
                    </div>
                </div>

                <div className="Granting_authorization">
                    <div className="add_admin">
                        <button className="show" onClick={() => setshow_admin(!show_admin)}>Do you want to create an admin?</button>
                        {show_admin && <>
                            <p style={{ opacity: '0.5', margin: '5px 0' }}>Note: Must already be registered.</p>
                            <div className="group_add_admin">
                                <label htmlFor="email">enter email user</label>
                                <div className="add_inp">
                                    <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder="enter email user" id="email" />
                                    <button onClick={() => add_admin()}>hidden</button>
                                </div>
                            </div>
                        </>
                        }
                    </div>


                    <div className="All_admins">
                        <h3 style={{ marginBottom: "20px" }}>Admins list</h3>
                        {all_admin.map((item, index) => (
                            <div className="wonadmin" key={index}>
                                {item.avatar ? <img src={item.avatar} alt="" /> : <div className="avname">{item.name[0]}</div>}
                                <small style={{ fontSize: "15px" }}>{item.id == JSON.parse(localStorage.getItem('id')) ? 'you' : item.name}</small>
                                <button onClick={() => remove_admin(item.id)}>Change to user</button>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Settings