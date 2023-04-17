import React from 'react';
import './App.css';
import bgImage from './images/background1.png'; 
import logoImage from './images/logo.png'; 
import { useHistory } from 'react-router-dom'; 
// import Web3 from 'web3';

function App() {
  const history = useHistory();

  const handleCustomerClick = () => {
    history.push('/customer');
  }

  const handleRestaurantClick = () => {
    history.push('/restaurant');
  }
  const handleDeliveryClick = () => {
    history.push('/delivery');
  }

  return (
    <div>
      {/* <MyRouter /> Render the MyRouter component */}
      <div className="container" style={{backgroundImage: `url(${bgImage})`}}>
        <header className="App-header">
          <img src={logoImage} className="App-logo" alt="logonpm" />
          <p>
            Welcome to Food Delivery DAP!
          </p>
          <div className="button-container">
            <button className="button-customer" onClick={handleCustomerClick}>Customer</button>
            <button className="button-restaurant"  onClick={handleRestaurantClick}>Restaurant</button>
            <button className="button-deliveryman" onClick={handleDeliveryClick}>Delivery</button>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;
