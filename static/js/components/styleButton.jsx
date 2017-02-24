import React from 'react'

export default class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = '';
    let display = null;
    if (this.props.active) {
      className += ' selected';
    }

    if (this.props.image) {
      display = <img src={this.props.image}/>
    } else {
      display = this.props.label
    }

    return (
      <li className={className}>
        <button onMouseDown={this.onToggle}>
          {display}
          <label>{this.props.label}</label>
        </button>
      </li>
    );
  }
}
