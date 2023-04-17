import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';


const NewOrderList = ({ onAcceptOrder }) => {
  // State to track the list of new orders and the active order
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const handleAcceptOrder = (order) => {
    onAcceptOrder(order);
    setActiveOrder(order);
  };


  useEffect(() => {
    
    const fetchOrders = async () => {
        const newOrders = [
          { id: 1088, customerName: 'John Doe' },
        ];
        setOrders(newOrders);
       
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ backgroundColor: '#e3f6f5', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 'bold', fontSize: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>New Order List</h1>
        {activeOrder ? (
          // Display the active order
          <div>
            <p>Order ID: {activeOrder.id}</p>
            <p>Customer Name: {activeOrder.customerName}</p>
            <p>Order status: Active</p>
          </div>
        ) : (
          orders.length > 0 ? (
            <ul>
              {orders.map((order, index) => (
                <li key={index}>
                  {/* Display the order details */}
                  <p>Order ID: {order.id}</p>
                  <p>Customer Name: {order.customerName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Currently, there are no new orders.</p>
          )
        )}
      </div>
    </div>
  );
};
export default NewOrderList;

