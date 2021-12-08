import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddress, getCartItems, addOrder } from "../../actions";
import Layout from "../../components/Layout";
import {
  Anchor,
  MaterialButton,
  MaterialInput,
} from "../../components/MaterialUI";
import Card from "../../components/UI/Card";
import AddressForm from "./AddressForm";
import PriceDetails from "../../components/PriceDetails";
import CartPage from "../CartPage";

import "./style.css";

/**
 * @author
 * @function CheckoutPage
 **/

// helper function to make each checkout step
const CheckoutStep = (props) => {
  return (
    <div className="checkoutStep">
      <div
        onClick={props.onClick}
        className={`checkoutHeader ${props.active && "active"}`}
      >
        <div>
          <span className="stepNumber">{props.stepNumber}</span>
          <span className="stepTitle">{props.title}</span>
        </div>
      </div>
      {props.body && props.body}
    </div>
  );
};

// render address list when address hasn't been picked
const Address = ({
  adr, // address details to be render
  selectAddress, // pass in selectAddress function to change 'adr.select' to true
  enableAddressEditForm, // pass in function to change 'adr.edit' to true
  confirmDeliveryAddress, // set selectedAddress to the adr, set confirmAddress to true
  onAddressSubmit, // same as confirmDeliveryAddress function?
}) => {
  return (
    <div className="flexRow addressContainer">
      <div>
        <input name="address" type="radio" onClick={() => selectAddress(adr)} />
      </div>
      <div className="flexRow sb addressinfo">
        {!adr.edit ? (
          // Not in edit mode just show the address
          <div style={{ width: "100%" }}>
            <div className="addressDetail">
              <div>
                <span className="addressName">{adr.name}</span>
                <span className="addressType">{adr.addressType}</span>
                <span className="addressMobileNumber">{adr.mobileNumber}</span>
              </div>
              {/* Not in edit mode just show the address, if selected, show Edit button */}
              {adr.selected && (
                <Anchor
                  name="EDIT"
                  onClick={() => enableAddressEditForm(adr)}
                  style={{
                    fontWeigth: "500",
                    color: "#2874f0",
                  }}
                />
              )}
            </div>
            <div className="fullAddress">
              {adr.address} <br />
              {`${adr.state} - ${adr.pinCode}`}
            </div>
            {/* Not in edit mode just show the address, if selected, show DELIVERY HERE button */}
            {adr.selected && (
              <MaterialButton
                onClick={() => confirmDeliveryAddress(adr)}
                title="DELIVERY HERE"
                style={{ width: "200px", margin: "10px 0" }}
              />
            )}
          </div>
        ) : (
          // if in edit mode, render initial data, user can start modify address
          <AddressForm
            withoutLayout={true}
            onSubmitForm={onAddressSubmit}
            initialData={adr}
            onCancel={() => {}}
          />
        )}
      </div>
    </div>
  );
};

// CheckoutPage Component
const CheckoutPage = (props) => {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const [newAddress, setNewAddress] = useState(false);
  const [address, setAddress] = useState([]);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderSummary, setOrderSummary] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(false);
  const [paymentOption, setPaymentOption] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const onAddressSubmit = (addr) => {
    setSelectedAddress(addr);
    setConfirmAddress(true);
    setOrderSummary(true);
  };

  const selectAddress = (addr) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id
        ? { ...adr, selected: true }
        : { ...adr, selected: false }
    );
    setAddress(updatedAddress);
  };

  const confirmDeliveryAddress = (addr) => {
    setSelectedAddress(addr);
    setConfirmAddress(true);
    setOrderSummary(true);
  };

  const enableAddressEditForm = (addr) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
    );
    setAddress(updatedAddress);
  };

  const userOrderConfirmation = () => {
    setOrderConfirmation(true);
    setOrderSummary(false);
    setPaymentOption(true);
  };

  const onConfirmOrder = () => {
    const totalAmount = Object.keys(cart.cartItems).reduce((totalPrice, key) => {
      const { price, qty } = cart.cartItems[key];
      return totalPrice + price * qty;
    }, 0)

    const items = Object.keys(cart.cartItems).map(key => ({
      productId: key,
      payablePrice: cart.cartItems[key].price,
      purchasedQty: cart.cartItems[key].qty,
     })
    )
    const payload = {
      addressId: selectedAddress._id,
      totalAmount,
      items,
      paymentStatus: "pending",
      paymentType: "cod"
    }
    // console.log(payload);
    dispatch(addOrder(payload));
    setConfirmOrder(true);
  }

  // get address from the server when user log in
  // get cartItems from the server when user log in
  useEffect(() => {
    auth.authenticated && dispatch(getAddress()); // for checkout step 2
    auth.authenticated && dispatch(getCartItems()); // for checkout step 3
  }, [auth.authenticated]);

  useEffect(() => {
    const address = user.address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(address);
  }, [user.address]);

  if(confirmOrder){
    return (
      <Layout>
        <Card>
          <div>Thank you</div>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="cartContainer" style={{ alignItems: "flex-start" }}>
        <div className="checkoutContainer">
          {/* check if user logged in or not */}
          <CheckoutStep
            stepNumber={"1"}
            title={"LOGIN"}
            active={!auth.authenticated}
            body={
              auth.authenticated ? (
                <div className="loggedInId">
                  <span
                    style={{ fontWeight: 500 }}
                  >{`${auth.user.firstName} ${auth.user.lastName}`}</span>
                  <span style={{ margin: "0 5px" }}>{auth.user.email}</span>
                </div>
              ) : (
                <div>
                  <MaterialInput label="Email" />
                </div>
              )
            }
          />
          <CheckoutStep
            stepNumber={"2"}
            title={"DELIVERY ADDRESS"}
            active={!confirmAddress && auth.authenticated}
            body={
              <>
                {confirmAddress ? (
                  <div className="stepCompleted">{`${selectedAddress.name} ${selectedAddress.address} - ${selectedAddress.pinCode}`}</div>
                ) : (
                  // if address hasn't picked yet
                  address.map((adr) => (
                    <Address
                      selectAddress={selectAddress}
                      enableAddressEditForm={enableAddressEditForm}
                      confirmDeliveryAddress={confirmDeliveryAddress}
                      onAddressSubmit={onAddressSubmit}
                      adr={adr}
                    />
                  ))
                )}
              </>
            }
          />

          {/* AddressForm */}
          {confirmAddress ? null : newAddress ? (
            <AddressForm onSubmitForm={onAddressSubmit} onCancel={() => {}} />
          ) : (
            <CheckoutStep
              stepNumber={"+"}
              title={"ADD NEW ADDRESS"}
              active={false}
              onClick={() => setNewAddress(true)}
            />
          )}

          <CheckoutStep
            stepNumber={"3"}
            title={"ORDER SUMMARY"}
            active={orderSummary}
            body={
              orderSummary ? (
                <CartPage onlyCartItems={true} />
              ) : orderConfirmation ? (
                <div className="stepCompleted">{Object.keys(cart.cartItems).length} items</div>
              ) : null
            }
          />

          {
            // when orderSummary is active, show email confirmation notice
            orderSummary && (
              <Card
                style={{
                  margin: "10px 0",
                }}
              >
                <div
                  className="flexRow sb"
                  style={{
                    padding: "20px",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "12px" }}>
                    Order Confirmation email will be sent to{" "}
                    <strong>{auth.user.email}</strong>
                  </p>
                  <MaterialButton
                    title="CONTINUE"
                    onClick={userOrderConfirmation}
                    style={{
                      width: "200px",
                    }}
                  />
                </div>
              </Card>
            )
          }

          <CheckoutStep
            stepNumber={"4"}
            title={"PAYMENT OPTIONS"}
            active={paymentOption}
            body={
              paymentOption && <div>
                <div 
                  className="flexRow"
                  style={{
                    alignItems: "center",
                    padding: "20px"
                  }}
                >
                  <input type="radio" name="paymentOption" value="cod" />
                  <div>Cash on delivery</div>
                </div>
                <MaterialButton 
                  title="CONFIRM ORDER"
                  onClick={onConfirmOrder}
                  style={{
                    width:"200px",
                    margin: "0 0 20px 20px"
                  }}
                />
              </div>
            }
          />
        </div>

        <PriceDetails
          totalItem={Object.keys(cart.cartItems).reduce(function (qty, key) {
            // sum of all qty
            return qty + cart.cartItems[key].qty;
          }, 0)}
          totalPrice={Object.keys(cart.cartItems).reduce((totalPrice, key) => {
            const { price, qty } = cart.cartItems[key];
            return totalPrice + price * qty;
          }, 0)}
        />
      </div>
    </Layout>
  );
};

export default CheckoutPage;
