import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import * as actions from "../store/actions";
import { connect } from "react-redux";
import { Spin } from "antd";
import { Link, Redirect } from "react-router-dom";

class AuthPage extends Component {
    constructor() {
        super();
        this.state = { isSignup: false };
    }

    componentWillUnmount() {
        if (this.props.authRedirectPath !== "/") {
            this.props.setAuthRedirectPath("/");
        }
    }

    handleSubmit = (values) => {
        this.props.auth(values.email, values.password, this.state.isSignup);
    };

    render() {
        const { isSignup } = this.state;
        const { isAuthenticated, email } = this.props;
        const layout = {
            labelCol: {
                span: 8,
            },

            wrapperCol: {
                span: 16,
            },
        };

        const tailLayout = {
            wrapperCol: {
                span: 16,
            },
        };

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = <p className="error">{this.props.error.message}</p>;
        }

        const loginForm = (
            <div>
                <h2>{isSignup ? "Sign up" : "Sign in"}</h2>

                <Spin spinning={this.props.loading}>
                    <Form {...layout} name="basic" onFinish={this.handleSubmit}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: "This is not a valid email!",
                                },
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
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
                                    min: 2,
                                    message: "Please input your password!",
                                },
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
                </Spin>
                {errorMessage}
                <Button type="link" onClick={this.switchAuthModeHandler}>
                    {isSignup ? "Sign in" : "Sign up"}
                </Button>
            </div>
        );

        const loggedIn = (
            <>
                <h2>{`Hi ${email}, you're logged in!`}</h2>
                <Link to="/">Home</Link>
                <Link to="/logout">Logout</Link>
            </>
        );

        if (this.props.isAuthenticated) {
            return <Redirect to={this.props.authRedirectPath} />;
        }

        return (
            <div className="authPage">
                {isAuthenticated ? loggedIn : loginForm}
            </div>
        );
    }

    switchAuthModeHandler = () => {
        this.setState((prevState) => {
            return {
                isSignup: !prevState.isSignup,
            };
        });
    };
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: !!state.auth.token,
        email: state.auth.email,
        authRedirectPath: state.auth.authRedirectPath,
    };
};

const { auth, setAuthRedirectPath } = actions;

export default connect(mapStateToProps, { auth, setAuthRedirectPath })(
    AuthPage
);
