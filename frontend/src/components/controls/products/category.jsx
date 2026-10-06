
import { useState, useEffect } from "react"
function Add_Category() {
    const [categorys, setcategorys] = useState([])
    const [name, setname] = useState('')

    useEffect(() => {
        all_category()
    }, [])

    async function all_category() {
        try {
            const api_all = await fetch('http://localhost:3000/categorys')
            const data_all = await api_all.json()
            console.log(data_all)
            setcategorys(data_all.category)
        } catch (error) {
            console.log(error)
        }
    }

    async function add_category() {

        try {
            const api_add = await fetch('http://localhost:3000/add/category', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name })
            })
            setname('')
            const data_add = await api_add.json()
            console.log(data_add)
            all_category()

        } catch (error) {
            console.log(error)
        }

    }
    return (
        <>
            <div className="Add_Category">
                <h2>add categore</h2>

                <div className="add">
                    <input type="text" placeholder="add category" onChange={(e) => setname(e.target.value)} value={name} />

                    <button onClick={() => add_category()}>add</button>
                </div>



                <div className="show_category">
                    <h2>categores</h2>
                    <div className="group_category" >
                        {categorys.length > 0 ?
                            <>
                                {categorys.map((item, index) => (
                                    <div className="group_category" key={index}>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </> : ''}
                    </div>

                </div>

            </div>
        </>
    )
}
export default Add_Category