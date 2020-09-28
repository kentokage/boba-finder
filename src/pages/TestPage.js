import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { withRouter } from "react-router-dom";

class TestPage extends React.PureComponent {
    render() {
        return (
            <div className="testPage">
                <h2>Test Page</h2>
                <Button onClick={this.handleLoginButtonClicked}>
                    Go to login page
                </Button>
            </div>
        );
    }

    handleLoginButtonClicked = (e) => {
        this.props.setAuthRedirectPath("/test");
        this.props.history.push("/auth");
    };
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: !!state.auth.token,
    };
};

const { setAuthRedirectPath } = actions;

export default withRouter(
    connect(mapStateToProps, { setAuthRedirectPath })(TestPage)
);
