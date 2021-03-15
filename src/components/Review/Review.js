import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
import happyImage from '../../images/giphy.gif'
import { useHistory } from 'react-router';

const Review = () => {
    const [cart, setCart] = useState([])
    const [orderPlaced, setOrderPlaced] = useState(false)
    const history = useHistory()

    const handleProceedCheckOut = () => {
        history.push('/shipment')
    }

    let thankYou;
    if(orderPlaced){
        thankYou = <img src={happyImage} alt=""/>
    }

    const removeProduct = (productKey) => {
        // console.log('remove', productKey)
        const newCart = cart.filter(pd => pd.key !== productKey)
        setCart(newCart)
        removeFromDatabaseCart(productKey)
    }

    useEffect(() => {
        ///cart
        const saveCart = getDatabaseCart()
        const productKeys = Object.keys(saveCart)

        const cartProducts = productKeys.map(key => {
            const product = fakeData.find(pd => pd.key === key)
            product.quantity = saveCart[key]
            return product
        })
        setCart(cartProducts)
    },[])

    
    return (
        <div className="twin-container">
           <div className="product-container">
                <h1>Cart quantity: {cart.length}</h1> 
                {
                    cart.map(pd => <ReviewItem removeProduct={removeProduct} key={pd.key} product={pd}></ReviewItem>)
                }
                { thankYou }
           </div>
           <div className="cart-container">
               <Cart cart={cart}>
                   <button onClick={handleProceedCheckOut} className="main-button">Proceed Checkout</button>
               </Cart>
           </div>
        </div>
    );
};

export default Review;