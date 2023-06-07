import React from 'react';
import ApprovalWorkflowContainer from '../../../container/pim-module-container/approval-workflow-container/approval-workflow-container';

function approvalWorkflow(props) {
    return (
        <div>
            <ApprovalWorkflowContainer {...props}/>
        </div>
    );
}

export default approvalWorkflow;