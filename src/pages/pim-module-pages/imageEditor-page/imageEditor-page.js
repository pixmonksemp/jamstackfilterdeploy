import React from 'react';
import { connect } from "react-redux";
import ImageEditorContainer from '../../../container/pim-module-container/image-editor-container/image-editor-container';

function ImageEditorPage(props) {
    return (
        <div>
            <ImageEditorContainer {...props}/>
        </div>
    );
}
export default connect(null, null)(ImageEditorPage)
