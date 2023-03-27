const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { ethers, waffle} = require("hardhat");

const eth_payment = 1_000;
  // Contracts are deployed using the first signer/account by default
  

describe("EthEats", function(){
  async function deployEtheatsFixture() {
  
      // Contracts are deployed using the first signer/account by default
      const [admin, rstrt, delivery, customer] = await ethers.getSigners();
  
      const Etheats = await ethers.getContractFactory("RestaurantOrder");
      const etheats = await Etheats.deploy();
  
      return { etheats, admin, rstrt, delivery, customer};
  }


  async function getGasFee(res_tran) {
      const tx = await ethers.provider.getTransaction(res_tran.receipt.transactionHash);
      const gas_price = BigInt(tx.gasPrice);
      const gas_used = BigInt(res_tran.receipt.gasUsed);
      let res = BigInt(gas_price * gas_used);
      return res;
  }

  it("1. Test placing an order successfully", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000);
    // await console.log(etheats.getRequestCustomer())
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0));

    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);
  });

  it("2. Test restaurant accepting the order", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 

    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    expect(await etheats.connect(rstrt).acceptOrderRestaurant(1))
    .to.emit(etheats, "OrderedAccepted").withArgs(1, rstrt.address, customer.address, eth_payment);
    expect((await etheats.orders(1))["acceptedRestaurant"]).to.be.true;
  });

  it("3. Test delivery person accepting the order", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    expect(await etheats.connect(rstrt).acceptOrderRestaurant(1))
    .to.emit(etheats, "OrderedAccepted").withArgs(1, rstrt.address, customer.address, eth_payment);
    expect((await etheats.orders(1))["acceptedRestaurant"]).to.be.true;
    
    expect(await etheats.connect(delivery).acceptOrderDelivery(1))
    .to.emit(etheats, "OrderAcceptedDelivery").withArgs(1, rstrt.address, customer.address, delivery.address, eth_payment);
    expect((await etheats.orders(1))["delivery_person"]).to.be.equal(delivery.address);
  });

  it("4. Test for Indicating an order is ready for delivery", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    expect(await etheats.connect(rstrt).acceptOrderRestaurant(1))
    .to.emit(etheats, "OrderedAccepted").withArgs(1, rstrt.address, customer.address, eth_payment);
    expect((await etheats.orders(1))["acceptedRestaurant"]).to.be.true;
    
    expect(await etheats.connect(delivery).acceptOrderDelivery(1))
    .to.emit(etheats, "OrderAcceptedDelivery").withArgs(1, rstrt.address, customer.address, delivery.address, eth_payment);
    expect((await etheats.orders(1))["delivery_person"]).to.be.equal(delivery.address);

    expect(await etheats.connect(rstrt).orderReady(1)).to.emit(etheats, "OrderReady").withArgs(1, rstrt.address, customer.address, eth_payment)
    expect((await etheats.orders(1))["readyForDeli"]).to.be.true;
  });

  it("5. Test for confirming the pickup of an order by a delivery person", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    expect(await etheats.connect(rstrt).acceptOrderRestaurant(1))
    .to.emit(etheats, "OrderedAccepted").withArgs(1, rstrt.address, customer.address, eth_payment);
    expect((await etheats.orders(1))["acceptedRestaurant"]).to.be.true;
    
    expect(await etheats.connect(delivery).acceptOrderDelivery(1))
    .to.emit(etheats, "OrderAcceptedDelivery").withArgs(1, rstrt.address, customer.address, delivery.address, eth_payment);
    expect((await etheats.orders(1))["delivery_person"]).to.be.equal(delivery.address);

    expect(await etheats.connect(rstrt).orderReady(1)).to.emit(etheats, "OrderReady").withArgs(1, rstrt.address, customer.address, eth_payment)

    expect(await etheats.connect(delivery).pickedUpOrder(1)).to.emit(etheats, "OrderPickedup").withArgs(1, delivery.address, customer.address, eth_payment)    
    expect((await etheats.orders(1))["pickedUpDelivery"]).to.be.true;
  });

  it("6. Test for confirming the delivery of an order by a customer", async function(){
    //load accounts
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    //Placing order
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    //Accepting order
    expect(await etheats.connect(rstrt).acceptOrderRestaurant(1))
    .to.emit(etheats, "OrderedAccepted").withArgs(1, rstrt.address, customer.address, eth_payment);
    expect((await etheats.orders(1))["acceptedRestaurant"]).to.be.true;
    
    //Accepting order delivery
    expect(await etheats.connect(delivery).acceptOrderDelivery(1))
    .to.emit(etheats, "OrderAcceptedDelivery").withArgs(1, rstrt.address, customer.address, delivery.address, eth_payment);
    expect((await etheats.orders(1))["delivery_person"]).to.be.equal(delivery.address);

    //Indicating order ready
    expect(await etheats.connect(rstrt).orderReady(1)).to.emit(etheats, "OrderReady").withArgs(1, rstrt.address, customer.address, eth_payment)

    //Indicating order picked up
    expect(await etheats.connect(delivery).pickedUpOrder(1)).to.emit(etheats, "OrderPickedup").withArgs(1, delivery.address, customer.address, eth_payment) 
  
    //Confirm delivered
    expect(await etheats.connect(delivery).completeOrderDelivery(1)).to.emit(etheats, "OrderCompleteDelivery").withArgs(1, rstrt.address, customer.address, delivery.address, eth_payment)
    expect(await etheats.connect(customer).confirmDelivery(1)).to.emit(etheats, "OrderComplete").withArgs(1, rstrt.address, customer.address, delivery.address, eth_payment)
    expect((await etheats.orders(1))["activeOrder"]).to.be.equal(false);

    
  });




  it("7. Canceled order can't be accepted by the restaurant", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));
    //Placing order
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);
    //Cancel order
    await etheats.connect(customer).cancel(1)
    //Let the restaurant accept the order, and expect to catch an error
    let err = null
    try{
      await etheats.connect(rstrt).acceptOrderRestaurant(1)
    } catch(error){
      err = error
    }
    expect(err).instanceOf(Error)
  });

  // Orders that are not accepted by the restaurant can't be accepted by delivery people
  it("8. Order not accepted by the restaurant yet", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    //Placing order
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);
    //Let the delivery person accept the order, and expect to catch an error
    let err = null
    try{
      await etheats.connect(delivery).acceptOrderDelivery(1)
    } catch(error){
      err = error
    }
    expect(err).instanceOf(Error)
  });



// Cannot pick up order before the order is ready
  it("9. Order not ready by the restaurant", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    //Placing order
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    await etheats.connect(rstrt).acceptOrderRestaurant(1);
    await etheats.connect(delivery).acceptOrderDelivery(1);

    //Let the delivery person accept the order, and expect to catch an error
    let err = null
    try{
      await etheats.connect(delivery).pickedUpOrder(1)
    } catch(error){
      err = error
    }
    expect(err).instanceOf(Error)
  });

  // Cannot confirm delivery before picking up the order
  it("10. Order not yet picked up", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    //Placing order and normal behaviors from the restaurant and delivery
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    await etheats.connect(rstrt).acceptOrderRestaurant(1);
    await etheats.connect(delivery).acceptOrderDelivery(1);
    await etheats.connect(rstrt).orderReady(1);
    //Let the delivery person complete the order, and expect to catch an error
    let err = null
    try{
      await etheats.connect(delivery).completeOrderDelivery(1)
    } catch(error){
      err = error
    }
    expect(err).instanceOf(Error)
  });


   // Cannot confirm delivery before picking up the order
   it("11. Order not yet picked up", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    //Placing order and normal behaviors from the restaurant and delivery
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);

    await etheats.connect(rstrt).acceptOrderRestaurant(1);
    await etheats.connect(delivery).acceptOrderDelivery(1);
    await etheats.connect(rstrt).orderReady(1);
    //Let the delivery person complete the order, and expect to catch an error
    let err = null
    try{
      await etheats.connect(delivery).completeOrderDelivery(1)
    } catch(error){
      err = error
    }
    expect(err).instanceOf(Error)
  });

   // Can order after cancel
   it("12. Could reorder after cancelling", async function(){
    const { etheats, admin, rstrt, delivery, customer } = await loadFixture(deployEtheatsFixture);
    await etheats.connect(customer).requestRegisterCustomer("Chen", 001, "123 Nowhere St", 6041341234);
    await etheats.connect(rstrt).requestRegisterRestaurant("HaiDiLao", 010, "123 Somewhere Ave", "Hot pot", 1000); 
    await etheats.connect(delivery).requestRegisterDeliveryPerson("Barry", 100, 7781241234);
    await etheats.connect(admin).registerCustomer(await etheats.request_customers(0));
    await etheats.connect(admin).registerRestaurant(await etheats.request_restaurants(0)); 
    await etheats.connect(admin).registerDeliveryPerson(await etheats.request_delivery_people(0));

    //Placing order and normal behaviors from the restaurant and delivery
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(1,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(1))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(1))["customer"]).to.be.equal(customer.address);
    //Cancel the order
    await etheats.connect(customer).cancel(1);
    expect((await etheats.orders(1))["activeOrder"]).to.be.equal(false);
    // Order again
    expect(await etheats.connect(customer).placeOrder(rstrt.address, { from: customer.address, value: eth_payment }))
    .to.emit(etheats, "OrderPlaced").withArgs(2,  "123 Somewhere Ave", customer.address, eth_payment);
    expect((await etheats.orders(2))["restaurant"]).to.be.equal(rstrt.address);
    expect((await etheats.orders(2))["customer"]).to.be.equal(customer.address);
  });

});