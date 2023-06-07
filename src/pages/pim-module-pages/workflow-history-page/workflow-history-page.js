import React from 'react';
import WorkflowHistoryContainer from '../../../container/pim-module-container/workflow-history-container/workflow-history-container';

function workflowHistory(props) {
    return (
        <div>
            <WorkflowHistoryContainer {...props}/>
        </div>
    );
}

export default workflowHistory;