import React from 'react'

export default class DisplayNotice extends React.Component {
  constructor(props) {
    super(props)
  }

  display() {
    if (this.props.content) {
      return (
        <div className="alert alert-danger">{this.props.content}</div>
      )
    }
    return <div></div>
  }

  render() {
    return (
      this.display()
    )
  }
}