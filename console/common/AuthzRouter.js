/*jshint esversion: 6 */
// Authorization HOC

import React, { Component } from "react";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { authorized } from "./authorization";

const AuthzRouter = (allowed) => (WrappedComponent) => {
    return class WithAuthorization extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            if (authorized(allowed,this.props.userPermSets,this.props.op)) {
                return (
                    <WrappedComponent {...this.props} />
                );
            } else {
                return this.props.defaultComponent ||
                    (
                        <h1>401 Unauthorized.</h1>
                    );
            }
        }
  };
};

AuthzRouter.defaultProps = {
    allowed : ["*"],
    op: "or",
    defaultComponent: null,
};

const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);
const mapStateToProps = (state) => ({
    userPermSets: userPermSets(state),
});

export default connect(mapStateToProps)(AuthzRouter);