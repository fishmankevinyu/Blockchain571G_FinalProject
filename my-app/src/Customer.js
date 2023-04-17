import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import Web3 from 'web3';


const Customer = () => {
  const history = useHistory();
  const [selectedFood, setSelectedFood] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

const [foodOptions, setFoodOptions] = useState([
    { name: 'Sushi Mura', price: 0.002 },
    { name: 'FriedChickenlover', price: 0.002 },
    { name: 'Thai Express', price: 0.004 },
    { name: 'MacDonald', price: 0.005 },
    { name: 'Pasta House', price: 0.006 },
    { name: 'Salad Lover', price: 0.006 },
    { name: 'IceCream ', price: 0.008 },
    { name: 'Steak House', price: 0.01 }
  ]);

  //Admin calls this func to add restaurant in 
  const updateFoodOptions = (newFoodOptions) => {
    setFoodOptions(newFoodOptions);
  }

  // Function to handle adding food to cart
  const handleAddToCart = (food, price) => {
    
    setCart(prevCart => [...prevCart, { food, price }]);
    setTotalAmount(prevTotalAmount => prevTotalAmount + price);
  }

  // Function to handle removing food from cart
  const handleRemoveFromCart = (food, price) => {
   
    setCart(prevCart => prevCart.filter(item => item.food !== food));
    setTotalAmount(prevTotalAmount => prevTotalAmount - price);
  }

  const handlePlaceOrder = () => {
   
    history.push('/pay-my-order');
  };

  return (
    <div style={{ backgroundColor: '#e4f1fe', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '55px' , color: '#263849', fontWeight:'bold'}}>Welcome to the Customer Home Page</h1>
        <p style={{ fontSize: '30px',  }}>Please Choose the Restaurant You Want to Order</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
          {foodOptions.map((food, index) => (
            <div key={index}>
              <p style={{ fontSize: '20px', marginBottom: '5px' , color:'#005792', fontWeight:'bold'}}>{food.name}</p>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>{food.price} ETH</p>
              <button onClick={() => handleAddToCart(food.name, food.price)} style={{ fontSize: '20px', padding: '10px 20px', fontWeight:'bold'}}>Add to Cart</button>
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: '24px', marginTop: '20px' }}>Cart:</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ backgroundColor: '#edf7fa', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', marginBottom: '5px', color:'#005792', fontWeight:'bold'}}>{item.food}</p>
              <p style={{ fontSize: '15px', marginBottom: '5px' }}>{item.price} ETH</p>
              <button onClick={()=> handleRemoveFromCart(item.food, item.price)} style={{ fontSize: '16px', padding: '5px 10px', backgroundColor: '#007cb9', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>
            <h2 style={{ fontSize: '24px', marginTop: '20px' }}>Total Amount:</h2>
            <p style={{ fontSize: '20px', marginTop: '10px' }}>{totalAmount} ETH</p>
            <button onClick={handlePlaceOrder} style={{ fontSize: '24px', padding: '10px 20px', backgroundColor: '#007cb9', color: 'white', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }} disabled={cart.length === 0}>Place my order</button>
          </div>
        </div>
      );
    };
    
    export default Customer;
  
// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import Web3 from 'web3';
// import axios from 'axios';

// const Customer = () => {
// const history = useHistory();
// const [selectedFood, setSelectedFood] = useState([]);
// const [cart, setCart] = useState([]);
// const [totalAmount, setTotalAmount] = useState(0);
// const [foodOptions, setFoodOptions] = useState([]);
// const [web3, setWeb3] = useState(null);
// const [contract, setContract] = useState(null);

// useEffect(() => {
// // Initialize Web3
// const initWeb3 = async () => {
// if (window.ethereum) {
// const web3Instance = new Web3(window.ethereum);
// setWeb3(web3Instance);
// try {
// await window.ethereum.enable();
// } catch (error) {
// console.error("User denied account access");
// }
// } else if (window.web3) {
// setWeb3(window.web3);
// } else {
// console.error("No Web3 instance found");
// }
// };
// initWeb3();
// }, []);

// useEffect(() => {
// // Load food options from backend
// const loadFoodOptions = async () => {
// try {
// const response = await axios.get('https://your-backend-url.com/foodOptions');
// setFoodOptions(response.data);
// } catch (error) {
// console.error("Failed to load food options:", error);
// }
// };
// loadFoodOptions();
// }, []);

// useEffect(() => {
// // Load contract instance
// const loadContract = async () => {
// // Replace with your contract address and ABI
// const contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
// const contractABI = [{...}]; // Replace with your contract ABI
// const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
// setContract(contractInstance);
// };
// if (web3) {
// loadContract();
// }
// }, [web3]);

// // Function to handle adding food to cart
// const handleAddToCart = (food, price) => {
// setCart(prevCart => [...prevCart, { food, price }]);
// setTotalAmount(prevTotalAmount => prevTotalAmount + price);
// }

// // Function to handle removing food from cart
// const handleRemoveFromCart = (food, price) => {
// setCart(prevCart => prevCart.filter(item => item.food !== food));
// setTotalAmount(prevTotalAmount => prevTotalAmount - price);
// }

// const handlePlaceOrder = () => {
// history.push('/pay-my-order');
// };

// return (
//     <div style={{ backgroundColor: '#e4f1fe', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <div style={{ textAlign: 'center', padding: '20px' }}>
//         <h1 style={{ fontSize: '55px' , color: '#263849', fontWeight:'bold'}}>Welcome to the Customer Home Page</h1>
//         <p style={{ fontSize: '30px',  }}>Please Choose the Restaurant You Want to Order</p>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
//           {foodOptions.map((food, index) => (
//             <div key={index}>
//               <p style={{ fontSize: '20px', marginBottom: '5px' , color:'#005792', fontWeight:'bold'}}>{food.name}</p>
//               <p style={{ fontSize: '16px', marginBottom: '10px' }}>{food.price} ETH</p>
//               <button onClick={() => handleAddToCart(food.name, food.price)} style={{ fontSize: '20px', padding: '10px 20px', fontWeight:'bold'}}>Add to Cart</button>
//             </div>
//           ))}
//         </div>
//         <h2 style={{ fontSize: '24px', marginTop: '20px' }}>Cart:</h2>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
//           {cart.map((item, index) => (
//             <div key={index} style={{ backgroundColor: '#edf7fa', padding: '10px', textAlign: 'center' }}>
//               <p style={{ fontSize: '20px', marginBottom: '5px', color:'#005792', fontWeight:'bold'}}>{item.food}</p>
//               <p style={{ fontSize: '15px', marginBottom: '5px' }}>{item.price} ETH</p>
//               <button onClick={()=> handleRemoveFromCart(item.food, item.price)} style={{ fontSize: '16px', padding: '5px 10px', backgroundColor: '#007cb9', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Remove</button>
//                 </div>
//               ))}
//             </div>
//             <h2 style={{ fontSize: '24px', marginTop: '20px' }}>Total Amount:</h2>
//             <p style={{ fontSize: '20px', marginTop: '10px' }}>{totalAmount} ETH</p>
//             <button onClick={handlePlaceOrder} style={{ fontSize: '24px', padding: '10px 20px', backgroundColor: '#007cb9', color: 'white', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }} disabled={cart.length === 0}>Place my order</button>
//           </div>
//         </div>
// );
// };

// export default Customer;