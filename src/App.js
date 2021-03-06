import './App.css';
import HomePage from './containers/HomePage';
import ProductListPage from './containers/ProductListPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { isUserLoggedIn, updateCart } from './actions';
import ProductDetailsPage from './containers/ProductDetailsPage';
import CartPage from './containers/CartPage';
import CheckoutPage from './containers/CheckoutPage';
import OrderPage from './containers/OrderPage';
import OrderDetailsPage from './containers/OrderDetailsPage';

function App() {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {

    if(!auth.authenticated){
      dispatch(isUserLoggedIn())
    }

  }, [auth.authenticated])

  useEffect(() => {
    console.log('App.js - useEffect - dispatch updateCart')
    dispatch(updateCart());
  }, [auth.authenticated]);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/cart" component={CartPage}/>
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/account/orders" component={OrderPage} />
          <Route path="/order_details/:orderId" component={ OrderDetailsPage }/>
          <Route path="/:productSlug/:productId/p" component={ProductDetailsPage}/>
          <Route path="/:slug" exact component={ProductListPage} />
        </Switch>
      </Router>
    </div>
  );

}

export default App;