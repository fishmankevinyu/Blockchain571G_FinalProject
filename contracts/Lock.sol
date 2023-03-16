// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// 1. Customer place order
// 2. Restaurant accept order
// 3. Delivery person accept order
// 4. Restaurant has the order ready to be delivered
// 5. Delivery person confirms the pickup of the order, fee given to restaurant
// 6. Delivery person indicates the delivery of the order
// 7. Customer confirms the delivery of the order, fee given to delivery person
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract RestaurantOrder {

    struct Customer {
        string name;
        uint id;
        string addr;
        uint phone;
        address wallet;
        uint balance;
        bool hasRegistered;
    }

    struct Order {
        uint orderId;
        bool activeOrder;
        address restaurant;
        address customer;
        uint amount;
        bool acceptedRestaurant;
        bool readyForDeli;
        bool acceptedDelivery;
        bool pickedUpDelivery;
        bool completedDeli;
        address delivery_person;
        uint deli_fee;
    }

    struct Restaurant {
        string name;
        uint id;
        string addr;
        string cuisine;
        uint minPayment;
        address wallet;
        bool hasRegistered;
    }

    struct Delivery_Person{
        string name;
        uint id;
        uint phone;
        address wallet;
        bool hasRegistered;
        bool hasActiveOrder;
    }

    uint public orderCount;
    mapping (uint => Order) public orders;
    mapping (address => Customer) public customers;
    mapping (address => Restaurant) public restaurants;
    mapping (address => Delivery_Person) public delivery_person;


    event OrderPlaced(
        uint orderId, 
        address restaurant, 
        address customer, 
        uint amount);
    
    event OrderAccepted(
        uint orderId, 
        address restaurant, 
        address customer, 
        uint amount);
        
    event OrderReady(
        uint orderId, 
        address restaurant, 
        address customer, 
        uint amount);
    
    event OrderPickedup(
        uint orderId,
        address delivery_person,
        address customer,
        uint amount);
    
// 1. Function for customer to place an order
    function placeOrder(address restaurantAddr) public payable {
        require(customers[msg.sender].hasRegistered == true, "You are not registered yet! Please register first.");
        require(restaurants[restaurantAddr].hasRegistered == true, "Invalid restaurant.");
        require(msg.value >= restaurants[restaurantAddr].minPayment, "Insufficient payment.");
        orderCount++;
        orders[orderCount] = Order(orderCount, true, restaurantAddr, msg.sender, msg.value*7/10, false, false, false, false, false, address(0),msg.value/10);

        emit OrderPlaced(orderCount, restaurantAddr, msg.sender, msg.value);
    }
// 2. Function for the restaurant to accpet the order
    function acceptOrderRestaurant(uint _orderId) public {
        require(orders[_orderId].activeOrder, "Inactive order.");
        require(restaurants[msg.sender].hasRegistered == true, "You are not registered yet! Please register first.");
        require(orders[_orderId].restaurant == msg.sender, "You cannot accept this order.");
        require(!orders[_orderId].acceptedRestaurant, "Order already accepted.");

        orders[_orderId].acceptedRestaurant = true;

        emit OrderAccepted(_orderId, msg.sender, orders[_orderId].customer, orders[_orderId].amount);
    }

// 3. Function for delivery person to accept the order
    function acceptOrderDelivery(uint _orderId) public{
        require(delivery_person[msg.sender].hasRegistered, "You are not registered yet! Please register first.");
        require(!delivery_person[msg.sender].hasActiveOrder, "You have an active order right now, please check In first before next attempt.");
        require(orders[_orderId].activeOrder, "Inactive order.");
        require(!orders[_orderId].acceptedDelivery, "Order already accepted.");
        require(orders[_orderId].acceptedRestaurant, "Order not yet accepted by the restaurant");

        delivery_person[msg.sender].hasActiveOrder=true;
        orders[_orderId].acceptedDelivery = true;
        orders[_orderId].delivery_person = msg.sender;
    }

// 4. Function for the restaurant to indicate the order is ready
    function orderReady(uint _orderId) public {
        require(orders[_orderId].activeOrder, "Inactive order.");
        require(restaurants[msg.sender].hasRegistered == true, "You are not registered yet! Please register first.");
        require(orders[_orderId].restaurant == msg.sender, "You cannot complete this order.");
        require(orders[_orderId].acceptedRestaurant, "Order not accepted yet.");
        require(!orders[_orderId].readyForDeli, "Order already ready.");

        orders[_orderId].readyForDeli = true;

        emit OrderReady(_orderId, msg.sender, orders[_orderId].customer, orders[_orderId].amount);
    }
// 5. Function for the delivery person to confirm his pickup of the order
    function pickedUpOrder(uint _orderId) public {
        require(orders[_orderId].activeOrder, "Inactive order.");
        require(delivery_person[msg.sender].hasRegistered == true,"You are not registered yet! Please register first.");
        require(orders[_orderId].delivery_person == msg.sender, "This is not your order.");
        require(orders[_orderId].acceptedRestaurant, "Order not accepted yet.");
        require(orders[_orderId].readyForDeli == true, "Order is not yet ready");
        
        payable(orders[_orderId].restaurant).transfer(orders[_orderId].amount);
        orders[_orderId].pickedUpDelivery = true;
        
        emit OrderPickedup(_orderId, msg.sender, orders[_orderId].customer, orders[_orderId].amount);
    }
// 6. Function for delivery person to confirm his delivery of the order
    function completeOrderDelivery(uint _orderId) public {
        require(orders[_orderId].activeOrder, "Inactive order.");
        require(delivery_person[msg.sender].hasRegistered == true, "You are not registered yet! Please register first.");
        require(orders[_orderId].delivery_person == msg.sender, "You cannot complete this order.");
        // require(orders[_orderId].acceptedDelivery, "Order not accepted yet.");
        require(!orders[_orderId].completedDeli, "Order already completed.");

        delivery_person[msg.sender].hasActiveOrder=false;
        orders[_orderId].completedDeli = true;
    }
// 7. Function for customers to confirm his receipt of the order
    function confirmDelivery(uint _orderId) public {
        require(customers[msg.sender].hasRegistered == true, "You are not registered yet! Please register first.");
        require(orders[_orderId].customer == msg.sender, "This is not your order.");
        // require(orders[_orderId].acceptedDelivery, "Order not accepted by the delivery person yet.");
        require(orders[_orderId].completedDeli, "Order already completed.");
        payable(orders[_orderId].delivery_person).transfer(orders[_orderId].deli_fee);
        orders[_orderId].activeOrder = false;
    }


// Admin withdraw money from the contract, people apply to register, and admin approve

    function registerCustomer(string memory _name, uint _id, string memory _address, uint _phone) public {
        customers[msg.sender] = Customer(_name, _id, _address, _phone, msg.sender, 0, true);
    }

    function registerRestaurant(string memory _name, uint _id, string memory _addr, string memory _cuisine, uint _minPayment) public {
        restaurants[msg.sender] = Restaurant(_name, _id, _addr, _cuisine, _minPayment, msg.sender, true);
    }

    function registerDeliveryPerson(string memory _name, uint _id, uint _phone) public{
        delivery_person[msg.sender] = Delivery_Person(_name, _id, _phone, msg.sender, true, false);
    }

    function getRestaurantMinPayment(address _restaurantAddr) public view returns (uint) {
        return restaurants[_restaurantAddr].minPayment;
    }

    function getCustomerBalance() public view returns (uint) {
        return customers[msg.sender].balance;
    }
// Function for customer to cancel the order
    function withdraw(uint _orderId) public {
        require(!orders[_orderId].acceptedRestaurant, "Cannot cancel order, restaurant already accepted the order.");
        uint amount = customers[msg.sender].balance;
        customers[msg.sender].balance = 0;
        orders[_orderId].activeOrder = false;
        payable(msg.sender).transfer(amount);
    }

    //possible idea: delivery person bid for delivery fee

}