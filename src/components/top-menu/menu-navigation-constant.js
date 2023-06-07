/** @format */

import dashboardIcon from '../../assets/dashboardIcon.svg'
import importdataIcon from '../../assets/importdataIcon.svg'
import manageAttribute from '../../assets/manageattributeIcon.svg'
import managecatalogIcon from '../../assets/managecatalogueIcon.svg'
import enhancedContentIcon from '../../assets/enhancedContentIcon.svg'
import adminIcon from '../../assets/adminIcon.svg'
import assetIcon from '../../assets/assetIcon.svg'
import syndicationIcon from '../../assets/syndicationIcon.svg'
import pendingApproval from '../../assets/approvalWorkflow.svg'

export const renderIconList = [
  { key: "dashboard", value: dashboardIcon },
  { key: "superAdmin", value: adminIcon },
  { key: "importData", value: importdataIcon },
  { key: "manageAttribute", value: manageAttribute },
  { key: "skulist", value: enhancedContentIcon },
  { key: "enhancedContent", value: enhancedContentIcon },
  { key: "assetList", value: assetIcon },
  { key: "retailerList1", value: syndicationIcon },
  { key: "approvalWorkflow", value: pendingApproval }
];

/**
 * This is the Mock SideMenu Options Rendering Response Data
 * @tutorial - Reference Parent & Child Level Side Menu Options Response Structrure
 * @yields - {
        'key': 'search', - // Parent Menu
        'navigate': '/searchInsights',
        'icon': 'searchIcon',
        'title': 'Search',
        'items': [ // Child Menu Level One
            {
                'key': 'sos',
                'navigate': '/sosComparison',
                'icon': 'searchIcon',
                'title': 'Share of Search',
                'items': [ // Child Menu Level Two
                    {
                        'key': 'sops',
                        'navigate': '/sopsComparison',
                        'title': 'SOP-1',
                        'items': [ Upto Child Level infinity ]
                    }
                ]
            }
        ]
    }
 */
