import React from 'react';
import AssetListContainer from '../../../container/pim-module-container/asset-list-container/asset-list-container';

function AssetListPage(props) {
    return (
        <div>
            <AssetListContainer {...props}/>
        </div>
    );
}

export default AssetListPage;