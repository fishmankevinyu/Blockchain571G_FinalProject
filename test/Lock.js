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

  it("Test placing an order successfully", async function(){
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

  it("Test restaurant accepting the order", async function(){
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

  it("Test delivery person accepting the order", async function(){
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
    
    await etheats.connect(delivery).acceptOrderDelivery(1)
    expect((await etheats.orders(1))["delivery_person"]).to.be.equal(delivery.address);
  });

});