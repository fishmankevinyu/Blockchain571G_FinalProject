// export default PlaceMyOrder;
import React, { useState } from 'react';
import ResImage from './images/delivery.png';
import { useHistory } from 'react-router-dom';
import DeliveryCurrentOrder from './DeliveryCurrOrder';
// import Web3 from 'web3';


const Delivery = () => {
  const history = useHistory();
  const [orderConfirmPickup, setOrderConfirmPickup] = useState(false);
  const [orderConfirmDeliver, setOrderConfirmDeliver] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); 

  const handleCheckCurrOrder = () => {
    if (isRegistered) {
      history.push('/deli-curr-order');
    }else {
      alert("Only registered restaurants can check orders."); 
    }
  };
  const handleConfirmPickup = () => {
    if (isRegistered) {
      setOrderConfirmPickup(true); 

      setTimeout(() => {
        setOrderConfirmPickup(false);
      }, 3000);

    } else {
      alert("Only registered restaurants can confirm pickup.");
    }
  };

  const handleConfirmFoodDelivery = () => {
    if (isRegistered) {
      setOrderConfirmDeliver(true); 

      setTimeout(() => {
        setOrderConfirmDeliver(false);
      }, 3000);
    } else {
      alert("Only registered restaurants can confirm food delivery."); 
    }
  };

  const handleRegistered = () => {
    setIsRegistered(true); 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#e3f6f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight:'bold', fontSize:'2.5rem' , color:'#272343' }}>Welcome to the Your Delivery Man Home Page</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        <img src={ResImage} className="FoodImage" style={{ width: '200px', height: 'auto', alignSelf: 'center' }} />
      </div>
      {/* Apply styles to center the image both horizontally and vertically */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        {orderConfirmPickup? (
          <p style={{ fontSize: '2rem', color: '#272343', fontWeight: 'bold' }}>Order picked up successfully</p>
        ): orderConfirmDeliver ? (
            <p style={{ fontSize: '2rem', color: '#272343', fontWeight: 'bold' }}>Order delivered successfully</p>
          )  :
           (
          <React.Fragment>
            {isRegistered ? (
              <React.Fragment>
                <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#219897', color: 'black', fontWeight:'bold'}} onClick={handleCheckCurrOrder}>Check Current Order</button>
                <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#219897', color: 'black', fontWeight:'bold'}} onClick={handleConfirmPickup}>Confirm Pickup</button>
                <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#219897', color: 'black', fontWeight:'bold'}} onClick={handleConfirmFoodDelivery }>Confirm Food Delivery</button>
              </React.Fragment>
            ) : (
              <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#35bcbf', color: 'black', fontWeight:'bold'}} onClick={handleRegistered}>Get Registered</button>
            )}
          </React.Fragment>
        )}
      </div>
      </div>
     );
  }
      export default Delivery;