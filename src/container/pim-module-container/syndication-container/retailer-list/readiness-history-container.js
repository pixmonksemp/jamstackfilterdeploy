import React, { useEffect } from "react";

import ReadinessHistory from "../../../../components/pim-module-component/syndication/retailer-list/readiness-history-component.js";
import ApiConnector from "../../../../common/hoc/api-connector"
import { resources } from "../../../../common/common-api-constants"
import { PIM_API } from "../../../../common/common-constants"

function ReadinessHistoryContainer(props) {
    useEffect(() => {
        window.scroll(0, 0);
    }, [])
    return <ReadinessHistory {...props} />;
}

export default ApiConnector(ReadinessHistoryContainer, {
  methods: {
    getReadinessHistory: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getReadinessHistory",
    },
  },
  })