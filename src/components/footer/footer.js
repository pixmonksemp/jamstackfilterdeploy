import React, { Component } from 'react'
import './footer.scss'
import PropTypes from 'prop-types'
import { FOOTER_CONTENT } from '../../common/common-constants'

class Footer extends Component {
  static propTypes = {
    isAuthModule: PropTypes.bool
  }

  render() {
    const { isAuthModule } = this.props
    return (
      <div>
        {isAuthModule ?
          <div class='authentication-module-footer'>
            {FOOTER_CONTENT}
          </div> :
          <div className='execution-module-footer'>
            <center>{FOOTER_CONTENT} </center>
          </div>
        }
      </div>
    )
  }
}

export default Footer
