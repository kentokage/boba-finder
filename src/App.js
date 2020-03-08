import React from "react";
import MapContainer from "./containers/MapContainer";

class App extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { pos: null };
	}
	render() {
		return (
			<div className="App">
				<MapContainer pos={this.state.pos} />
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
