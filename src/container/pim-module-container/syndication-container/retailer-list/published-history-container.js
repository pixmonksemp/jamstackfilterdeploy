import React, { useEffect } from "react";

import PublishedHistory from "../../../../components/pim-module-component/syndication/retailer-list/published-history-component";
import ApiConnector from "../../../../common/hoc/api-connector"
import { resources } from "../../../../common/common-api-constants"
import { PIM_API } from "../../../../common/common-constants"

function PublishedHistoryContainer(props) {
    useEffect(() => {
        window.scroll(0, 0);
    }, [])
    return <PublishedHistory {...props} />;
}

export default ApiConnector(PublishedHistoryContainer, {
  methods: {
    getPublishedHistory: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getPublishedHistory",
    },
  },
  })