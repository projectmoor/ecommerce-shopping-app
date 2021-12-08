import axios from "../helpers/axios";
import { cartConstants } from "./constants";
import store from "../store";

// Export getCartItems this way so that we can use getCartItems in this file
const getCartItems = () => {
  return async dispatch => {
    try{
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const res = await axios.post(`/user/getCartItems`);
      if(res.status === 200){
        const { cartItems } = res.data;
        console.log({getCartItems: cartItems})
        if(cartItems){
          dispatch({
            type: cartConstants.ADD_TO_CART_SUCCESS,
            payload: { cartItems }
          })
        }
      }
    }catch(error){
      console.log(error)
    }
  }
}

export const addToCart = (product) => {
  return async (dispatch) => {
    const {
      cart: {
        cartItems
      },
      auth
    } = store.getState(); // get local cart data

    const qty = cartItems[product._id]
      ? product.qty
      : 1;

    cartItems[product._id] = {
      ...product,
      qty,
    };

    // if logged in, add local cart to server
    if(auth.authenticated) { 
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST});
      const payload = {
        cartItems: [{ // server cart data format 
          product: product._id,
          quantity: qty
        }]
      }
      console.log('addToCart payload sent to server', payload);
      const res = await axios.post(`/user/cart/addtocart`, payload);
      if(res.status === 201){
        // after add local cart to server, get cart data from server again
        dispatch(getCartItems());
      } 
    } else {
      // if not logged in, update localStorage only
      localStorage.setItem('cart', JSON.stringify(cartItems));
      console.log('local addToCart:', cartItems);

      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems }
      });
    }
  };
};


// updateCart: update server cart and local cart state based on localStorage
export const updateCart = () => {
  return async (dispatch) => {
    const { auth } = store.getState();
    // get local cart data
    let cartItems = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;

    if (auth.authenticated) {
      // if logged in
      localStorage.removeItem('cart');
      // if there is local cart items, repare payload to post to server
      if(cartItems) {
        const payload = { // { {cartItems: {}, {} } }
          cartItems: Object.keys(cartItems).map((key, index) => {
            return {
              quantity: cartItems[key].qty,
              product: cartItems[key]._id
            }
          })
        }
        if(Object.keys(cartItems).length > 0){
          // post to server
          console.log('updateCart payload sent to server', payload);
          const res = await axios.post(`/user/cart/addtocart`, payload);
          if(res.status === 201) {
            // update server succeed, request cart data from server again
            dispatch(getCartItems()) // getCartItems action will take care of 'ADD_TO_CART'
          }
        }
      }
    } else {
      // if not logged in
      if(cartItems){
        // if there is local cart items
        dispatch({
          type: cartConstants.ADD_TO_CART_SUCCESS,
          payload: { cartItems }
        })
      }
    }
  };
};

export const removeCartItem = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: cartConstants.REMOVE_CART_ITEM_REQUEST });
      const res = await axios.post(`/user/cart/removeItem`, { payload });
      if(res.status === 202){
        dispatch({ type: cartConstants.REMOVE_CART_ITEM_SUCCESS });
        dispatch(getCartItems());
      } else {
        const error = res.data;
        dispatch({ type: cartConstants.REMOVE_CART_ITEM_FAILURE, paylaod: { error }});
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// Export getCartItems this way so that we can use getCartItems in this file
export {
  getCartItems
}