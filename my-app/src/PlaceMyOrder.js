
import React, { useState } from 'react';
import FoodImage from './images/diet.png';
import { useHistory } from 'react-router-dom';
// import Web3 from 'web3';


const PlaceMyOrder = ({ totalAmount }) => {
  const [orderCanceled, setOrderCanceled] = useState(false); 
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const history = useHistory();
  

  const handleCancelOrder = () => {
    setOrderCanceled(true); 
    setTimeout(() => {
      history.push('/customer');
      setOrderCanceled(false);
    }, 3000);
   
  };
  
  const handleConfirmOrder = () => {
    setOrderConfirmed(true); 
    setTimeout(() => {
      history.push('/customer');
      setOrderConfirmed(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#d5eeff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight:'bold', fontSize:'2.5rem' , color:'#132743' }}>Congratulation, your order has been placed!</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        <img src={FoodImage} className="FoodImage" style={{ width: '350px', height: 'auto', alignSelf: 'center' }} />
      </div>
      {/* Apply styles to center the image both horizontally and vertically */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        {orderCanceled ? (
          <p style={{ fontSize: '2rem', color: '#be3144', fontWeight: 'bold' }}>Your Order has been Canceled Successfully</p>
        ): orderConfirmed ? (
            <p style={{ fontSize: '2rem', color: '#be3144', fontWeight: 'bold' }}>Your Order is Confirmed</p>
          )  : (
          <React.Fragment>
            <button style={{ margin: '0 8px', padding: '16px 32px', fontSize: '1.5rem', backgroundColor: '#007cb9', color: 'white'}} onClick={handleCancelOrder}>Cancel My Order</button>
            <button style={{ margin: '0 8px', padding: '16px 32px', fontSize: '1.5rem', backgroundColor: '#007cb9', color: 'white'}} onClick={handleConfirmOrder}>Confirm My Order</button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default PlaceMyOrder;
