import React, { Component } from "react"
import Skulist from "../../../components/pim-module-component/skulist/skulist"
import PropTypes from "prop-types"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"
class SkuListContainer extends Component {
 
  componentWillMount() {
    window.scroll(0, 0)
  }
  render() {
    return <Skulist {...this.props} />
  }
}

export default ApiConnector(SkuListContainer, {
  methods: {
    getManageProductSku: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getProductskus",
    },
    deleteProductSkuData: {
      type: resources.httpMethod.DELETE,
      url: PIM_API + "/deleteProductskus",
    },
    productSkuSearch: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/productSearchGrid",
    },
    productSkuNameSearch: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/productSearchGrid",
    },
    getOrganizationDetails: {
      type: resources.httpMethod.GET,
      url: PIM_API + "/organizations",
    }
  },
})
