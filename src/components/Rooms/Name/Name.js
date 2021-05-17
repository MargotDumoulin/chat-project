import React from 'react';

class Name extends React.Component {
    render() {
        return <span>{this.props.firstname} {this.props.lastname}</span>
    }
}

export default Name;