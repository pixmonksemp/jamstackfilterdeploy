
// import { Dashboard } from '@uppy/react'
import './DashBoardStyle.scss'
import './UppyCoreStyle.scss'
// import '@uppy/core/dist/style.css'
// import '@uppy/dashboard/dist/style.css'
import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import i18n from '../../translate/i18n'
import { COMPANION_URL, LOCAL_COMPUTER, XHR_UPLOAD_URL } from '../../common/common-constants'
import ModalComponent from '../modal'
import { postImportedFileRequest } from '../../common/master-data'
import { connect } from 'react-redux'

let token,
fileRequest,
isUppyIntialized = false,
orgId
export function resetUppy(value) {
    // const instance = uppy.getPlugin('XHRUpload')
    // uppy.removePlugin(instance)
    // uppy.reset()
    uppy = undefined
    isUppyIntialized =  false
}
// const Uppy = require('@uppy/core')
// const GoogleDrive = require('@uppy/google-drive')
// const Box = require('@uppy/box')
// const OneDrive = require('@uppy/onedrive')
// const XHRUpload = require('@uppy/xhr-upload')
// let uppy 
// =
//     new Uppy({
//         id: 'Uppy', restrictions: {
//             maxNumberOfFiles: 1,
//             maxFileSize: 10000000,
//             allowedFileTypes: ['.xlsx']
//         },
//         // debug: true, autoProceed: false,
//         onBeforeFileAdded: (currentFile, files) => {

//             const modifiedFile = {
//                 ...currentFile,
//                 meta: {
//                     ...currentFile.meta,
//                 },
//             }
//             return modifiedFile
//         },
//         onBeforeUpload: (files) => {
//             let finalMetaData = {}
//             Object.keys(files).map((key) => {
//                 let fileMetaData = files[key]
//                 const modifiedFile = {
//                     ...fileMetaData,
//                     meta: {
//                         ...fileMetaData.meta,
//                         orgId:orgId
//                     },
//                     name: fileMetaData.meta.name
//                 }
//                 finalMetaData[key] = modifiedFile
//             })
//             return finalMetaData
//         }
//     })
//         .use(GoogleDrive, {
//             id: 'GoogleDrive',
//             companionUrl: COMPANION_URL,
//             target: Uppy.Dashboard
//         })
//         .use(OneDrive, {
//             id: 'OneDrive',
//             target: Uppy.Dashboard,
//             companionUrl: COMPANION_URL
//         })

//         .use(Box, {
//             id: 'Box',
//             target: Uppy.Dashboard,
//             companionUrl: COMPANION_URL
//         })

const mapStateToProps = (state) => {
    return {
      getUserDetail: state.userDetail.getUsersObj.userCredentials
    }
  }

function FileUploader(props) {
    const {getUserDetail} = props
    let userDetails = getUserDetail
    if(userDetails){
    orgId = userDetails.organizationid
    token = userDetails.token_value.Authorization}
    // if(!isUppyIntialized){
    //     uppy = new Uppy({
    //     id: 'Uppy', restrictions: {
    //         maxNumberOfFiles: props.maxNumberOfFiles,
    //         maxFileSize: props.maxFileSize,
    //         allowedFileTypes: props.allowedFileTypes
    //     },
    //     // debug: true, autoProceed: false,
    //     onBeforeFileAdded: (currentFile, files) => {

    //         const modifiedFile = {
    //             ...currentFile,
    //             meta: {
    //                 ...currentFile.meta,
    //             },
    //         }
    //         return modifiedFile
    //     },
    //     onBeforeUpload: (files) => {
    //         let finalMetaData = {}
    //         Object.keys(files).map((key) => {
    //             let fileMetaData = files[key]
    //             const modifiedFile = {
    //                 ...fileMetaData,
    //                 meta: {
    //                     ...fileMetaData.meta,
    //                     size:files[key].size,
    //                     ...props.fileUploadRequest
    //                 },
    //                 name: fileMetaData.meta.name
    //             }
    //             finalMetaData[key] = modifiedFile
    //         })
    //         return finalMetaData
    //     }
    // })
    //     .use(GoogleDrive, {
    //         id: 'GoogleDrive',
    //         companionUrl: COMPANION_URL,
    //         target: Uppy.Dashboard
    //     })
    //     .use(OneDrive, {
    //         id: 'OneDrive',
    //         target: Uppy.Dashboard,
    //         companionUrl: COMPANION_URL
    //     })

    //     .use(Box, {
    //         id: 'Box',
    //         target: Uppy.Dashboard,
    //         companionUrl: COMPANION_URL
    //     })
    //     uppy.use(XHRUpload, {
    //         endpoint:
    //             props.fileUploadURL,
    //         headers: {
    //             Authorization: token,
    //         }
    //     })
    //     isUppyIntialized = true
    // }
    
    const onSubmit = (value, FileExtension, id) => {
        if (value) {
            setFileName(value)
            uppy.setFileMeta(id, { name: value + "." + FileExtension })
        }
        setIsEditFile(false)
    }
    const [fileName, setFileName] = useState("")
    const [editedName, setEditedName] = useState("")
    const [isEditFile, setIsEditFile] = useState(false)
    const [extension, setExtension] = useState(null)
    const [fileId, setFileId] = useState(null)
    const [isEditButtonVisible, setIsEditButtonVisible] = useState(false)

    // useEffect( () => () => props = undefined, [] );
    uppy.on('upload-success', (file, res, uploadURL) => {
        // if(res.body.xlAttrList){
        // setIsEditButtonVisible(false)
        // props.mapFieldData(2,file,res)
        // }else{
        //     uppy.info({
        //         message: res.body.description?res.body.description: i18n.t("importdata.requestFailedMessage")
        //         // details: 'File couldn’t be uploaded because there is no internet connection',
        //       }, 'error', 5000)
        //     uppy.reset()
        // }
        if(props.importType == 'Excel'){props.goToStep(2,file)}
    })
    uppy.on('file-removed', (file) => {
        props.setIsFileUploaded(false)
        setIsEditButtonVisible(false)
        props.setIsCustomUppyStyle(false)
    })
    uppy.on('file-added', (file) => {
        // fileRequest = postImportedFileRequest
        // fileRequest.fileName = file.name
        // fileRequest.fileSize = file.size
        // fileRequest.fileType = file.extension.toUpperCase()
        // fileRequest.aborted = false
        // if (file.source == "react:Dashboard") {
        //   fileRequest.fileSource = LOCAL_COMPUTER
        // } else {
        // fileRequest.fileSource = file.source
        // }
        // fileRequest.userId = 1
        // fileRequest.userName = userDetails.userName
        // fileRequest.orgId = userDetails.organizationid
        // fileRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        props.setIsFileUploaded(true)
        setFileName(file.name.split('.' + file.extension)[0])
        setEditedName(file.name.split('.' + file.extension)[0])
        setFileId(file.id)
        setExtension(file.extension)
        setIsEditButtonVisible(true)
        props.setIsCustomUppyStyle(true)
    })
    uppy.on('complete', result => {
    })

    const renderModalBody = <form onSubmit={(e) => {
        onSubmit(editedName, extension, fileId)
        e.preventDefault()
    }}>
        <div className='p-field p-col-12 fileNameStyle'>
            <InputText className={'p-col-12'} onChange={(e) => { setEditedName(e.target.value) }} value={editedName} type='text' />
            <div className='errorMsg'>
            {!editedName.trim() ? i18n.t('validationMessage.fieldIsRequired') : editedName.trim().length > 50 ? i18n.t('validationMessage.length') : null} </div>
            <Button 
            type='submit' 
            className='file-name-submit'
            disabled={!editedName.trim() || editedName.trim().length > 50} >
                 {i18n.t('fileuploader.save')}</Button>
        </div>
    </form>

    return (
        <>

            <ModalComponent
                isShowModal={isEditFile}
                onHideModal={() => {
                    setEditedName(fileName)
                    setIsEditFile(false)
                }}
                modalTitle={i18n.t('fileuploader.editFileNameHeader')}
                modalContent={renderModalBody}
                modalSize="md"
                // modalDailogClassName="modal-dailog-content"
            />
            

            {/* {isEditButtonVisible && <div className='uppy-dashboard-edit-name' style={{ marginBottom: "10px", margin: 'auto', height: '22px' }}>
                <p className='uppy-DashboardContent-back' style={{width:'fit-content',height:'26px', padding:'3px 22px'}} onClick={() => { setIsEditFile(true) }}>{i18n.t('fileuploader.editFileName')}</p></div>} */}
            {/* <div style={{ textAlign: 'center' }}>
                <Dashboard
                    proudlyDisplayPoweredByUppy={false}
                    locale={{
                        strings: {
                            browseFiles: i18n.t('fileuploader.browseFiles'),
                            myDevice:"Local Device",
                            poweredBy: i18n.t('fileuploader.poweredBy'),
                            uploadXFiles: i18n.t('fileuploader.uploadXFiles'),
                            xFilesSelected: {
                                0: i18n.t('fileuploader.xFilesSelectedOne'),
                                1: i18n.t('fileuploader.xFilesSelectedTwo'),
                            },
                            dropPasteFiles: i18n.t('fileuploader.dropPasteFiles') + '%{browseFiles}'
                        }
                    }}
                    // showRemoveButtonAfterComplete={true}
                    showProgressDetails={true}
                    uppy={uppy}
                    disableLocalFiles={props.disableLocalFiles}
                    plugins={props.plugins}
                /></div> */}
        </>
    )
}
export default connect(mapStateToProps)(FileUploader)
