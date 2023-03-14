// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

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
    }

    struct Order {
        uint orderId;
        address restaurant;
        address customer;
        uint amount;
        bool accepted;
        bool completed;
    }

    struct Restaurant {
        string name;
        uint id;
        string addr;
        string cuisine;
        uint minPayment;
        address wallet;
    }

    uint public orderCount;
    mapping (uint => Order) public orders;
    mapping (address => Customer) public customers;
    mapping (address => Restaurant) public restaurants;

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
        
    event OrderCompleted(
        uint orderId, 
        address restaurant, 
        address customer, 
        uint amount);

    function placeOrder(address restaurantAddr) public payable {
        require(customers[msg.sender].wallet == msg.sender, "Please register first.");
        require(restaurants[restaurantAddr].wallet == restaurantAddr, "Invalid restaurant.");
        require(msg.value >= restaurants[restaurantAddr].minPayment, "Insufficient payment.");
        orderCount++;
        orders[orderCount] = Order(orderCount, restaurantAddr, msg.sender, msg.value, false, false);

        emit OrderPlaced(orderCount, restaurantAddr, msg.sender, msg.value);
    }

    function acceptOrder(uint _orderId) public {
        require(restaurants[msg.sender].wallet == msg.sender, "Please register first.");
        require(orders[_orderId].restaurant == msg.sender, "You cannot accept this order.");
        require(!orders[_orderId].accepted, "Order already accepted.");

        orders[_orderId].accepted = true;

        emit OrderAccepted(_orderId, msg.sender, orders[_orderId].customer, orders[_orderId].amount);
    }

    function completeOrder(uint _orderId) public {
        require(restaurants[msg.sender].wallet == msg.sender, "Please register first.");
        require(orders[_orderId].restaurant == msg.sender, "You cannot complete this order.");
        require(orders[_orderId].accepted, "Order not accepted yet.");
        require(!orders[_orderId].completed, "Order already completed.");

        payable(orders[_orderId].restaurant).transfer(orders[_orderId].amount);

        orders[_orderId].completed = true;

        emit OrderCompleted(_orderId, msg.sender, orders[_orderId].customer, orders[_orderId].amount);
    }

    function registerCustomer(string memory _name, uint _id, string memory _address, uint _phone) public {
        customers[msg.sender] = Customer(_name, _id, _address, _phone, msg.sender, 0);
    }

    function registerRestaurant(string memory _name, uint _id, string memory _addr, string memory _cuisine, uint _minPayment) public {
        restaurants[msg.sender] = Restaurant(_name, _id, _addr, _cuisine, _minPayment, msg.sender);
    }

    function getRestaurantMinPayment(address _restaurantAddr) public view returns (uint) {
        return restaurants[_restaurantAddr].minPayment;
    }

    function getCustomerBalance() public view returns (uint) {
        return customers[msg.sender].balance;
    }

    function withdraw() public {
        uint amount = customers[msg.sender].balance;
        customers[msg.sender].balance = 0;
        payable(msg.sender).transfer(amount);
    }
}