/**
 * Created by tianyun on 2016/12/19.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Table } from "antd";
import util from "./util";

class PagerTable extends Component {
   constructor(...args) {
      super(...args);
      this.state = {
         data: [],
         requestParams: this.props.defaultSearchParams,
         showSelect: this.props.showSelect,
         currentPage: this.props.currentPage || 1,
         selectedRows: [],
         selectedRowKeys: this.props.selectedRowKeys || []
      };
      this.pagination = {
         showSizeChanger: true,
         showTotal: (total) => util.t("common.totalNum", { count: total }),
         pageSize: this.props.pageSize || 10,
         pageSizeOptions: ["10", "20", "30", "40", "50", "100"],
      };
      this.rowSelection = null;
      this.selectedRows = [];
   }
   getData(params, isRefresh, api) {
      if (params && params.application_type) {
         let lowerCase = params.application_type
         params.application_type = lowerCase.toUpperCase()
      }
      this.api = api;
      params = Object.assign({}, params, this.props.params) || {};
      for (let i in params) {
         if (params.hasOwnProperty(i)) {
            if (params[i] === "" && params[i] === null) {
               delete params[i];
            }
         }
      }
      this.state.requestParams = params;
      params.page = this.pagination.current;
      params.size = this.pagination.pageSize || 10;
      const tableApi = this.api || this.props.api;
      tableApi(params).then(
         (response) => {
            if (response.data && response.data.data) {
               let dataRegroup = []
               if (response.data.data.length) {
                  response.data.data.forEach((ele, index) => {
                     dataRegroup[index] = Object.assign({}, ele, ele.config)
                  });
               }
               this.pagination.total = response.data.data.total;
               let states = {
                  data: response.data.data.length ? dataRegroup : response.data.data.items,
                  currentPage: this.pagination.current
               };
               if (isRefresh) {
                  states.selectedRows = [];
                  states.selectedRowKeys = [];
                  this.props.onSelect && this.props.onSelect([], []);
               }
               if (this._isMounted) {
                  this.setState(states);
               }
            }
         },
         (error) => {
            util.showErrorMessage(error);
         }
      );
   }
   refresh(params, keepSelected, api) {
      this.setState({
         currentPage: 1
      });
      this.pagination.current = 1;
      this.getData(params || this.state.requestParams, !keepSelected, api);
   }
   componentDidMount() {
      this._isMounted = true;
      if (this.props.api) {
         this.getData(this.state.requestParams);
      }
      this.props.onMounted && this.props.onMounted();
   }
   componentWillUnmount() {
      this._isMounted = false;
   }
   handleTableChange(pagination) {
      this.pagination = Object.assign({}, this.pagination, pagination);
      this.getData(this.state.requestParams, true, this.api);
   }
   onChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows;
      if (this.props.onSelect) {
         this.props.onSelect(selectedRowKeys, selectedRows);
      }
      this.setState({
         selectedRowKeys: selectedRowKeys,
         selectedRows: selectedRows
      });
   }
   render() {
      if (this.state.showSelect) {
         this.rowSelection = {
            type: this.props.selectType || "checkbox",
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onChange.bind(this)
         };
      }
      this.pagination.current = this.state.currentPage;

      const getRowKey = (row) => {
         if (this.props.rowKey) {
            let names = this.props.rowKey.split("."),
               key = row;

            for (const k of names) {
               if (key[k]) {
                  key = key[k];
               } else {
                  return row.id;
               }
            }
            return key;
         } else {
            return row.id;
         }
      };

      return (
         <div className={this.props.containerClassName} style={{ overflow: "auto" }}>
            <Table bordered
               onRowMouseEnter={this.props.onRowMouseEnter}
               onRowMouseLeave={this.props.onRowMouseLeave}
               rowKey={record => getRowKey(record)}
               columns={this.props.columns}
               scroll={this.props.scroll}
               dataSource={this.state.data}
               pagination={!this.props.hidePagination && this.pagination}
               rowClassName={this.props.rowClassName}
               rowSelection={this.rowSelection}
               onChange={this.handleTableChange.bind(this)}
            />
         </div>
      );
   }
}
PagerTable.defaultProps = {
   containerClassName: "pager-table", // container div class name.
};
export default PagerTable;

