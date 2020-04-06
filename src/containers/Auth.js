import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import * as actions from "../store/actions";
import { connect } from "react-redux";

class Auth extends Component {
	handleSubmit = values => {
		console.log("Success:", values);
		// this.props.onAuth(this.state.email.value, this.state.password.value);
	};

	render() {
		const layout = {
			labelCol: {
				span: 8
			},

			wrapperCol: {
				span: 16
			}
		};

		const tailLayout = {
			wrapperCol: {
				offset: 8,
				span: 16
			}
		};

		return (
			<div className="Auth">
				<Form {...layout} name="basic" onFinish={this.handleSubmit}>
					<Form.Item
						label="Email"
						name="Email"
						rules={[
							{
								type: "email",
								message: "This is not a valid email!"
							},
							{
								required: true,
								message: "Please input your email!"
							}
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								min: 6,
								message: "Please input your password!"
							}
						]}
						hasFeedback
					>
						<Input />
					</Form.Item>
					<Form.Item {...tailLayout}>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password) => dispatch(actions.auth(email, password))
	};
};

export default Auth;
// export default Form.create()(connect(null, mapDispatchToProps)(Auth));
