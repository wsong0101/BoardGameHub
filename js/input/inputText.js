import React from 'react'

export default class InputText extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      valid: this.props.info.valid,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  getValidClass() {
    if (this.state.valid) {
      return " is-valid"
    }
    return " is-invalid"
  }

  showLabel() {
    if (this.props.info.label) {
      return (
        <label htmlFor={this.props.info.name}>{this.props.info.label}</label>
      )
    }
  }

  showDescription() {
    if (this.props.info.description) {
      return (
        <small className="form-text text-muted">{this.props.info.description}</small>
      )
    }
  }

  handleChange(e) {
    let valid = this.props.info.checker(e.target.value)
    this.setState({
      valid: valid,
    })
    this.props.onChange(e.target.value, valid)
  }

  render() {
    return (
      <div className="form-group">
        {this.showLabel()}
        <input type={this.props.type} className={"form-control" + this.getValidClass()}
          id={this.props.info.name} onChange={this.handleChange}
          placeholder={this.props.info.placeholder}/>
        {this.showDescription()}
      </div>
    )
  }
}

InputText.defaultProps = {
  type: "text",
}