import React from "react";
import MapContainer from "./containers/MapContainer";
import Auth from "./containers/Auth";
import { Switch, Route } from "react-router-dom";

class App extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { pos: null };
	}
	render() {
		return (
			<div className="App">
				<Switch>
					<Route exact path="/">
						<MapContainer pos={this.state.pos} />
					</Route>
					<Route exact path="/auth">
						<Auth />
					</Route>
				</Switch>
			</div>
		);
	}

	componentDidMount() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				this.setState({ pos });
			});
		}
	}
}

export default App;
