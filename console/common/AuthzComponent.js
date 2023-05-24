/*jshint esversion: 6 */
// Authorization HOC

import React, { Component } from "react";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { authorized } from "./authorization";

class AuthzComponent extends Component {
    constructor(...props) {
        super(...props);
    }

    render() {
        if (authorized(this.props.allowed, this.props.userPermSets, this.props.op)) {
            return this.props.group.enable ? (
                <span className={this.props.group.className} style={this.props.group.style}>
                    { this.props.children }
                </span>
            ) : this.props.children;
        } else {
            return this.props.defaultComponent || null;
        }
    }
}

AuthzComponent.defaultProps = {
    allowed : ["*"],
    op: "or",
    defaultComponent: null,
    group: {
        enable: false,
        className: "", // group element class name
        style: {},
    },
};

const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);
const mapStateToProps = (state) => ({
    userPermSets: userPermSets(state),
});

export default connect(mapStateToProps)(AuthzComponent);