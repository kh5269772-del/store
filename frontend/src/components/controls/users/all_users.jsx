
import { useState, useEffect, useRef } from "react"
import { RxPinBottom } from "react-icons/rx";
function All_Users() {
    const [users, setusers] = useState([])
    const [status, setstatus] = useState([])
    const [all, setall] = useState([])
    const [id, setid] = useState(false)
    const [scroll, setscroll] = useState(false)


    useEffect(() => {
        selectUsers()
    }, [])

    const divref = useRef(null)
    useEffect(() => {
        const element = divref.current

        if (!element) return;

        function sc() {
            console.log('sfa')
            if (element.scrollTop < 1) {
                setscroll(false)
            } else { setscroll(true) }
        }

        element.addEventListener("scroll", sc)

        return () => element.removeEventListener("scroll", sc)

    }, [divref.current])





    const socket = io('http://localhost:3000')
    const use = JSON.parse(localStorage.getItem('id'))



    useEffect(() => {
        if (use) {
            socket.emit('join', use)
        }
        socket.on('onlineUser', (data) => {
             setstatus(data)
             console.log(data)
            data.forEach((element) => {
               
                console.log(element)
            })

        })
    }, [])



    async function selectUsers() {

        try {
            const userapi = await fetch("http://localhost:3000/users");
            const all_User = await userapi.json()
            // console.log(all_User)
            setusers(all_User.users)
            setall(all_User.users)

        } catch (error) {
            console.log(error)
        }
    }









    async function deleteUser(id) {

        try {
            const delete_api = await fetch(`http://localhost:3000/delete/user?id=${id}`)
            const delete_data = await delete_api.json()
            console.log(delete_data)
            setid(false)
            selectUsers()

        } catch (error) {
            console.log(error)
        }


    }




    function hh(value) {
        setusers([])
        if (value == '') {
           setusers(all)
            return;
        }

        const elemSea = all.filter((element) => {
            return element.name.trim().toLowerCase().includes(value)
        })

        if (!elemSea) {
            setusers('no')

        }
        setusers(elemSea)

    }



    function bottomDa() {
        divref.current.scrollTo({
            behavior: "smooth",
            top: divref.current.scrollHeight
        })
    }











    // if (users.length == 0) {

    //     return (
    //         <div className="" style={{ padding: '20px', fontSize: '25px', fontWeight: "700" }}>No user</div>
    //     )
    // }


    return (
        <div className="All_Users">

            {id ?
                <div className="deleted" >
                    <div className="box_delete">
                        <h3>delete user</h3>
                        <p>Are you sure about deleting it?</p>
                        <div className="tobutton">
                            <div className="butleft">
                                <button onClick={() => deleteUser(id)}>Yeah</button>
                            </div>
                            <div className="butright">
                                <button onClick={() => setid(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div> : ""

            }
            <div className="Registered" id="toSeectionTableForm">

                <div className="datata" ref={divref}>
                    <input onInput={(e) => hh(e.target.value.trim().toLowerCase())} type="text" placeholder="Search by name" />

                    {users.length != 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>avatar</th>
                                    <th>name</th>
                                    <th>email</th>

                                    <th>status</th>
                                    <th>delete</th>

                                </tr>
                            </thead>

                            <tbody>

                                {users.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.avatar ? <img src={item.avatar} alt="" /> : <div className="avname">{item.name[0]}</div>}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>

                                        <td style={status.find((ele) => ele == item.id)? { color: '#15c7a3' } : { color: 'red' }}>{status.find((ele) => ele == item.id) ? 'online' : 'offline'}</td>
                                        <td><button className="deleteUser" onClick={() => setid(item.id)}>delete</button></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table> : <div className="" style={{ padding: '20px', fontSize: '25px', fontWeight: "700" }}>There is no user</div>}

                </div>
                {scroll ? <i className="bottom" onClick={() => bottomDa()}><RxPinBottom /></i> : ''}

            </div>

        </div>
    )
}

export default All_Users