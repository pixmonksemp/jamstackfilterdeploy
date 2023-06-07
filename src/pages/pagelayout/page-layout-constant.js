/** @format */

import DashboardPage from "../../pages/pim-module-pages/dashboard-page/dashboard-page";
import AttributePage from "../../pages/pim-module-pages/manage-attributes-page/attributes/attributes-page";
import AttributeGroupPage from "../../pages/pim-module-pages/manage-attributes-page/attribute-group/attribute-group-page";
import ImportdataPage from "../pim-module-pages/importdata-page/importdata-page";
import manageSkuPage from "../pim-module-pages/skulist-page/skulist-page";
import EnhancedContentPage from "../pim-module-pages/enhanced-content-page/enhanced-content-page";
import RetailerList from "../pim-module-pages/syndication/retailer-list";
import RetailerAttributeMap from "../pim-module-pages/syndication/retailer-attr-map";
import UserManagementPage from "../pim-module-pages/user-management-page/UserManagementPage";
import RoleManagementPage from "../pim-module-pages/role-management-page/RoleManagementPage";
import RoleCreateUpdateComponent from "../../components/pim-module-component/role-management-component/RoleCreateUpdateComponent";
import SelectProduct from "../../components/pim-module-component/syndication/retailer-list/select-products";
import AssetListPage from "../pim-module-pages/assetlist-page/assetlist-page";
import OrgRetailerPage from "../pim-module-pages/org-retailer/OrgRetailerPage";
import SyndicationResultPage from "../pim-module-pages/syndication-results/SyndicationResultPage";
import RetailersCategoryMapperPage from "../pim-module-pages/retailers-category-mapper/RetailersCategoryMapperPage"
import publishSku from "../pim-module-pages/syndication/publish-sku";
import publishResults from "../pim-module-pages/syndication/publish-results"
import ImageEditorPage from "../pim-module-pages/imageEditor-page/imageEditor-page"
import publishedHistory from "../pim-module-pages/syndication/published-history-page"
import readinessHistory from "../pim-module-pages/syndication/readiness-history-page"
import PendingApproval from "../pim-module-pages/pending-approval/pending-approval";
import approvalWorkflow from "../pim-module-pages/approval-workflow-page/approval-workflow-page";
import WorkflowHistory from "../pim-module-pages/workflow-history-page/workflow-history-page"
export const componentBaseStructure = [
  {
    key: "dashboard",
    value: DashboardPage,
  },
  {
    key: "attribute",
    value: AttributePage,
  },
  {
    key: "attributeGroup",
    value: AttributeGroupPage,
  },
  {
    key: "importData",
    value: ImportdataPage,
  },
  {
    key: "skulist",
    value: manageSkuPage,
  },
  {
    key: "enhancedContent",
    value: EnhancedContentPage,
  },
  {
    key: "assetList",
    value: AssetListPage,
  },
  {
    key: "retailerList",
    // value: RetailerList,
    value: OrgRetailerPage,
  },
  {
    key: "retailerAttributeMap",
    value: RetailerAttributeMap,
  },
  {
    key:"manageUsers",
    value:UserManagementPage
  },
  {
    key:"manageRoles",
    value:RoleManagementPage
  },
  {
    key:"addEditRole",
    value:RoleCreateUpdateComponent
  },
  {
    key:"selectProducts",
    value: SelectProduct
  },
  {
    key:'readinessResults',
    value: publishSku
  },
  {
    key:'imageEditor',
    value: ImageEditorPage
  },
  {
    key:'publishResults',
    value: publishResults
  },
  {
    key:'publishedHistory',
    value: publishedHistory
  },
  {
    key:'readinessHistory',
    value: readinessHistory
  },
  {
    key:'retailersCategoryMapper',
    value: RetailersCategoryMapperPage
  },
  {
    key:'approvalWorkflow',
    value: approvalWorkflow
  },
  {
    key:'pendingApproval',
    value: PendingApproval
  },{
    key:'workflowHistory',
    value: WorkflowHistory
  }
];
