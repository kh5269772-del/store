
import { useState, useEffect } from "react"
import { GiCheckMark } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";

function AddProduct() {

    const option_size = ['xs', 's', 'm', 'l', 'xl', 'xxl', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];

    const option_color = ['red', 'blue', 'green', 'purple', 'yellow', 'gray', 'pink', 'brown', 'orange', 'black', 'white',];


    const [sizesin, setsizesin] = useState([])
    const [colorsin, setcolorsin] = useState([])
    const [name, setname] = useState('')
    const [price, setprice] = useState('')
    const [category, setcategory] = useState('')
    const [image, setimage] = useState('')
    const [description, setdescription] = useState('')
    const [op_category, setop_category] = useState([])
    const [close, setclose] = useState(false)
    const [check, setcheck] = useState(false)

    useEffect(() => {
        categorys()
    }, [])

    function size_storage(s) {
        if (sizesin.includes(s)) {
            setsizesin(sizesin.filter((e) => e != s))
        } else {
            setsizesin([...sizesin, s])
        }
    }

    function color_storage(c) {
        if (colorsin.includes(c)) {
            setcolorsin(colorsin.filter((e) => e != c))
        } else {
            setcolorsin([...colorsin, c])
        }
    }

    

     async function categorys() {
        try {
            const api_category = await fetch("http://localhost:3000/categorys")
            const data_categry = await api_category.json()
            setop_category(data_categry.category)
     
        } catch (error) {
            console.log(error)
        }
    }


    async function send_product(e) {
        e.preventDefault()

        if (
            name == '' ||
            description == '' ||
            price == '' ||
            category == '' ||
            image == ''
        ) {
            console.log('no data')
            console.log(category)
            setcategory('')
            setclose(true)
            setTimeout(() => {
                setclose(false)
            }, 1000)
            return;
        }

        const formData = new FormData()

        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('image', image)
        formData.append('category', category)
        formData.append('sizes', sizesin)
        formData.append('colors', colorsin)

        emptying()

        try {
            const add_product = await fetch("http://localhost:3000/add/product", {
                method: "POST",
                body: formData
            })
            const data_profuct = await add_product.json()
            console.log(data_profuct)
             categorys()

            if (add_product.status == 201) {
                setcheck(true)
                setTimeout(() => {
                    setcheck(false)
                }, 1000);
            } else {
                setclose(true)
                setTimeout(() => {
                    setclose(false)
                }, 1000);
            }

        } catch (error) {
            console.log(error)

            setclose(true)
            setTimeout(() => {
                setclose(false)
            }, 1000);
        }

    }


   

    function emptying() {
        setname('')
        setdescription('')
        setprice('')
        setcategory('')
        setcolorsin([])
        setsizesin([])

    }

    if (check) {
        return (
            <div className="message_show" style={{ padding: '20px' }}>
                <p>Added successfully</p>
                <i className="Check"><FaRegCheckCircle /></i>
            </div>
        )
    }
    if (close) {
        return (
            <div className="message_show" style={{ padding: '20px' }}>
                <p>An error occurred. Please enter the data correctly.</p>
                <i className="Close"><IoMdCloseCircle /></i>
            </div>
        )
    }




    return (
        <div className="AddProduct">
            <h2>add proguct</h2>
            <form action="" onSubmit={(e) => { send_product(e) }}>

                <div className="ent">
                    <label htmlFor="name" >name</label>
                    <input onChange={(e) => setname(e.target.value)} value={name} type="text" name="name" id="name" />

                    <label htmlFor="description">description</label>
                    <textarea onChange={(e) => setdescription(e.target.value)} value={description} name="description" rows={8} cols={100} id="description"></textarea>

                    <label htmlFor="image">image</label>
                    <input onChange={(e) => setimage(e.target.files[0])} type="file" name="image" id="image" />


                    <div className="toinp">
                        <div className="price">
                            <label htmlFor="price">price</label>
                            <input onChange={(e) => setprice(e.target.value)} value={price} type="number" name="price" id="price" />
                        </div>


                        <div className="category">
                            <label htmlFor="category">category</label>
                            <select  onChange={(e) => setcategory(e.target.value)} name="category" id="category" >
                                <option value="">Select category</option>
                                    {op_category.map((item) => (

                                        <option value={item.name}>{item.name}</option>

                                    ))}
                            

                            </select>
                            {/* <input onChange={(e) => setcategory(e.target.value)} value={category} type="text" name="category" id="category" /> */}

                        </div>

                    </div>
                </div>

                <div className="checkbox">

                    <div>
                        <p className="title">size</p>

                        <div className="sizes">
                            {option_size.map((size) => (
                                <div className="win_size" style={{ cursor: "pointer" }} onClick={() => { size_storage(size) }} >
                                    <p style={{ margin: '0 3px' }}>{size}</p>
                                    <div style={{ width: '20px', height: '20px', border: '1px solid #ffffff80', background: "#161b22", borderRadius: "5px" }}>{sizesin.includes(size) ? <GiCheckMark /> : ""}</div>
                                </div>
                            ))}
                        </div>


                    </div>




                    <div>
                        <p className="title">color</p>

                        <div className="colors">
                            {option_color.map((color) => (
                                <div className="win_size" style={{ cursor: "pointer" }} onClick={() => { color_storage(color) }} >
                                    <span style={{ background: color }}></span>
                                    <p>{color}</p>
                                    <div style={{ width: '20px', height: '20px', border: '1px solid #ffffff80', background: "#161b22", borderRadius: "5px" }}>{colorsin.includes(color) ? <GiCheckMark /> : ""}</div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

                <div className="send">
                    <button type="submit">add product</button>
                </div>
            </form>


        </div>
    )
}
export default AddProduct