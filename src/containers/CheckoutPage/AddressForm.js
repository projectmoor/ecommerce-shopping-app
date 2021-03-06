import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../actions";
import { MaterialButton, MaterialInput } from "../../components/MaterialUI";

/**
 * @author
 * @function AddressForm
 **/

const AddressForm = (props) => {

  const { initialData } = props;
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [mobileNumber, setMobileNumber] = useState(initialData ? initialData.mobileNumber : "");
  const [zipCode, setZipCode] = useState(initialData ? initialData.zipCode : "");
  const [address, setAddress] = useState(initialData ? initialData.address : "");
  const [cityDistrictTown, setCityDistrictTown] = useState(initialData ? initialData.cityDistrictTown : "");
  const [state, setState] = useState(initialData ? initialData.state : "");
  const [alternatePhone, setAlternatePhone] = useState(initialData ? initialData.alternatePhone : "");
  const [addressType, setAddressType] = useState(initialData ? initialData.addressType : "");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [id, setId] = useState(initialData ? initialData._id : ""); // we need address id to update address

  const inputContainer = {
    width: "100%",
    marginRight: 10,
  };

  const onAddressSubmit = (e) => {
    const payload = {
      address: { 
        name,
        mobileNumber,
        zipCode,
        address,
        cityDistrictTown,
        state,
        alternatePhone,
        addressType,
      },
    };
    console.log('AddressForm.js - onAddressSubmit: payload dispatched to addAddress action', payload);
    // no id when create a new address, yes id when update an existing address
    // server will check if there is id or not, then decide whether it is a update or add operation
    if(id){
      payload.address._id = id;
    }
    dispatch(addAddress(payload)); 
    setSubmitFlag(true);
  };

  useEffect(() => {
    console.log("from AddressForm", user.address)
    if(submitFlag) {
      let _address = {};
      // if update address
      if(id){
        _address = {
          _id: id,
          name,
          mobileNumber,
          zipCode,
          address,
          cityDistrictTown,
          state,
          alternatePhone,
          addressType,
        }
      } else {
        // if create address
        _address = user.address.slice(user.address.length -1)[0] // get the last address in the user.address array
      }
      props.onSubmitForm(_address);
    }
  }, [user.address])// user.address is an array of addresses

  const renderAddressForm = () => {
    return (
      <>
        <div className="flexRow">
          <div style={inputContainer}>
            <MaterialInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <MaterialInput
              label="10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flexRow">
          <div style={inputContainer}>
            <MaterialInput
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="flexRow">
          <div style={inputContainer}>
            <MaterialInput
              label="City/District/Town"
              value={cityDistrictTown}
              onChange={(e) => setCityDistrictTown(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <MaterialInput
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>

        <div className="flexRow">
          <div style={inputContainer}>
            <MaterialInput
              label="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <MaterialInput
              label="Alternate Phone (Optional)"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label>Address Type</label>
          <div className="flexRow">
            <div>
              <input
                type="radio"
                onClick={() => setAddressType("home")}
                name="addressType"
                value="home"
              />
              <span>Home</span>
            </div>
            <div>
              <input
                type="radio"
                onClick={() => setAddressType("work")}
                name="addressType"
                value="work"
              />
              <span>Work</span>
            </div>
          </div>
        </div>
        <div className="flexRow">
          <MaterialButton
            title="SAVE AND DELIVER HERE"
            onClick={onAddressSubmit}
            style={{
              width: "250px",
              margin: "20px 0",
            }}
          />
        </div>
      </>
    );
  };

  if (props.withoutLayout) {
    return <div>{renderAddressForm()}</div>;
  }

  return (
    <div className="checkoutStep" style={{ background: "#f5faff" }}>
      <div className={`checkoutHeader`}>
        <div>
          <span className="stepNumber">+</span>
          <span className="stepTitle">{"ADD NEW ADDRESS"}</span>
        </div>
      </div>
      <div
        style={{
          padding: "0 60px",
          paddingBottom: "20px",
          boxSizing: "border-box",
        }}
      >
        {renderAddressForm()}
      </div>
    </div>
  );
};

export default AddressForm;