import React from 'react';
import ReactDOM from 'react-dom';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import reducer from '../src/reduxSaga';
import Saga from '../src/reduxSaga/saga';
import './index.css';
import App from '../src/App';

const history = createBrowserHistory();
const rootReducer = combineReducers({
	router: connectRouter(history),
	booking: reducer,
});

//
// TODO: webpack environment variable ??
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({
	collapsed: true,
	timestamp: false,
});

const middleware = applyMiddleware(logger, routerMiddleware(history), sagaMiddleware);
const store = createStore(rootReducer, composeEnhancers(middleware));

function MyApp() {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ConnectedRouter>
		</Provider>
	);
}
sagaMiddleware.run(Saga);

ReactDOM.render(<MyApp />, document.getElementById('root'));
