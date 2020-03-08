import React, { PureComponent } from "react";
import { AutoComplete } from "antd";

class MapAutoComplete extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			map: this.props.map,
			mapsApi: this.props.mapsApi,
			addSingleMarker: this.props.addSingleMarker,
			updateCurrentUserLatLng: this.props.updateCurrentUserLatLng,
			suggestions: [],
			options: [],
			currentUserLatLng: this.props.currentUserLatLng,
			autocompleteService: this.props.autocompleteService,
			geoCoderService: this.props.geoCoderService,
			mapsLoaded: this.props.mapsLoaded
		};
	}

	componentDidUpdate() {
		this.setState({
			map: this.props.map,
			mapsApi: this.props.mapsApi,
			currentUserLatLng: this.props.currentUserLatLng,
			autocompleteService: this.props.autocompleteService,
			geoCoderService: this.props.geoCoderService,
			mapsLoaded: this.props.mapsLoaded
		});
	}

	handleSearch = value => {
		const { autocompleteService, currentUserLatLng } = this.state;

		if (value.length > 0) {
			const searchQuery = {
				input: value,
				location: currentUserLatLng,
				radius: 30000
			};
			autocompleteService.getQueryPredictions(searchQuery, response => {
				if (response) {
					const options = response.map(resp => {
						return { ...resp, value: resp.description };
					});
					this.setState({ options, suggestion: response });
				}
			});
		}
	};

	onSelect = value => {
		const { mapsApi, map } = this.state;
		this.state.geoCoderService.geocode({ address: value }, response => {
			const { location } = response[0].geometry;
			var lat = location.lat();
			var lng = location.lng();
			const pos = { lat, lng };
			this.props.addSingleMarker(lat, lng, value, response[0].place_id);
			map.panTo(pos);
			this.props.updateCurrentUserLatLng(pos);
		});
	};

	render() {
		const { options } = this.state;
		return (
			<div className="MapAutoComplete">
				<AutoComplete
					options={options}
					onSearch={this.handleSearch}
					onSelect={this.onSelect}
					style={{ width: 200 }}
					placeholder="Enter where you at"
					disabled={!this.props.mapsLoaded}
				/>
			</div>
		);
	}
}

export default MapAutoComplete;
