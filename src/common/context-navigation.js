import React, { useState, useContext } from "react"
import { Route, Switch } from 'react-router-dom'
import HeaderContext from "../common/header-context"
import ProtectedRoute from '../protected-route'
import Login from '../container/pim-module-container/login-container/login-container'
import RetailersCategoryMapper from '../container/pim-module-container/retailers-category-mapper-container/retailers-category-mapper-container'

import ResetPassword from '../container/pim-module-container/reset-password-container/reset-password-container'
import ForgotPassword from '../container/pim-module-container/forgot-password-container/forgot-password-container'
import PageBaseLayout from '../pages/pagelayout/page-base-layout'

const App = () => {
    const [ProductSkuContextValue, setProductSkuContextValue] = useState("")
    const [ProductMethodContextValue, setProductMethodContextValue] = useState("")  
    const [ProductSkuUploadedImageName,setProductSkuUploadedImageName] =useState("")
    const [IsImportButton, setIsImportButton] = useState(false)
    const [IsAssetsBulkImportButton, setIsAssetsBulkImportButton] = useState(false)
    const [AssetsDockRender, setAssetsDockRender] = useState(false)
    const [isAssetTagDropdownDisabled, setIsAssetTagDropDownDisabled] = useState(false)
    const [importDockRender, setImportDockRender] = useState(false)
     
    return (
        <HeaderContext.Provider
        value={{
            ProductSkuDetails: { ProductSkuContextValue, setProductSkuContextValue },
            ProductSkuMethodName: { ProductMethodContextValue, setProductMethodContextValue },
            SelectedProductSkuImageName:{ProductSkuUploadedImageName,setProductSkuUploadedImageName},
            IsImportButtonDock:{IsImportButton, setIsImportButton},
            IsAssetsBulkImportButtonDock:{IsAssetsBulkImportButton, setIsAssetsBulkImportButton},
            AssetsDockRenderData:{AssetsDockRender, setAssetsDockRender},
            importDockRenderDate:{importDockRender, setImportDockRender},
            AssetTagDropdownDisabled:{isAssetTagDropdownDisabled,setIsAssetTagDropDownDisabled}
        }}
      >
        <Switch>
            <Route exact path='/' component={Login} />
            <Route
                exact
                path='/forgotPassword'
                component={ForgotPassword}
            />
            <ProtectedRoute
                exact
                path='/assetList'
                component={PageBaseLayout}
            />
            <Route exact path='/resetPassword' component={ResetPassword} />
             <ProtectedRoute
                exact
                path='/imageEditor'
                component = {PageBaseLayout}
            />
            <ProtectedRoute
                exact
                path='/dashboard'
                component={PageBaseLayout}
            />
           <ProtectedRoute
                exact
                path='/attributeGroup'
                component={PageBaseLayout}
            />
            <ProtectedRoute
                exact
                path='/attribute'
                component={PageBaseLayout}
            />
            <ProtectedRoute
                exact
                path='/importdata'
                component={PageBaseLayout}
            />
            <ProtectedRoute
                exact
                path='/skulist'
                component={PageBaseLayout}
            />
            <ProtectedRoute
                exact
                path='/enhancedContent'
                component={PageBaseLayout}
            />
            <ProtectedRoute
                exact
                path='/assetList'
                component={PageBaseLayout}
            />
             <ProtectedRoute
                exact
                path='/retailerList'
                component={PageBaseLayout}
            />
             <ProtectedRoute
                exact
                path='/retailerAttributeMap'
                component={PageBaseLayout}
            />
             <ProtectedRoute
                    exact
                    path='/manageUsers'
                    component={PageBaseLayout}
                />
				<ProtectedRoute
                    exact
                    path='/manageRoles'
                    component={PageBaseLayout}
                />
				<ProtectedRoute
                    exact
                    path='/addEditRole'
                    component={PageBaseLayout}
                />
                <ProtectedRoute
                    exact
                    path='/selectProducts'
                    component={PageBaseLayout}
                />
                <ProtectedRoute
                    exact
                    path='/readinessResults'
                    component={PageBaseLayout}
                />
                <ProtectedRoute
                    exact
                    path='/publishResults'
                    component={PageBaseLayout}
                />
                 <ProtectedRoute
                    exact
                    path='/publishedHistory'
                    component={PageBaseLayout}
                />
                <ProtectedRoute
                    exact
                    path='/readinessHistory'
                    component={PageBaseLayout}
                />
                <ProtectedRoute
                    exact
                    path='/retailersCategoryMapper'
                    component={PageBaseLayout}
                />
                <ProtectedRoute
                   exact
                   path='/retailersCategoryMapper'
                   component={PageBaseLayout}
               />
               <ProtectedRoute
                   exact
                   path='/pendingApproval'
                   component={PageBaseLayout}
               />
               <ProtectedRoute
                   exact
                   path='/approvalWorkflow'
                   component={PageBaseLayout}
               />
               <ProtectedRoute
                   exact
                   path='/workflowHistory'
                   component={PageBaseLayout}
               />
        </Switch>
        </HeaderContext.Provider>
    );
  };
  
  export default App;
