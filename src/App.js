import React from "react";
import { MapPage, AuthPage, LogoutPage, TestPage } from "./pages";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions";

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { pos: null };
    }

    componentDidMount() {
        this.props.authCheckState();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                this.setState({ pos });
            });
        }
    }

    render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact path="/">
                        <MapPage pos={this.state.pos} />
                    </Route>
                    <Route exact path="/auth">
                        <AuthPage />
                    </Route>
                    <Route exact path="/logout">
                        <LogoutPage />
                    </Route>
                    <Route exact path="/test">
                        <TestPage />
                    </Route>
                </Switch>
            </div>
        );
    }
}

const { authCheckState } = actions;

export default connect(null, { authCheckState })(App);
