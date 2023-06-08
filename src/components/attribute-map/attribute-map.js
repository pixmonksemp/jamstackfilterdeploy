import React, { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
// import { DataTable } from "primereact/datatable"
// import { Column } from "primereact/column"
// import { Button } from "primereact/button"
// import { Dropdown } from "primereact/dropdown"
import "./style.scss"
import i18n from "../../translate/i18n"

const AttributeMap = (props) => {
  const [attrMapFieldList, setAttrMapFieldList] = useState([])
  const [isInitialValue, setIsInitialValue] = useState(true)

  let initialValue = []
  const header = (
    <div className="table-header">{i18n.t("importdata.attrMapHeader")}</div>
  )

  const footer = (
    <>
      <div className="d-flex flex-row-reverse">
        {/* <div className="adjust-import-next-button">
          <Button
            label={i18n.t("importdata.next")}
            onClick={() => {
              props.nextClicked(3)
            }}
          />
        </div>
        <div className="adjust-import-cancel-button mr-2">
          <Button
            onClick={() => {
              props.cancelClicked()
            }}
            label={i18n.t("importdata.cancel")}
          />
        </div> */}
      </div>
    </>
  )

  const attrMap = (value, isId) => {
    let setAttrValue = null
    props.attrSystemList.map((e) => {
      if (value == e.label) {
        if (isId) {
          setAttrValue = e.id ? e.id : null
        } else if (!isId) {
          setAttrValue = e.value
        }
      }
    })
    return setAttrValue
  }

  const attrSystemTemplate = (data, column) => {
    initialValue[column.rowIndex] = data && data.attrImport

    if (isInitialValue && initialValue.length == props.attrValue.length) {
      initialValue.map((e, index) => {
        let attrMapList = props.attrMappingList
        let attrObj = {}
        attrObj[e] = attrMap(e, true)
        attrMapList[index] = attrObj
        props.setAttrMappingList(attrMapList)
        setIsInitialValue(false)
      })
    }

    const mapValue = (e) => {
      let attrSelected = e.value
      let attrMapValue = []
      let key
      attrMapFieldList.map((i) => {
        attrMapValue.push(i)
      })
      attrMapValue[column.rowIndex] = attrSelected
      setAttrMapFieldList(attrMapValue)
      let attrMapList = props.attrMappingList
      attrMapList[column.rowIndex] = {}
      key = initialValue[column.rowIndex]
      attrMapList[column.rowIndex][key] = attrMap(attrSelected, true)
      props.setAttrMappingList(attrMapList)
    }

    return (
      <Row className="attribute-table-dropdown">
        <Col>
          <Dropdown
            value={
              attrMapFieldList[column.rowIndex]
                ? attrMapFieldList[column.rowIndex]
                : initialValue[column.rowIndex]
            }
            optionValue="label"
            options={props.attrSystemList}
            onChange={(e) => {
              mapValue(e)
            }}
            placeholder={i18n.t("importdata.select")}
          />
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row className="map-field-table-header">
        <Col className="px-4">
          {/* <DataTable
            value={props.attrValue}
            header={header}
            footer={footer}
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="attrImport" header="Attribute (Import)"></Column>
            <Column
              field="attrSystem"
              header="Attribute (System)"
              body={attrSystemTemplate}
            ></Column>
          </DataTable> */}
        </Col>
      </Row>
    </>
  )
}

export default AttributeMap
