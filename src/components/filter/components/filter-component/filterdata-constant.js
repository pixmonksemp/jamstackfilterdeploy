export const exportFilterDataValue = {
	selectedRetailer: [],
	selectedSuperCategory: [],
	selectedChildSuperCategory: [],
	selectedCategory: [],
	selectedChildCategory: [],
	selectedSubCategory: [],
	selectedChildSubCategory: [],
	selectedBrand: [],
	selectedSubFamily: [],
	selectedSubBrand: [],
	selectedKeyword: [],
	selectedKeywordCategory: [],
	selectedKeywordType: [],
	selectedKeywordTag: [],
	selectedSku: [],
	selectedPosition: [],
	selectedDisplayDate: '',
	selectedMustsellsku: false,
	selectedKeyaccount: [],
	selectedCitySet: [],
	selectedPincodeSet: [],
	selectedStoreSet: [],
	selectedRetailerCategory: [],
	selectedKeywordOption:''
}
export const exportFilterDataOption = {
	retailerOption: [],
	superCategoryOption: [],
	childSuperCategoryOption: [],
	categoryOption: [],
	childCategoryOption: [],
	subCategoryOption: [],
	childSubCategoryOption: [],
	brandOption: [],
	subFamilyOption: [],
	subBrandOption: [],
	keywordOption: [],
	keywordTypeOption: [],
	keywordTagOption:[],
	keywordCategoryOption: [],
	skuOption: [],
	positionOption: [],
	displayDateOption: '',
	mustsellskuOption: false,
	keyaccountOption: [],
	citySetOption: [],
	pincodeSetOption: [],
	storeSetOption: [],
	retailerCategoryOption: [],
}

export const filterDataValue = {
	selectedRetailer: [],
	selectedSuperCategory: [],
	selectedChildSuperCategory: [],
	selectedCategory: [],
	selectedChildCategory: [],
	selectedSubCategory: [],
	selectedChildSubCategory: [],
	selectedBrand: [],
	selectedSubFamily: [],
	selectedSubBrand: [],
	selectedKeyword: [],
	selectedKeywordCategory: [],
	selectedKeywordType: [],
	selectedKeywordTag: [],
	selectedSku: [],
	selectedPosition: [],
	selectedDisplayDate: '',
	selectedMustsellsku: false,
	selectedKeyaccount: [],
	selectedCitySet: [],
	selectedPincodeSet: [],
	selectedStoreSet: [],
	selectedRetailerCategory: [],
	selectedKeywordOption:''
}
export const filterDataOption = {
	retailerOption: [],
	superCategoryOption: [],
	childSuperCategoryOption: [],
	categoryOption: [],
	childCategoryOption: [],
	subCategoryOption: [],
	childSubCategoryOption: [],
	brandOption: [],
	subFamilyOption: [],
	subBrandOption: [],
	keywordOption: [],
	keywordTypeOption: [],
	keywordTagOption:[],
	keywordCategoryOption: [],
	skuOption: [],
	positionOption: [],
	displayDateOption: '',
	mustsellskuOption: false,
	keyaccountOption: [],
	citySetOption: [],
	pincodeSetOption: [],
	storeSetOption: [],
	retailerCategoryOption: [],
}

export const dropdownList = [
	'Retailer',
	'Super Category',
	'Category',
	'Sub Category',
	'Child Super Category',
	'Child Category',
	'Brand',
	'Sub Family',
	'Child Sub Category',
	'Keyword',
	'Keyword SKL Type',
	'Keyword Tag',
	'Keyword Type',
	'Position',
	'mustSell',
	'SKU',
	'Date',
	'keyaccount',
	'City Set',
	'Pincode Set',
	'Store Set',
	"Retailer's Category",
]

export const dropdownSelectionList = [
	'Retailer',
	'Super Category',
	'Category',
	'Sub Category',
	'Brand',
	'Sub Family',
	'Child Super Category',
	'Child Category',
	'Child Sub Category',
	'Keyword',
	'Keyword SKL Type',
	'Keyword Tag',
	'Keyword Type',
	'Position',
	'SKU',
	'keyaccount',
	'City Set',
	'Pincode Set',
	'Store Set',
	"Retailer's Category",
]

export const appliedFiltersList = [
	'Retailer',
	'Super Category',
	'Category',
	'Sub Category',
	'Brand',
	'Sub Family',
	'Child Super Category',
	'Child Category',
	'Child Sub Category',
	'Keyword',
	'Keyword SKL Type',
	'Keyword Tag',
	'Keyword Type',
	'Position',
	'City Set',
	'Pincode Set',
	'Store Set',
	'Date',
	'mustSell',
	'SKU',
	"Retailer's Category",
]

export const dropdownNameList = [
	'Retailer',
	'Super Category',
	'Category',
	'Sub Category',
	'Brand',
	'Sub Family',
	'Child Super Category',
	'Child Category',
	'Child Sub Category',
	'Keyword',
	'Keyword SKL Type',
	'Keyword Tag',
	'Keyword Type',
	'Position',
	'SKU',
	'City Set',
	'Pincode Set',
	'Store Set',
	"Retailer's Category",
]

export const removeArrayObjectDuplicates = (data, key) => {
	if (data && data.length && data[0] !== undefined && key) {
		return data.filter(
			(obj, index, self) =>
				index === self.findIndex((el) => el[key] === obj[key])
		)
	} else {
		return data
	}
}

export const setEmptyArray = (data, list) => {
	list &&
		list.length &&
		list.map((item) => {
			return (data[item] = [])
		})
	return data
}

// Filter Component Label Constants
export const APPLIED_FILTERS = 'Applied Filters'
export const POWER_SKU = 'Show only Power SKUs'

// Sort Array Of Objects in asc or desc
export const sortArrayOfObjectValues = (key, order = 'asc') => {
	return function innerSort(valueA, valueB) {
		if (!valueA.hasOwnProperty(key) || !valueB.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0
		}

		const labelA =
			typeof valueA[key] === 'string'
				? valueA[key].toUpperCase()
				: valueA[key]
		const labelB =
			typeof valueB[key] === 'string'
				? valueB[key].toUpperCase()
				: valueB[key]

		let comparison = 0
		if (labelA > labelB) {
			comparison = 1
		} else if (labelA < labelB) {
			comparison = -1
		}

		return order === 'desc' ? comparison * -1 : comparison
	}
}

// Sort Array Of Objects in asc or desc
export const sortArrayOfObjectName = (key, order = 'asc') => {
	return function innerSort(valueA, valueB) {
		if (!valueA.hasOwnProperty(key) || !valueB.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0
		}

		const labelA =
			typeof valueA[key].grade === 'string'
				? valueA[key].grade.toUpperCase()
				: valueA[key].grade
		const labelB =
			typeof valueB[key].grade === 'string'
				? valueB[key].grade.toUpperCase()
				: valueB[key].grade

		let comparison = 0
		if (labelA > labelB) {
			comparison = 1
		} else if (labelA < labelB) {
			comparison = -1
		}

		return order === 'desc' ? comparison * -1 : comparison
	}
}

// Sort Array Of Objects in asc or desc
export const sortArrayOfObjectFloat = (key, order = 'asc') => {
	return function innerSort(valueA, valueB) {
		if (!valueA.hasOwnProperty(key) || !valueB.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0
		}
		let labelA =
			typeof valueA[key].score === 'string'
				? valueA[key].score.toUpperCase()
				: valueA[key].score
		let labelB =
			typeof valueB[key].score === 'string'
				? valueB[key].score.toUpperCase()
				: valueB[key].score

		let comparison = 0
		labelA = parseFloat(labelA)
		labelB = parseFloat(labelB)
		if (labelA > labelB) {
			comparison = 1
		} else if (labelA < labelB) {
			comparison = -1
		}

		return order === 'desc' ? comparison * -1 : comparison
	}
}

export const PrepareStructure = (metadata, data) => {
	let arrayList = []
	if (metadata != null && data === 'value') {
		if (metadata && metadata.length) {
			arrayList = metadata.map((item) => {
				if (item && item.name) {
					let object = { id: item.id, value: item.name }
					return object
				} else {
					let object = { id: '', value: item }
					return object
				}
			})
		}
	}
	if (metadata != null && data === 'objectName') {
		if (metadata && metadata.length) {
			arrayList = metadata.map((item) => {
				if (item && item.value) {
					let object = {
						id: item.id,
						name: item.value,
						value: item.value,
						label: item.value,
					}
					if (object && object.seller) {
						delete object.seller
					}
					if (object && object.showpincode) {
						delete object.showpincode
					}
					return object
				} else if (item && item.name) {
					let object = {
						id: item.id,
						name: item.id,
						value: item.value,
						label: item.value,
					}
					if (object && object.seller) {
						delete object.seller
					}
					if (object && object.showpincode) {
						delete object.showpincode
					}
					return object
				} else {
					let object = { id: '', name: item }
					return object
				}
			})
		}
	}
	return arrayList
}
