import React from "react";
import GoogleMapReact from "google-map-react";
import MapMarker from "../components/MapMarker";
import MapAutoComplete from "../components/MapAutoComplete";
import PlaceCard from "../components/PlaceCard";
import { Button } from "antd";
import {
	SearchOutlined,
	AimOutlined,
	LoadingOutlined
} from "@ant-design/icons";
import { cloneMap } from "../utils";

const MAP_API_KEY = "AIzaSyBwQDKEdMSdwUt9-ep22TOncRz0XtgCSQw";
const TIME_LIMIT_IN_MINUTES = 30;

class MapContainer extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			pos: props.pos,
			mapsLoaded: false,
			map: {},
			mapsApi: {},
			searchResults: [],
			markers: new Map(),
			currentUserLatLng: {},
			autocompleteService: {},
			placesService: {},
			geoCoderService: {},
			directionService: {}
		};
	}

	componentDidUpdate() {
		this.setState({ pos: this.props.pos });
	}

	render() {
		if (!this.state.pos)
			return (
				<div className="Loading">
					<LoadingOutlined className="icon-large" />
				</div>
			);
		return (
			<div className="MapContainer">
				<section className="GoogleMapReact">
					<div className="search">
						<Button
							type="primary"
							icon={<AimOutlined />}
							onClick={this.getCurrentLocation}
							disabled={!this.state.mapsLoaded}
						></Button>
						<MapAutoComplete
							currentUserLatLng={this.state.currentUserLatLng}
							autocompleteService={this.state.autocompleteService}
							geoCoderService={this.state.geoCoderService}
							mapsApi={this.state.mapsApi}
							map={this.state.map}
							addSingleMarker={this.addSingleMarker}
							updateCurrentUserLatLng={
								this.updateCurrentUserLatLng
							}
							mapsLoaded={this.state.mapsLoaded}
						/>
						<Button
							type="primary"
							icon={<SearchOutlined />}
							onClick={this.handleSearch}
							disabled={!this.state.mapsLoaded}
						>
							Find Boba
						</Button>
					</div>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: MAP_API_KEY,
							libraries: ["places", "directions"]
						}}
						defaultZoom={12}
						defaultCenter={{ lat: 37.774929, lng: -122.419418 }}
						yesIWantToUseGoogleMapApiInternals={true}
						onGoogleApiLoaded={({ map, maps }) =>
							this.apiHasLoaded(map, maps)
						}
					>
						{Array.from(this.state.markers.values()).map(marker => (
							<MapMarker
								name={marker.name}
								key={marker.id}
								lat={marker.lat}
								lng={marker.lng}
							/>
						))}
					</GoogleMapReact>
				</section>
				<div className="results">
					{this.state.searchResults.map(result => (
						<PlaceCard
							place={result}
							key={result.id}
							navigate={this.navigate}
						/>
					))}
				</div>
			</div>
		);
	}

	apiHasLoaded(map, mapsApi) {
		let lat = 37.774929,
			lng = -122.41948;
		this.setState({
			mapsLoaded: true,
			map,
			mapsApi,
			autocompleteService: new mapsApi.places.AutocompleteService(),
			placesService: new mapsApi.places.PlacesService(map),
			directionService: new mapsApi.DirectionsService(),
			geoCoderService: new mapsApi.Geocoder()
		});
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				lat = position.coords.latitude;
				lng = position.coords.longitude;
				var pos = { lat, lng };
				map.setCenter(pos);
				this.setState({
					currentUserLatLng: new mapsApi.LatLng(lat, lng)
				});
			});
		} else {
			var pos = { lat, lng };
			map.setCenter(pos);
			this.setState({
				currentUserLatLng: new mapsApi.LatLng(lat, lng)
			});
		}
	}

	addSingleMarker = (lat, lng, name, id) => {
		const markers = new Map();
		markers.set(id, { lat, lng, name, id });
		console.log(`Added new "${name}" Marker`);
		this.setState({ markers });
	};

	addMarker = (lat, lng, name, id) => {
		const prevMarkers = this.state.markers;
		const markers = cloneMap(prevMarkers);

		if (markers.has(id)) {
			markers.get(id).lat = lat;
			markers.get(id).lng = lng;
			console.log(`Updated "${name}" Marker`);
		} else {
			markers.set(id, { lat, lng, name, id });
			console.log(`Added new "${name}" Marker`);
		}

		this.setState({ markers });
	};

	handleSearch = () => {
		this.setState({ searchResults: [], markers: new Map() });
		const {
			mapsApi,
			directionService,
			placesService,
			currentUserLatLng
		} = this.state;

		const placesRequest = {
			location: currentUserLatLng,
			type: [
				"restaurant",
				"cafe",
				"food",
				"points_of_interest",
				"establishment"
			],
			query: "boba, bubble, tea, milk, drinks, pearls",
			rankBy: mapsApi.places.RankBy.DISTANCE
		};

		placesService.textSearch(placesRequest, response => {
			const responseLength = response.length < 10 ? response.length : 10;
			for (let i = 0; i < responseLength; i++) {
				const place = response[i];
				const address = place.formatted_address;

				const directionRequest = {
					origin: currentUserLatLng,
					destination: address,
					travelMode: "DRIVING"
				};

				directionService.route(directionRequest, (result, status) => {
					if (status !== "OK") return;
					const travelingRoute = result.routes[0].legs[0];
					if (travelingRoute) {
						const travelingTimeInMinutes =
							travelingRoute.duration.value / 60;

						if (travelingTimeInMinutes < TIME_LIMIT_IN_MINUTES) {
							this.addSearchResult(
								place,
								travelingRoute.distance.text,
								travelingRoute.duration.text
							);
							this.addMarker(
								place.geometry.location.lat(),
								place.geometry.location.lng(),
								place.name,
								place.place_id
							);
						}
					}
				});
			}
		});
	};

	addSearchResult(place, distance, duration) {
		let results = [
			...this.state.searchResults,
			{ ...place, distance, duration }
		];
		results = results.sort((a, b) => {
			return b.rating - a.rating;
		});
		this.setState({ searchResults: results });
	}

	getCurrentLocation = () => {
		const { map } = this.state;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				map.panTo(pos);
				this.updateCurrentUserLatLng(pos);
				this.addSingleMarker(pos.lat, pos.lng, "You", "");
			});
		}
	};

	updateCurrentUserLatLng = pos => {
		const { mapsApi } = this.state;
		this.setState({
			currentUserLatLng: new mapsApi.LatLng(pos.lat, pos.lng)
		});
	};

	navigate = place => {
		const { currentUserLatLng } = this.state;
		const BASE_URL = "https://www.google.com/maps/dir/";
		const origin = `${currentUserLatLng.lat().toString()},
			${currentUserLatLng.lng().toString()}`;
		const url = new URL(BASE_URL);
		url.searchParams.set("api", 1);
		url.searchParams.set("origin", origin);
		url.searchParams.set("destination", place.formatted_address);
		// url.searchParams.set("destination_place_id", place.place_id);
		url.searchParams.set("travelmode", "driving");
		window.open(url);
	};
}

export default MapContainer;
