import React, { Component } from "react";
import { EnvironmentTwoTone } from "@ant-design/icons";

class MapMarker extends Component {
	render() {
		return (
			<div className="MapMarker" key={this.props.key}>
				<EnvironmentTwoTone className="icon" twoToneColor="#eb2f96" />
			</div>
		);
	}
}

export default MapMarker;
