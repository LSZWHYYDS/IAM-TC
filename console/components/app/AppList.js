/**
 * Created by shaliantao on 2017/8/24.
 */
/*jshint esversion: 6 */
import React from "react";
import { Button, Breadcrumb, Spin, Icon } from "antd";
import util from "../../common/util";
import { connect } from "react-redux";
import homeActionCreators from "../../actions/homeActionCreators";
import appAPI from "../../api/appAPI";
import AddAppDialog from "./AddAppDialog";
import AppTable from "./AppTable";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
import { Link } from "react-router-dom";

class AppList extends AppTable {
   constructor(...args) {
      super(...args);
      this.state = {
         showAddModal: false,
         isLoading: false,
         deletingApp: null,
         status: (this.props.searchParams && this.props.searchParams.status) || "all",
         appType: (this.props.searchParams && this.props.searchParams.application_type) || "all",
         syncData: true
      };
      this.searchParams = this.props.searchParams || {};
   }
   refreshTable(searchParams, keepSelected) {
      this.props.setSearchParams(searchParams);
      super.refreshTable(searchParams, keepSelected);
   }
   componentDidMount() {
      util.filterDangerousChars();
   }
   handleShowNew() {
      this.setState({
         showAddModal: true
      });
   }
   handleCloseNew() {
      this.setState({
         showAddModal: false
      });
   }
   handleRowSelect(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows;
      let syncData = this.selectedRows.length > 0 ? false : true;
      this.setState({
         syncData
      });
   }
   render() {
      return (
         <Spin spinning={this.state.isLoading} style={{
            position: "fixed", left: "55%", top: "48%", height: 0, width: 0
         }}>
            <div>
               <span className="pathNode">
                  <Breadcrumb separator=">>">
                     <Breadcrumb.Item>{util.t("app.app")}</Breadcrumb.Item>
                  </Breadcrumb>
               </span>
               <div>
                  <div className="searchRow btnsRow">
                     <AuthzComponent allowed={[PERM_SETS.NEW_APP, PERM_SETS.ADMIN_APP]}>
                        <div className="addUser">
                           <Link to={"/home/appInfo/adm"}>
                              {/* onClick={this.handleShowNew.bind(this)} */}
                              <Button type="primary" className="addBtnBg" >
                                 <i className="iconfont icon-add mr-10"></i>
                                 {util.t("app.add")}
                              </Button>
                           </Link>
                        </div>
                     </AuthzComponent>
                  </div>
                  <div>
                     {super.render()}
                  </div>
               </div>
            </div>
            <AuthzComponent allowed={[PERM_SETS.NEW_APP, PERM_SETS.ADMIN_APP]}>
               <AddAppDialog {...this.props.history}
                  show={this.state.showAddModal}
                  onClose={this.handleCloseNew.bind(this)}
                  setLoading={this.setLoading.bind(this)}
               />
            </AuthzComponent>
         </Spin>
      );
   }
}
//default props
AppList.defaultProps = {
   api: appAPI.getList,
   showSelect: true,
   showFilter: true,
   showAction: true,
   showAppDetail: true,
   selectType: true,
};

const mapStateToProps = (state) => ({
   searchParams: state.home.searchParams
});

const mapDispatchToProps = (dispatch) => ({
   setSearchParams: (searchParams) => dispatch(homeActionCreators.setSearchParams(searchParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppList);
