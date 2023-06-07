import moment from 'moment'
import { DATE_FORMAT } from '../../common/common-constants'

export const getRetailerValueWithoutSeller = (retailerWithSellerRequest) => {
	let retailerList = []
	retailerWithSellerRequest.retailerList.length &&
		retailerWithSellerRequest.retailerList.map((i) => {
			let retailerStructure = {
				id: i.id,
				label: i.label,
				name: i.name,
				value: i.value
			}
			retailerList.push(retailerStructure)
		})

	return retailerList
}

export const getContentExcelReportFilterCriteria = (
	excelReportRequest,
	organizationId,
	moduleName
) => {
	const excelRequest = {
		retailerList: getRetailerValueWithoutSeller(excelReportRequest),
		categoryList: excelReportRequest.categoryList,
		brandList: excelReportRequest.brandList,
		organizationId: organizationId,
		moduleName: moduleName
	}

	return excelRequest
}

export const getCommonExcelReportGenerationRequest = (
	moduleName,
	excelReportRequest,
	organizationId
) => {
	const exportModalRequest = {
		moduleName: moduleName,
		processFlag: false,
		additionalEmailId: excelReportRequest.preferredMail,
		createdDate: moment(new Date()).format(DATE_FORMAT),
		emailId: excelReportRequest.registeredMail,
		userName: excelReportRequest.registeredMail,
		reportType: 'excel',
		showNotification: false,
		filterCriteria: JSON.stringify(
			getContentExcelReportFilterCriteria(
				excelReportRequest,
				organizationId,
				moduleName
			)
		)
	}

	return exportModalRequest
}
