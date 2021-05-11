import React, { useEffect, useState } from 'react';
import {addToDatabaseCart, getDatabaseCart} from '../../../utilities/databaseManager'
import Cart from '../../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';

const Shop = () => {
    // const first10 = fakeData.slice(0, 10);
    // const [products, setProducts] = useState(first10);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('https://mysterious-garden-10561.herokuapp.com/products?search='+search)
        .then(res => res.json())
        .then(data => setProducts(data))
    } ,[search])

    useEffect(() => {
        const savedCart = getDatabaseCart()
        const productKeys = Object.keys(savedCart)
        fetch('https://mysterious-garden-10561.herokuapp.com/productsByKeys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
    },[])

    const handleSearch = event =>{
        setSearch(event.target.value);
        console.log(event.target.value)
    }

    const handleAddProduct = (product) =>{
        const toBedded = product.key
        const sameProduct = cart.find(pd => pd.key === toBedded)
        let count = 1
        let newCart
        if(sameProduct){
            count = sameProduct.quantity + 1
            sameProduct.quantity = count
            const others = cart.filter(pd => pd.key !== toBedded)
            newCart = [...others, sameProduct]
        }
        else{
            product.quantity = 1
            newCart = [...cart, product]
        }

        // const count = sameProduct.length
        // // console.log("click me", product)
        // const newCart = [...cart, product];
        setCart(newCart)
        
        addToDatabaseCart(product.key, count)
    }
    return (
        <div className="twin-container">
            <div className="product-container">
                <input type="text" onBlur={handleSearch} className="product-search" placeholder="Search..."/>
                    {
                        products.map(pd => <Product key={pd.key} showAddToCart={true} handleProduct={handleAddProduct} product={pd}></Product>)
                    }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to={'/review'}><button className="main-button">Review Order</button></Link>    
                </Cart>
            </div>
        </div>
    );
};

export default Shop;