import React, { Component } from "react";

//form - getting zipcode from user
class ZipForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: "",
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.submitZipCode = this.submitZipCode.bind(this);
  }
  render() {
    return (
      <div className="zip-form">
        <form id="zipForm" onSubmit={this.submitZipCode}>
          <div className="flex-parent">
            <label htmlFor="zipcode">Zip</label>
            <input
              className="form-control"
              type="input"
              id="zipcode"
              name="zipcode"
              value={this.state.zipcode}
              required
              onChange={this.inputChanged}
            />
            <button type="submit" className="btn btn-success">
              Get the forcast!
            </button>
          </div>
        </form>
      </div>
    );
  }
  inputChanged(event) {
    const { value } = event.target;
    this.setState({ zipcode: value });
  }
  submitZipCode(event) {
    event.preventDefault();
    const { zipcode } = this.state.zipcode;
    const { onSubmit } = this.props;
    onSubmit(zipcode);
    this.setState({ zipcode: "" });
  }
}

export default ZipForm;
