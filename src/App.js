import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Hotel from './containers/hotel';
import Room from './containers/room';

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let route = (
			<Switch>
				<Route path="/room/:roomId" component={Room} />
				<Route path="/" exact component={Hotel} />
				<Redirect to="/" />
			</Switch>
		);

		return <div>{route}</div>;
	}
}

export default withRouter(App);
