
// export default PlaceMyOrder;
import React, { useState } from 'react';
import ResImage from './images/bibimbap.png';
import { useHistory } from 'react-router-dom';
import NewOrderList from './NewOrderList';
// import Web3 from 'web3';


const Restaurant = ({ totalAmount }) => {
  const history = useHistory();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); 

  
  const handleCheckNewOrder = () => {
    if (isRegistered) {
      history.push('/new-order');
    }else {
      alert("Only registered restaurants can check orders."); 
    }
  };

  const handleConfirmOrder = () => {
    if (isRegistered) {
      setOrderConfirmed(true);
      setTimeout(() => {
        setOrderConfirmed(false);
      }, 3000); 
    }
  };

  
  const handleRegistered = () => {
    setIsRegistered(true); 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#fcf4d9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight:'bold', fontSize:'2.5rem' , color:'black' }}>Welcome to the Your Restaurant Home Page</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        <img src={ResImage} className="FoodImage" style={{ width: '200px', height: 'auto', alignSelf: 'center' }} />
      </div>
      {/* Apply styles to center the image both horizontally and vertically */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
        { orderConfirmed ? (
            <p style={{ fontSize: '2rem', color: '#272343', fontWeight: 'bold' }}>Order confirmed successfully</p>
          ):
           (
          <React.Fragment>
            {isRegistered ? (
              <React.Fragment>
                <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#ffb03b', color: 'black', fontWeight:'bold'}} onClick={handleCheckNewOrder}>Check New Order</button>
                <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#ffb03b', color: 'black', fontWeight:'bold'}} onClick={handleConfirmOrder}>Confirm My Order</button>
              </React.Fragment>
            ) : (
              <button style={{ margin: '0 40px', padding: '18px 32px', fontSize: '1.5rem', backgroundColor: '#ffb03b', color: 'black', fontWeight:'bold'}} onClick={handleRegistered}>Get Registered</button>
            )}
          </React.Fragment>
        )}
      </div>
      </div>
     );
  }
      export default Restaurant;