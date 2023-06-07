import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./style.scss"
import { updateAssetsRequestObject, getAssetRequestObject } from "../../../common/master-data"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import i18n from "../../../translate/i18n"
import ModalComponent from "../../modal/index"
import { Spinner } from "react-bootstrap"
import { useHistory, Redirect, Switch, Link } from "react-router-dom";
import {
  PIM_API
} from "../../../common/common-constants"
import { connect } from "react-redux"

const mapStateToProps = (state) => {
  return {
    retainingData: state.dashboardValue.selectedFiltersforRetainingValues
  }
}

function ImageEditor(props){    
 // console.log(props,"props image editor")  
  let data = props.history.location && props.history.location.state && props.history.location.state.assetData.uploadedUrl;
  let assetData =  props.history.location && props.history.location.state && props.history.location.state.assetData
  //reset filter
  const {retainingData} = props
  retainingData.applyStatus = false
 
  let userDetails = JSON.parse(
    sessionStorage.getItem(i18n.t("commonMessage.loginUserDetails"))
  )
  const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
  const [isImageSave, setIsImageSave] = useState(false)
  const [hierarchyLoader, setHierarchyLoader] = useState(false)
  const [editorSaveData, setEditorSaveData] = useState({})
  const [assetByIdData, setAssetByIdData] = useState([])

  // Restrict Browser Back Arrow
  history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    useEffect(() => {
      props.getAssetById(null, assetData.id)
    }, [])

  useEffect(() => {
    const { updateAssetsResult } = props
    if(updateAssetsResult &&
      updateAssetsResult.content &&
      updateAssetsResult.content.data &&
      updateAssetsResult.content.status == 200){
      setHierarchyLoader(false);
      setIsDeleteRecordsDialog(true);
      // cancelEditedImage()
      // localStorage.setItem("dataUrl", false)
      
      const data = {
        key: "assetList",
      }
      // console.log(asset)
      if(!props.redirectType){
        // props.history.push("/imageEditor")
        props.history.push({
        pathname: "/assetList"
      })
        props.triggerPageLayout(data)
        }

    }



  },[props.updateAssetsResult]) 

  useEffect(() => {
    const { getAssetByIdResult } = props
    if (
      getAssetByIdResult &&
      getAssetByIdResult.content &&
      getAssetByIdResult.content.data
    ) {
      //console.log(getAssetByIdResult.content.data,"getAssetByIdResult.content.data")
      setAssetByIdData(getAssetByIdResult.content.data)
    }
  }, [props.getAssetByIdResult])

  const assetNameWithextension = (asset) =>{
    let assetNameWithextension
    let assetName = assetByIdData && assetByIdData.assetName.split('.')[0]
    let assetExtension = assetByIdData && assetByIdData.assetName.split('.')[1]
    assetNameWithextension = assetName + "." + assetExtension
    return assetNameWithextension
  }

  const updateEditedImage = (asset) =>{
        let request = updateAssetsRequestObject
      request.id = parseInt(assetData.id);
      request.version = assetByIdData.version;
     
      if(null != assetByIdData.assetTags && assetByIdData.assetTags.length != 0){
        request.metaTags = assetByIdData.assetTags.replace(/@/g,'').split(',')

      }
      //request.assetName = unescape(assetNameWithextension(asset));
      request.assetName = asset.fullName
      var base64stringLength = asset.imageBase64.length - 'data:image/png;base64,'.length;
      request.assetSize = 4 * Math.ceil((base64stringLength / 3))*0.5624896334383812;
      localStorage.setItem("size", 4 * Math.ceil((base64stringLength / 3))*0.5624896334383812)
      request.assetType = asset.mimeType.substring(0, asset.mimeType.indexOf('/'));
      var uploadedUrl = props.history.location.state.assetData.uploadedUrl;
      request.locale = uploadedUrl.slice(
        uploadedUrl.lastIndexOf('_') + 1,
        uploadedUrl.lastIndexOf('.'),
      )
      request.organizationId = parseInt(userDetails.organizationid);
      request.assetBaseUrl = asset.imageBase64
      request.pimerceOrgId = assetData.pimerceOrgId
      request.timeZone = assetByIdData.timeZone
      request.assetExtension = asset.extension
      request.assetSource = assetByIdData.assetSource
     
      setHierarchyLoader(true);
      props.updateAssets(request);
  
    
 }
  const cancelEditedImage = () =>{
    props.history.push("/assetList")
  }

  const onHideUpdateDialog = () => {
    setIsImageSave(false)
  }

  const onHideMultipleDeleteDialog = () => {
    setIsDeleteRecordsDialog(false)
    let request = getAssetRequestObject;
    request.organizationId = parseInt(userDetails.organizationId)
     props.history.push("/assetList")
  }
  const FilerobotImageEditor = require('./../../../fileRobotImageEditor')
  const { TABS, TOOLS } = FilerobotImageEditor;
  //console.log(TABS,"tools")
  const config = {
    source: data,
    onSave: (editedImageObject, designState) =>
      console.log('saved', editedImageObject, designState),
    annotationsCommon: {
      fill: '#ff0000',
    },
    Text: { text: 'TEXT...' },
    Rotate: { angle: 90, componentType: 'slider' },
    translations: {
      profile: 'Profile',
      coverPhoto: 'Cover photo',
      facebook: 'Facebook',
      socialMedia: 'Social Media',
      fbProfileSize: '180x180px',
      fbCoverPhotoSize: '820x312px',
    },
    Crop: {
      presetsItems: [
        {
          titleKey: 'classicTv',
          descriptionKey: '4:3',
          ratio: 4 / 3,
          // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
        },
        {
          titleKey: 'cinemascope',
          descriptionKey: '21:9',
          ratio: 21 / 9,
          // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
        },
      ],
      presetsFolders: [
        {
          titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
          // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
          groups: [
            {
              titleKey: 'facebook',
              items: [
                {
                  titleKey: 'profile',
                  width: 180,
                  height: 180,
                  descriptionKey: 'fbProfileSize',
                },
                {
                  titleKey: 'coverPhoto',
                  width: 820,
                  height: 312,
                  descriptionKey: 'fbCoverPhotoSize',
                },
              ],
            },
          ],
        },
      ],
    },
    tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK, TABS.RESIZE, TABS.FILTERS, TABS.FINETUNE], // or ['Adjust', 'Annotate', 'Watermark']
    defaultTabId: TABS.ADJUST, // or 'Adjust'
    defaultToolId: TOOLS.CROP, // or 'Crop'
  };

  useEffect(() => {
    const filerobotImageEditor = new FilerobotImageEditor(
      document.querySelector('#editor_container'),
      config,
    );

    filerobotImageEditor.render({
      onSave: (saveOption) => {
        // console.log(saveOption,"saveOption")
        updateEditedImage(saveOption)
      },
      onClose: (closingReason) => {
        const data = {
          key: "assetList"
        }
          props.history.push({
          pathname: "/assetList",
        })
          props.triggerPageLayout(data)
       filerobotImageEditor.terminate();
      },
    });
  })

 
    return(
      <div id="editor_container" style={{height:'756px'}}>

  <ModalComponent
        isShowModal={isImageSave}
        onHideModal={onHideUpdateDialog}
        // modalTitle={i18n.t("productSkuPopupHeaders.deleteProductSku")}
        modalContent={
          <div className="confirmation-content">
            <span>
              Save Image Before Update
             </span>
          </div>
        }
        modalSize="sm"
        modalDailogClassName="modalDailogContent smallDialog"
      />

      <ModalComponent
        isShowModal={isDeleteRecordsDialog}
        onHideModal={onHideMultipleDeleteDialog}
        modalContent={
          <div className="confirmation-content">
            <span>
              Edited image Updated sucessfully
             </span>
          </div>
        }
        modalSize="sm"
        modalDailogClassName="modalDailogContent smallDialog"
      />
     
      </div>
    )
}

export default connect(mapStateToProps)(ApiConnector(ImageEditor, {
  methods: {
    updateAssets: {
      type: resources.httpMethod.POST,
			url: PIM_API+'/updateAssets',
    },
    getAssetById: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getAssetById",
    }
  }
}))