import React from "react";
import * as authActions from "../store/actions/auth";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Logout extends React.PureComponent {
    componentDidMount() {
        this.props.logout();
    }

    render() {
        return <Redirect to="/auth" />;
    }
}

const { logout } = authActions;

export default connect(null, { logout })(Logout);
