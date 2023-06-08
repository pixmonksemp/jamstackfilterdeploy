// import React, { useEffect, useState } from "react";
// import { Formik, Field, Form, FieldArray } from "formik";
// import CustomSelect from './custom-select'
// import { Button } from "primereact/button"
// import i18n from "../../../../../src/translate/i18n"
// import ToastModal from "../../../modal/ToastModal"
// import { MEDIUM, VALID_BG_COLOR } from "../../../../common/common-constants"
// import { Row } from "react-bootstrap";
// import ReactSelect from "react-select";

// let validToastHeading,
//     validToastContent,
//     validTitleBackgroundColor,
//     validToastSize

// const AttrSelectMap = (props) => {
//     const { attrValue, attrMappingList, attrSystemList, existsOrgRetailer, uniqueAttribute } = props
//     const [attrSelect, setAttrSelect] = useState([])
//     const [initailaval, setInitailaval] = useState([])
//     const [isValidateToastMsg, setIsValidateToastMsg] = useState(false)
//     useEffect(() => {
//         setAttrSelect(attrSystemList)
//     }, [attrSystemList]);

//     useEffect(() => {
//         let initailavaltemp = []
//         if (existsOrgRetailer == "Not Found") {
//             const allAttrValue = attrValue && attrValue.map(attr => {
//                 const attrContainer = {};
//                 attrContainer[attr.attrImport] = "";
//                 return attrContainer;
//             })
//             initailavaltemp.push(Object.assign({}, ...allAttrValue))
//             setInitailaval(initailavaltemp)
//         }
//     }, [existsOrgRetailer, attrValue]);

//     const handleValidToastHide = () => {
//         setIsValidateToastMsg(false)
//     }

//     const initialValues = {
//         friends: initailaval.length > 0 ? initailaval : attrValue
//     }
//     return (
//         <div>
//             <Formik
//                 initialValues={initialValues}
//                 enableReinitialize={true}
//                 onSubmit={(values) => {
//                     values.friends[0][uniqueAttribute]
//                     if (values.friends[0][uniqueAttribute] != null && values.friends[0][uniqueAttribute] != "") {
//                         props.nextClicked(values)
//                     } else {

//                         validToastHeading = "Map your Attribute"
//                         validToastContent = "You must Map this " + `'${uniqueAttribute}'` + " Attribute"
//                         validTitleBackgroundColor = VALID_BG_COLOR
//                         validToastSize = MEDIUM
//                         setIsValidateToastMsg(true)
//                     }

//                 }}
//                 render={({ values, errors, touched, handleReset, setFieldTouched, setFieldValue }) => {
//                     return (
//                         <Form>
//                             <div className="d-flex flex-row-reverse">
//                                 <div className="adjust-import-next-button">
//                                     <Button type="submit" label={i18n.t("importdata.submit")} />
//                                 </div>
//                                 {/* <div className="adjust-import-cancel-button mr-2">
//                                     <Button
//                                         onClick={() => {
//                                             props.cancelClicked()
//                                         }}
//                                         label={i18n.t("importdata.cancel")}
//                                     />
//                                 </div> */}
//                             </div>
//                             <FieldArray
//                                 name="friends"
//                                 render={({ insert, remove, push }) => (
//                                     <>
//                                         {values.friends.length > 0 &&
//                                             values.friends.map((friend, index) => (
//                                                 <>
//                                                  <div className="row" >
//                                                     {Object.entries(friend).map(([key, val]) => (
                                                       
//                                                             <div className="col-4 mt-4">
//                                                                 {/* <Row> */}
//                                                                 <label key={key}>{key}:</label>
//                                                                 {/* </Row> */}
//                                                             {/* </div>
//                                                             <div className="col mt-4"> */}
//                                                             {/* <Row> */}
//                                                                 <CustomSelect
//                                                                     // name={`friends.${index}.${key}`}
//                                                                     value={val!=''?val:null}
//                                                                     options={attrSelect}
//                                                                     onChange={(attrSelect) => {
//                                                                         setFieldTouched(`friends.${index}.${key}`, true);
//                                                                         setFieldValue(`friends.${index}.${key}`, attrSelect ? attrSelect.id : "");
//                                                                     }}
//                                                                 />
//                                                                 {/* <ReactSelect
//                                                                 value={attrSelect.find((i)=>i.id==val)}
//                                                                 options={attrSelect}
//                                                                 onChange={(attrSelect) => {
//                                                                     setFieldTouched(`friends.${index}.${key}`, true);
//                                                                     setFieldValue(`friends.${index}.${key}`, attrSelect ? attrSelect.id : "");
//                                                                 }} */}
//                                                                 {/* /> */}
//                                                                 {/* </Row> */}
                                                            
//                                                         </div>
//                                                     ))}
//                                                     </div>
//                                                 </>
//                                             ))}

//                                     </>
//                                 )}
//                             />
//                             <br />
                            
//                         </Form>
//                     );
//                 }}
//             />
//             <ToastModal
//                 show={isValidateToastMsg}
//                 title={validToastHeading}
//                 titleBackgroundColor={validTitleBackgroundColor}
//                 content={validToastContent}
//                 size={validToastSize}
//                 onModalHide={handleValidToastHide}
//             />
//         </div >
//     )
// };

// export default AttrSelectMap

