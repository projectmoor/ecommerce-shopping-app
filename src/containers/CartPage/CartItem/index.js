import React, { useState, useEffect } from "react";
import { generatePublicUrl } from "../../../urlConfig";
import './style.css';

const CartItem = (props) => {

  const [ qty, setQty ] = useState(props.cartItem.qty);
  const { _id, name, price, img } = props.cartItem;

  const onQuantityIncrement = () => {
    // console.log('quantity before setQty', qty)
    setQty(qty + 1); // update qty in this module, it is asynchronous
  }

  const onQuantityDecrement = () => {
    if(qty <= 1) return; 
    setQty(qty - 1); 
  }

  useEffect(() => {
    props.onQuantityUpdate(_id, qty); // send updated qty back to parent module
  }, [qty]);

  return (
    <div className="cartItemContainer">
      <div className="flexRow">
        <div className="cartProductImgContainer">
          <img src={generatePublicUrl(img)} alt={''} />
        </div>
        <div className="cartItemDetails">
          <div>
              <p>{ name }</p>
              <p>Rs. {price }</p>
          </div>
          <div>Delivery in 3 -5 days</div>
        </div>
      </div>

      <div style={{
          display: 'flex',
          margin: '5px 0'
      }}>
        <div className="quantityControl">
            <button onClick={onQuantityDecrement}>-</button>
            <input value={qty} readOnly />
            <button onClick={onQuantityIncrement}>+</button>
        </div>
        <button className="cartActionBtn">save for later</button>
        <button className="cartActionBtn" onClick={() => props.onRemoveCartItem(_id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
