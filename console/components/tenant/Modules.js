import React, { Component } from "react";
import { Row, Col, DatePicker, Checkbox } from "antd";
import moment from "moment";

const RangePicker = DatePicker.RangePicker;
const dateFormat = "YYYY-MM-DD";

class Modules extends Component {
   constructor(props) {
      super(props);

      const value = this.props.value || {};
      this.state = {
         checked_value: value.checked_value || false,
         dates: value.dates || [],
      };
   }
   componentWillReceiveProps(nextProps) {
      // Should be a controlled component.
      if ("value" in nextProps) {
         const value = nextProps.value;
         if (value) {
            this.setState(value);
         }
      }


   }
   onCheckedChange(e) {
      const checked_value = e.target.checked;
      if (!("value" in this.props)) {
         this.setState({ checked_value });
      }
      this.triggerChange({ checked_value });

      console.log(this.props.modifyControlPingtaiFenfa);
      if (this.props.modifyControlPingtaiFenfa) {
         console.log('woshimodifyControlPintai');
         this.props.modifyControlPingtaiFenfa();
      }
   }
   onDateChange(dates) {
      if (!("value" in this.props)) {
         this.setState({ dates });
      }
      this.triggerChange({
         dates: [dates[0] && dates[0].format(dateFormat), dates[1] && dates[1].format(dateFormat)],
      });
   }
   triggerChange(changedValue) {
      // Should provide an event to pass value to Form.
      const onChange = this.props.onChange;
      if (onChange) {
         onChange(Object.assign({}, this.state, changedValue));
      }
   }
   render() {
      const state = this.state;
      const oldDates = state.dates || ["", ""];
      const { label, modifyControlPingtaiFenfa } = this.props;
      const dates = [
         oldDates[0] && moment(oldDates[0], dateFormat),
         oldDates[1] && moment(oldDates[1], dateFormat),
      ];
      if (dates[0] && !dates[0].isValid()) {
         delete dates[0];
      }
      if (dates[1] && !dates[1].isValid()) {
         delete dates[1];
      }
      return (
         <Row>
            <Col span={8}>
               <Checkbox
                  checked={state.checked_value}
                  onChange={this.onCheckedChange.bind(this)}
               >
                  {label}
               </Checkbox>
            </Col>
            <Col span={16} className="range">
               <RangePicker
                  value={dates}
                  size="large"
                  onChange={this.onDateChange.bind(this)}
               />
            </Col>
         </Row>
      );
   }
}
export default Modules;
