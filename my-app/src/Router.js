import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import Customer from './Customer';
import Restaurant from './Restaurant';
import Delivery from './Delivery';
import PlaceMyOrder from './PlaceMyOrder';
import NewOrderList from './NewOrderList';
import DeliveryCurrentOrder from './DeliveryCurrOrder';
// import Web3 from 'web3';



const MyRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/customer" component={Customer} /> {/* Define route for the Customer component */}

        <Route exact path="/" component={App} />
        <Route path="/restaurant" component={Restaurant} /> {/* Define route for the Res component */}

        <Route exact path="/" component={App} />
        <Route path="/delivery" component={Delivery} /> {/* Define route for the Deli component */}

        <Route exact path="/" component={App} />
        <Route path="/pay-my-order" component={PlaceMyOrder} /> {/* Define route for the order payment component */}

        <Route exact path="/" component={App} />
        <Route path="/new-order" component={NewOrderList} /> {/* Define route for new order for Rescomponent */}

        <Route exact path="/" component={App} />
        <Route path="/deli-curr-order" component={DeliveryCurrentOrder} /> {/* Define route for the curr order Delicomponent */}
        
      </Switch>
    </Router>
  );


export default MyRouter;
