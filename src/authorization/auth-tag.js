import React, { Component } from "react";
import propTypes from 'prop-types';
import { connect } from 'react-redux';

class AuthTag extends Component {

  static propTypes = {
    authorizedAccess: propTypes.string.isRequired,
    pageName: propTypes.string.isRequired
  }

  render() {
    const { children, authorizedAccess, pageName } = this.props;
    let authAccess;
    if (pageName in authorizedAccess) {
      authAccess = authorizedAccess && authorizedAccess[pageName]
    }

    // authorizedAccess.map((prevl) => {
    //   if (prevl.name === pageName)
    //     authAccess = prevl.accessLevel
    // });
    if (authAccess === 'hide') return null;
    if (authAccess === 'read') {
      return (
        <span style={{ pointerEvents: "none", opacity: '0.4' }}>
          {children}
        </span>
      )
    }
    return children
  }
}

const getMapStateToProps = (extendWith = {}) => state => {
  var authorizedPages = JSON.parse(sessionStorage.getItem('authorization'));
  const previlages = authorizedPages || {};
  return {
    authorizedAccess: previlages ? previlages : 'nobody',
    ...extendWith
  };
};


export default connect(getMapStateToProps())(AuthTag);