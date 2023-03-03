import React from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const FullPizza: React.FC = () => {
    const [pizza, setPizza] = React.useState<{
        imageUrl: string
        title: string
        price: number
    }>()
    const {id} = useParams()
    const navigate = useNavigate()


    React.useEffect(() => {
        async function fetchPizza() {
            try {
                const {data} = await axios.get(`https://63ea3a45e0ac9368d64d5832.mockapi.io/items/${id}`)
                setPizza(data)
            } catch (error) {
                alert('Error')
                navigate('/')

            }
        }

        fetchPizza()
    }, [])

    if (!pizza) {
        return (
            <>'Loading...'</>
        )
    }

    return (
        <div className='container'>
            <img src={pizza.imageUrl}
                 alt={pizza.title}/>
            <h2>{pizza.title}</h2>
            <h4>{pizza.price} ₴</h4>
            <Link to='/'>
                <button className="button button--outline button--add">
                    <span>Назад</span>
                </button>
            </Link>
        </div>
    );
};

export default FullPizza;