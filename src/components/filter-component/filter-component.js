import React, { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import "./style.scss"
import { Dropdown } from "primereact/dropdown"

function FilterComponent(props) {
  const {
    onChangeSelect,
    mandatoryColumnList,
    isOptionDisabled,
    hierarchyDropdownSelected,
  } = props
  return (
    <div className="filter-dropdown">
        {mandatoryColumnList.length > 0 &&
          mandatoryColumnList.map((item) => {
            let options = []
            if (props[item] && props[item].length > 0) {
              props[item].map((e) => {
                let value
                if (item == "locale") {
                  value = { label: e.locale, value: e.id }
                }
                if (item == "superCategory") {
                  value = { label: e.scatName, value: e.id }
                }
                if (item == "childSuperCategory") {
                  value = { label: e.childscatName, value: e.id }
                }
                if (item == "category") {
                  value = { label: e.catName, value: e.id }
                }
                if (item == "childCategory") {
                  value = { label: e.childcatName, value: e.id }
                }
                if (item == "subCategory") {
                  value = { label: e.subcatName, value: e.id }
                }
                if (item == "childSubCategory") {
                  value = { label: e.childsubcatName, value: e.id }
                }
                if (item == "brand") {
                  value = { label: e.brandName, value: e.id }
                }
                if (item == "childBrand") {
                  value = { label: e.childbrandName, value: e.id }
                }
                if (item == "subBrand") {
                  value = { label: e.subbrandName, value: e.id }
                }
                options.push(value)
              })
            }
            return (
              <>
                {item != "locale" && (
                  <div className="dropdown-col-style">
                    <label className="filter-label-fontsize text-capitalize font-weight-bold mt-1">{item}</label>
                    <Dropdown
                      className="multiselect-item"
                      placeholder={item}
                      options={options}
                      optionLabel="label"
                      optionValue="value"
                      value={
                        hierarchyDropdownSelected &&
                        hierarchyDropdownSelected[item]
                      }
                      emptyMessage="No Options"
                      disabled={isOptionDisabled}
                      onChange={(e) => {
                        if (!isOptionDisabled) {
                          onChangeSelect(
                            item,
                            e.value,
                            e.originalEvent.target.ariaLabel
                          )
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )
          })}
    </div>
  )
}

export default FilterComponent
