/**
 * Created by tianyun on 2017/4/24.
 */
/*jshint esversion: 6 */
import { connect } from "react-redux";
import { createSelector } from "reselect";
import homeActionCreators from "../actions/homeActionCreators";
import userMgrCreators from "../actions/userMgrCreators";
import authActionCreators from "../actions/authActionCreators";
import Home from "../components/Home";

const hasAdminPerm = createSelector(state => state.login.hasAdminPerm, (hasAdminPerm) => hasAdminPerm);
const isSystemUser = createSelector(state => state.user.isSystemUser, (isSystemUser) => isSystemUser);
const isSuperAdmin = createSelector(state => state.login.isSuperAdmin, (isSuperAdmin) => isSuperAdmin);
const isAdminView = createSelector(state => state.view.adminView, (adminView) => adminView);
const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);
const mapStateToProps = (state, ownProps) => ({
    loggedIn: state.login.loggedIn,
    curMenuKey: state.home.curMenuKey,
    selfInfo: state.user.selfInfo,
    hasAdminPerm: hasAdminPerm(state),
    isSystemUser: isSystemUser(state),
    isSuperAdmin: isSuperAdmin(state),
    isAdminView: isAdminView(state),
    userPermSets: userPermSets(state),
    pathname: ownProps.location.pathname,
});

const mapDispatchToProps = (dispatch) => ({
    getSelfInfo: () => dispatch(userMgrCreators.getSelfInfo()),
    logout: (notifServer) => dispatch(authActionCreators.logout(notifServer)),
    setCurMenuItem: (key) => dispatch(homeActionCreators.setCurMenuItem(key)),
    clearSearchParams: () => dispatch(homeActionCreators.clearSearchParams()),
    toggleAdminView: () => dispatch(userMgrCreators.toggleAdminView()),
    switchToSSView: () => dispatch(userMgrCreators.switchToSSView()),
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeContainer;
