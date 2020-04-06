import React, { PureComponent } from "react";
import { CarTwoTone, SmileTwoTone, MehTwoTone } from "@ant-design/icons";
import { green, orange, red } from "@ant-design/colors";

class PlaceCard extends PureComponent {
	constructor(props) {
		super(props);
		const place = props.place;
		this.place = place;
		this.name = place.name;
		this.formatted_address = place.formatted_address;
		this.price_level = place.price_level;
		this.imageUrl = place.photos[0].getUrl();
		this.open = place.opening_hours.isOpen();
		this.rating = place.rating;
		this.user_ratings_total = place.user_ratings_total;
		this.distance = place.distance;
		this.duration = place.duration;
		this.navigate = props.navigate;
	}

	render() {
		const separator = <span>&nbsp;·&nbsp;</span>;
		return (
			<div
				className="PlaceCard"
				onClick={() => this.props.navigate(this.place)}
			>
				<div className="header">{this.name}</div>
				<img src={this.imageUrl} alt={this.name} />
				<div className="details">
					<div className="sub-header">
						<span>{this.rating} Rating</span>
						{separator}
						<span>{this.user_ratings_total} Reviews</span>
					</div>

					<span className="center">{this.formatted_address}</span>
					<div className="multi-detail">
						<span>
							{new Array(this.price_level).fill("$").join("")}
						</span>
						{separator}
						{this.open ? (
							<div>
								<span>Open </span>
								<SmileTwoTone />
							</div>
						) : (
							<div>
								<span>Closed </span>
								<MehTwoTone />
							</div>
						)}
					</div>
					<div className="multi-detail footer">
						<CarTwoTone className="icon" />

						<span>{this.distance}</span>
						{separator}
						<span>{this.duration}</span>
					</div>
				</div>
			</div>
		);
	}

	computeHeaderBgColor(rating) {
		if (rating >= 4.0) {
			return green[4];
		} else if (rating >= 3.0) {
			return orange[4];
		} else {
			return red[4];
		}
	}
}

export default PlaceCard;
