/** @format */
import moment from 'moment'
import { COMMON_URL } from './common-api-constants'

// Common Constants
export const FOOTER_CONTENT = `@Pimerce`
export const MODAL_LINK_TITLE = 'Link'
export const ERROR_BG_COLOR = '#e3f3ff'
export const VALID_BG_COLOR = '#e3f3ff'
export const WARNING_BG_COLOR = '#e3f3ff'
export const ROW_EDIT_BUTTON = { width: "120px", minWidth: "120px" };
export const ROW_EDIT_BODY = { textAlign: "center" };
export const SMALL = 'sm'
export const MEDIUM = 'md'
export const LARGE = 'lg'
export const X_LARGE = 'xl'
export const TOAST_TITTLE_FOR_FAIL = 'Request failed'
export const TOAST_TITTLE_FOR_SUCCESS = 'Request submitted'
export const ATTEMPT_INFO = 'Your account has been locked due to too many failed attempts, Please contact your admin'
export const INVALID_USER_LOGIN_INFO = 'Entered email id or password is invalid'
export const INTERNET_CONNECTION_ERROR = 'Network error , kindly check your internet connection'
export const INTERNAL_SERVER_ERROR = 'An unexpected error seems to have occurred. Why not try refreshing your page ? or you can contact support@pimerce.com if the problem persists'
export const PROFILE_UPDATED_INFO = 'Your profile has been updated successfully!'
export const SOMETHING_WENT_WRONG_INFO = 'Something went wrong, Please try again after sometime'
export const PASSWORD_CHANGED_INFO = 'You will be redirected to the login page'
export const ALL_FIELDS_MANDATORY = '* All fields are mandatory'
export const SETUP_PROFILE = 'Setup Your Profile'
export const NO_PROFILE = 'No profile found ! Contact support'
export const LOGIN_TO_YOUR_ACCOUNT = 'Please login to your account'
export const LOGOUT_MULTIPLE_MACHINE = 'Your account is already logout, please reload the page'
export const USERNAME_NOT_FOUND = 'Entered username is not found'
export const ENTER_VAILD_EMAIL = 'Please enter a valid Email Id'
export const RESET_LINK_USER_INFO = "Enter your registered email and We'll send you a link to reset your password"
export const RESET_LINK_SUCCESS_INFO = 'A password reset link has been sent. Please check your inbox.'
export const INACTIVE_MESSAGE = 'You have been inactive for a while. For your security, we will automatically sign you out and redirect you to login page. Click ok to proceed.'
export const PIMERCE_COMMERCE = { ecommerce: 'ECommerce', insights: 'Insights' }
export const lOGOUT = 'Logout'
export const LOGIN = 'Login'
export const CONFIRM = 'Confirm'
export const SAVE = 'Save'
export const SUBMIT = 'Submit'
export const CANCEL = 'Cancel'
export const BACK = 'Back'
export const ENTER_EMAIL_ID = 'Enter Email Id*'
export const CONFIRM_PASSWORD = 'Enter Confirm Password*'
export const NEW_PASSWORD = 'Enter New Password*'
export const CURRENT_PASSWORD = 'Enter your current Password*'
export const BACK_TO_LOGIN = 'Back To Login'
export const RESET_PASSWORD = 'Reset Password'
export const CHANGE_PASSWORD = 'Change Password'
export const FORGOT_PASSWORD = 'Forgot Password ?'
export const REQUIRED_FIELD = 'This is a required field'
export const REQUIRED_VALIDATION_FIELD ='Role Name is Required!'
export const REQUIRED_FIELDS = 'is Required!'
export const CHARACTER_SIZE_ISREQUIRED = 'should not be more than 50 letters'
export const CHARACTER_SIZE_REQUIRED = 'Characters must less than 50 characters'
export const CHARACTER_SIZES_REQUIRED = 'should be less than 50 characters'
export const CHARACTERS_SIZE_REQUIRED = 'should be less than 150 characters'
export const VALID_EMAIL_ID = 'Please enter valid Email Id'
export const RECORD = 'record'
export const RECORDS = 'records'
export const RESET = 'Reset'
export const MODULE = 'module'
export const SUPERADMIN = "Super Admin"
export const PAGE = "page"
export const OBJECT = "object"
export const BUTTON = "Button"
export const ROLENAME = 'Role Name'
export const ROLEDESC = 'Role Description'
export const RESET_PASSWORD_MESSAGE = 'Reset your password'
export const REQUEST_TO_RESET_PASSWORD = 'You have requested to reset the password'
export const BAD_CREDENTIALS = 'Bad credentials'
export const CHANGE_YOUR_PASSWORD = 'Change your Password'
export const GROUP = "group"

export const PERCENTAGE = '%'
export const HYPEN = '-'
export const CLEAR = 'clear'
export const HASH_TAG = '#'
export const ID = 'id'
export const ZERO = 0
export const TEN = 10
export const TRUE = true
export const FALSE = false
export const TRUE_STRING = 'true'
export const FALSE_STRING = 'false'
export const UNDEFINED = undefined
export const NULL = null
export const START_PERCENTAGE = '0%'
export const STOP_PERCENTAGE = '100%'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY'
export const MANDATORY_SYMBOL = '*'
export const REGISTERED_EMAIL = 'Registered Email'
export const ENTER_AUTHORIZED_EMAIL = 'Enter only authorized email domain'
export const PREFERRED_EMAIL_VALIDATION = "Email can't be same as registered. Please use different email"
export const IMAGE_EXT_VALIDATOR = /^https?:\/\/.+\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|avif|AVIF|gif|GIF|SVG|svg)$/
export const SPECIAL_CASE_VALIDATOR = /[^A-Za-z 0-9]/g;
export const PAGINATOR_TEMPLATE =  "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"

// Constants used for Notification Common Component
export const CLOSE = 'Close'
export const DANGER = 'danger'
export const SUCCESS = 'success'
export const WARNING = 'warning'
export const INFO = 'info'
export const TOP = 'top'
export const BOTTTOM = 'bottom'
export const TOP_START = 'top-start'
export const TOP_END = 'top-end'
export const BOTTOM = 'bottom'
export const BOTTOM_START = 'bottom-start'
export const BOTTOM_END = 'bottom-end'

// Constants used for SearchBar Common Component
export const SEARCH_BOX_CLEAR = 'CLEAR'
export const SEARCH_BOX_ENTER = 'ENTER'
export const SEARCH_BOX_PLACEHOLDER = 'Enter the Product Name (Minimum 3 characters required)'

//Constants used for dataGrid Common Component
export const NEXT = 'Next'
export const PREV = 'Prev'
export const ASC = 'asc'
export const DESC = 'desc'
export const SORT = 'Sort'
export const SCROLL_HEIGHT='100vh'
export const SCROLL_WIDTH='300px'
export const COLUMN_RESIZE_MODE='expand'
export const GRID_SIZE='large'

// Constants use to Dataview
export const DELIST = "MARKEDFORDELISTING"
export const LIST = "list"
export const GRID = "grid"
export const UPDATED_DATE_ASC = "By Date Asc"
export const UPDATED_DATE_DESC = "By Date Desc"
export const UPDATED_NAME_ASC = "By Name (A-Z)"
export const UPDATED_NAME_DESC = "By Name (Z-A)"
export const ROWSPERPAGEOPTIONS = [15, 35, 50, 75, 100]
export const PAGELINKSIZE = 5
export const TOTALPRODUCTS = "Total Products - {totalRecords}"
export const TOTALASSET = "Total Assets - {totalRecords}" 

//Constants use to show contact admin
export const CONTACT_ADMIN = 'Please contact Admin'

//EXPORT EMAIL
export const COMMA = ','
export const AT = '@'
export const ASTERIK = '* '

//constants for Navigation
export const DASHBOARD = 'dashboard'

export const UP = 'UP'
export const DOWN = 'DOWN'

export const MAXSIZENAME = 50
export const MAXSIZEDESC = 150
export const WORKFLOWMAXSIZE = 2000
export const PRODUCTNAME = "Product Name"
export const GTIN = "GTIN"
export const ASSETNAME = "File Name"
export const SIZE = "Size"

//Profile constants
export const SUPPORT_LINK = 'https://pimerce.freshdesk.com'
export const SUPPORT_TEXT = 'Support'
export const VERSION_TEXT = 'App Version'
export const SUCCESSFULLY = 'successfully'
export const LOGIN_DETAILS = 'loginUserDetails'
export const FAILED = 'Failed'

export const MULTI_LIST = [
	{
		id: 'ALL',
		name: 'ALL',
		value: 'ALL',
		label: 'ALL',
	},
]

// Organization Specific Color Code Constants
export const DASHBOARD_COLOR_CODES = 'Dashboard ColorCodes'
export const GENERIC_COLOR_CODES = 'Generic ColorCodes'
export const TREND_COLORCODES = 'Trend ColorCodes'
export const CONTENT_BARGRAPH_COLOR_CODES = 'ContentBarGraphColorCodes'
// Competitor BarGraph Color Codes
export const OUR_BRAND = 'ourBrand'
export const COMPETITOR_BRAND = 'competitorBrand'
export const NON_FOSA = 'NonFOSA'
export const OTHERS = 'Others'
export const COMPETITOR_COLOR_CODES = "CompetitorColorCodes"

// PrimeReact Popup
export const DIALOG_TEXT={
		SAVELABEL:"Create",
		CONTENTOF_DELETE:"Are you sure you want to delete?",
		CONTENTOF_MULTIDELETE:"Are you sure you want to delete the selected records?",
		REORDERTEXT:"Are you want to save?",
		ADDNEW_BUTTON_LABEL:"Add New Row",
		DELETE_BUTTON_LABEL:"Delete Selected",
		UPDATE_BUTTON_LABEL:"Update Attributes",
		ADDEDIT_POPUP_WIDTH:"650px"
}

export const FILTER_DATA=[
	{ label: "UNL-SKU-1",value:"UNL-SKU-1"},
	{ label: "UNL-SKU-2",value:"UNL-SKU-2"},
	{ label: "UNL-SKU-6",value:"UNL-SKU-6"},
	{ label: "UNL-SKU-9",value:"UNL-SKU-9"},
	{ label: "UNL-SKU-11",value:"UNL-SKU-11"},
	{ label: "UNL-SKU-12",value:"UNL-SKU-12"},
	{ label: "UNL-SKU-36",value:"UNL-SKU-36"},
	{ label: "UNL-SKU-70",value:"UNL-SKU-70"},
	{ label: "UNL-SKU-74",value:"UNL-SKU-74"},
	{ label: "UNL-SKU-84",value:"UNL-SKU-84"}
]

export const SKU_FILTER_DATA=[
    {label: "Category", value: "category"},
    {label: "Sub-Category", value: "sub-category"},
    {label: "Brand", value: "brand"},
    {label: "Sub-Brand", value: "sub-bategory"},
]

//Uppy
export const XHR_UPLOAD_URL = `${COMMON_URL}pim/fileUploadAndDownload/fileUpload`
export const COMPANION_URL = "http://localhost:3020"

//Export Sheet
export const EXPORT_EXCEL_URL = '/exportExcel.xlsx'

//End Point URL
export const PIM_API = 'pimerce-pim/api'
export const PIM_TRANSCATIONAL_FLOW = 'pimerce-transactional-flow/api'

//Import data
export const TEMPLATE_FILE_NAME = "Template.xlsx"
export const DOWNLOAD_FILE_NAME = "ProcessLog.xlsx"
export const TEMPLATE_URL = ""
export const IS_MODAL= 'isModal'
export const CLOUD = "cloud"
export const LOCAL = "local"
export const UPPY_PLUGINS = ['GoogleDrive', 'OneDrive']
export const LOCAL_COMPUTER = "Local computer"
//Click eventName
export const CREATE = 'create'
export const UPDATE = 'update'
export const DELETE = 'delete'
export const GROUPED = "group"
export const GETUPDATE ="getupdate"

// Searchable dropdown
export const SELECT_COLOR ='#E5712A'
export const FOCUS_COLOR ='#DEEBFF'
export const DROPDOWN_FONTSIZE='12px'
export const DROPDOWN_BORDERADIUS='4px'
export const BORDER_STYLE='solid 1px #E2E8F0'
export const BACKGROUND_COLOR='#FFFFFF'
export const VALUE_COLOR="#E3F3FF"
export const VALUE_COLOR_ATTRIBUTE = "#000000 !important"
export const TEXTBOX_BOX_SHADOW="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"

// ClassNames Constant
export const ERROR_FIELD_CLASSNAME ='p-inputtext p-component p-inputnumber-input error-validation'
export const ERROR_DESC_FIELD_CLASSNAME = 'p-inputtext p-inputtextarea desc-textarea-style error-validation'
export const ERROR_DROPDOWN_CLASSNAME= 'error-validation'

// Conditions constant
export const ATTR_NAME = "attrName";
export const ATTR_TYPE = "attrType";
export const ATTR_GRP_NAME = "attrGrpName";
export const ATTR_DESCRIPTION = "attrDescription";
export const ATTR_GRP_DESCTIPTION = "attrGrpDescription";

//Asset List constants
export const SUPER_CATEGORY = "superCategory"
export const CATEGORY = "category"
export const BRAND = "brand"