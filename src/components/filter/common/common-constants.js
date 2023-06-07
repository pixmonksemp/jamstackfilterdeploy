/** @format */
import moment from "moment";
import {
  error_bg_color,
  valid_bg_color,
  kelly_green_color,
  torch_red_color,
  warning_bg_color,
} from "../styling/scss/_variables.scss";

// Common Constants
export const FOOTER_CONTENT = `© Pimerce ${moment().year()}`
export const MODAL_LINK_TITLE = 'Link'
export const ERROR_BG_COLOR = error_bg_color;
export const VALID_BG_COLOR = valid_bg_color;
export const WARNING_BG_COLOR = warning_bg_color;
export const SMALL = 'sm'
export const MEDIUM = 'md'
export const LARGE = 'lg'
export const X_LARGE = 'xl'
export const TOAST_TITTLE_FOR_FAIL = 'Request failed'
export const TOAST_TO_DATE_MISSING = 'Please select valid date range'
export const TOAST_TITTLE_FOR_SUCCESS = 'Request submitted'
export const TOAST_TITTLE_FOR_WARNING = 'Request Failed'
export const ATTEMPT_INFO = 'Your account has been locked due to too many failed attempts, Please contact your admin'
export const INVALID_USER_LOGIN_INFO = 'Entered email id or password is invalid'
export const EMAIL_NOT_FOUND = 'Please enter a valid email'
export const INTERNET_CONNECTION_ERROR = 'Network error , kindly check your internet connection'
export const INTERNAL_SERVER_ERROR = 'An unexpected error seems to have occurred. Why not try refreshing your page ? or you can contact support@pimerce.com if the problem persists'
export const PROFILE_UPDATED_INFO = 'Your profile has been updated successfully!'
export const PROFILE_NOT_UPDATED_INFO = 'Something went wrong, Please try again after sometime'
export const PASSWORD_CHANGED_INFO = 'You will be redirected to the login page'
export const ALL_FIELDS_MANDATORY = '* All fields are mandatory'
export const SETUP_PROFILE = 'Setup Your Profile'
export const NO_PROFILE = 'No profile found ! Contact support'
export const LOGIN_TO_YOUR_ACCOUNT = 'Please login to your account'
export const ENTER_VAILD_EMAIL = 'Please enter a valid Email Id'
export const RESET_LINK_USER_INFO = "Enter your registered email and We'll send you a link to reset your password"
export const RESET_LINK_SUCCESS_INFO = 'A password reset link has been sent. Please check your inbox.'
export const PIMERCE_COMMERCE = { ecommerce: 'ECommerce', insights: 'Insights' }
export const lOGOUT = 'Logout'
export const LOGIN = 'LOGIN'
export const CONFIRM = 'Confirm'
export const SAVE = 'Save'
export const SUBMIT = 'Submit'
export const CANCEL = 'Cancel'
export const BACK = 'Back'
export const CHANGE_PASSWORD = 'Change Password'
export const FORGOT_PASSWORD = 'Forgot Password ?'
export const REQUIRED_FIELD = 'This is a required field'
export const RESET = 'Reset'
export const POOR = 'Poor'
export const EXCELLENT = 'Excellent'
export const DATA_NOT_AVAILABLE = 'Data not available'
export const VIEW_BY_RETAILER = 'View by Retailer'
export const VIEW_BY_CATEGORY = 'View by Category'
export const VIEW_BY_RETAILER_ENV = 'View by Retailer Environment'
export const NOT_A_POWER_SKU = 'Selected SKU is not a power SKU please change the filter option'
export const CHECK_POWER_SKU = 'Check the Power SKU'
export const INCREASED_TREND = 'Increased'
export const DECREASED_TREND = 'Decreased'
export const EQUAL_TREND = 'Equal'
export const EQUAL_TREND_TEXT = 'No Changes Since Last Cycle'
export const NO_TREND = 'No Trend'
export const DAY = 'day'
export const PERCENTAGE = '%'
export const HYPEN = '-'
export const CLEAR = 'clear'
export const HASH_TAG = '#'
export const ID = 'id'
export const ZERO = 0
export const TEN = 10
export const TEN_AS_STRING = '10'
export const FIRST_PAGE = "First Page"
export const TRUE = true
export const FALSE = false
export const TRUE_STRING = 'true'
export const FALSE_STRING = 'false'
export const UNDEFINED = undefined
export const NULL = null
export const ZERO_PERCENTAGE = '0%'
export const RULE = 'Rule 1'
export const ZERO_POINT_ZERO_PERCENATGE = '0.0%'
export const IS_HAVING_ZERO = ' is having zero value'
export const ARE_HAVING_ZERO = ' are having zero values'

// Constants used for Export Modal Popup
export const ALL_RETAILERS = 'All Retailer'
export const ALL_CATEGORYIES = 'All Categories'
export const ALL_BRANDS = 'All Brands'
export const ALL_KEYWORDS = 'All Keywords'
export const ALL_SELLERS = 'All Sellers'
export const ALL_PINCODES = 'All Pincodes'
export const TOP_RESULTS = 'Top 10 Results'
export const RETAILERS = 'Retailers'
export const CATEGORIES = 'Categories'
export const BRANDS = 'Brands'
export const SELECT_CITY = 'Select City'
export const SELECT_PINCODE = 'Select Pincode'
export const SELECT_DATE = 'Date'
export const DATE_RANGE_MESSAGE = 'Please select a date within the range of 5 days'
export const FROM_DATE = 'From Date'
export const TO_DATE = 'To Date'
export const DISPLAY_DATE_MONTH_FORMAT = 'DD MMM'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DAY_FORMAT = 'DDDD'
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY'
export const MONTHLY_AVG = 'Monthly Avg'
export const WEEKLY_AVG = 'Weekly Average'
export const DAILY = 'Daily'
export const WEEKLY = 'Weekly'
export const MONTHLY = 'Monthly'
export const MANDATORY_SYMBOL = '*'
export const PREVIOUS_WEEK_CALC = { days: 'days', count: 7 }
export const REGISTERED_EMAIL = 'Registered Email'
export const PREFERRED_EMAIL = 'Preferred Email'
export const SENT_THE_DOCUMENT_TO = 'Send the document to:'
export const EMAIL_VALIDATION_TEXT = 'Enter Valid Email'
export const ENTER_AUTHORIZED_EMAIL = 'Enter only authorized email domain'
export const MAIL_ALREADY_ENTERED = 'Entered email is already present';
export const EXPORT_USER_INFO = 'The report will be mailed across to you.'
export const EXPORT_FOOTER_TEXT = 'Please give another email id where you want us to notify'
export const PREFERRED_EMAIL_VALIDATION = "Email can't be same as registered. Please use different email"
export const EXCEL_EXPORT_REQUEST_SUCCESSFUL = 'Thank you. We are processing your request and will notify you via mail once download is ready.'
export const EXCEL_REQUEST_NOT_FOUND = 'Please change the selection criteria as no data available for your selected filters.'
export const SKU_OPTION_NO_DATA = 'Please change the selection criteria as no sku available for your selected filters.'
export const RETAILER_RESTRICTION = 'Please select maximum five retailers in the filter.'

// Constants used for Filter Component
export const _SLIDER = "slider";
export const _SKU = "sku";
export const _SELLER = "seller";
export const _CITY = "city";
export const _LOCATION = "location";
export const _PINCODE = "pincode";
export const _STORE = "store";
export const _RETAILER_CATEGORY = "retailerCategory";
export const _KEYWORD = "keyword";
export const _KEYWORD_CATEGORY = "keywordCategory";
export const _RETAILER = "retailer";
export const _CATEGORY = "category";
export const _BRAND = "brand";
export const _CITY_SET = "citySet";
export const _PINCODE_SET = "pincodeSet";
export const _STORE_SET = "storeSet";
export const _POSITION = "position";
export const _MUSTSELL = "mustSell";
export const _DATE = "date";

// Constants used for Search Module
export const SHARE_OF_ORGANIC_SEARCH = "Share of Organic Search";
export const SHARE_OF_PAID_SEARCH = "Share of Paid Search";
export const TOTAL_SHARE_OF_SEARCH = "Total Share of Search";
export const SKU_STATUS = "SKUs Status";
export const SKU_BREAKDOWN = "SKU Breakdown";
export const EXPORT = "Export";
export const EXPORT_THE = "Export the";
export const EXPORT_CRITERIA_MESSAGE =
  "Please select the export criteria. We will notify you via mail, once the file is ready for download. Thankyou!";
export const SKU = "SKU";
export const SKU_FILTERS_SEARCH = {
  entryFilter: "isEntrySkuFilter",
  exitFilter: "isExitSkuFilter",
};
export const SKU_ENTERING = "SKU Entering";
export const SKU_EXITING = "SKU Exiting";
export const EXPORT_SEARCH_INSIGHTS = "Export Search Insights";
export const SOS_POSITION_INFO =
  "The values mentioned inside the brackets() indicates position of the keyword";
export const SOS_TREEMAP_ALL_ZERO_MESSAGE =
  "SOS data not available for selected filter";
export const UNTRACKED_SKUS_INFO_MSG =
  "Material code for untracked skus will be depicted in '-'";
export const SOS_TITLE = 
  "Consolidated Share of Search across Retailers"

// Constants used for pricing Module
export const SKU_FILTERS_PRICING = {
  compliance: "compliant",
  nonCompliance: "nonComplaint",
};
export const UA = "UA - Unavailable";
export const OOS = "OOS";
export const OOS_FULLFORM = "Out Of Stock";
export const HIGH_VARIANCE = "High";
export const LOW_VARIANCE = "Low";
export const MEDIUM_VARIANCE = "Medium";
export const NO_MISMATCH = "No Mismatch";
export const MSRP = "MSRP";
export const SELLING_PRICE = "Selling Price";
export const COMPLIANT = "Compliant";
export const NON_COMPLIANT = "Non Compliant";
export const PRICING_COMPARISON = "Pricing Comparison";
export const EXPORT_PRICING_INSIGHTS = "Export Pricing Insights";
export const VARIANCE = "Variance";

// Constants used for Inventory Module
export const ALL_CITIES = "All Cities";
export const VIEW_BY_SKU = "View by # of SKU";
export const VIEW_BY_PERCENTAGE = "View as %";
export const INVENTORY_SUMMARY_TAB = "Inventory Summary";
export const INVENTORY_SUMMARY = "inventorySummary";
export const INVENTORY_INSIGHTS = "inventoryInsights";
export const INVENTORY_BY_SKU = "Inventory by SKU";
export const EXPORT_INVENTORY_INSIGHTS = "Export Inventory Insights";
export const RETAILER_INFO =
  " * Retailer operates nation-wide with same availability in all cities.";
export const MODAL_NO_DATA_IN = "You do not have any In Stock SKUs";
export const MODAL_NO_DATA_OUT = "You do not have any Out of Stock SKUs";
export const AVAILABILITY_ALL_ZERO_MESSAGE =
  "Inventory Availability data not available";
export const INVENTORY_SUMMARY_DONUT_INFO_MESSAGE =
  "Overall % indicates In-Stock SKUs/Total SKUs";

// Constants used for Sentiment Module
export const RATINGS = "Ratings";
export const WORDCLOUD = "Wordcloud";
export const EMOTIONAL_VALENCE = "Emotional Valence Analysis from Review";
export const FREQUENCY_CHART = "Frequency Chart";
export const EXPORT_RATINGS_AND_REVIEW = "Export Rating and Reviews";
export const REVIEW_MODAL_TITLE = "Review Comment";

// Constants used for Content Module
export const CONSOLIDATED_VIEW = "Consolidated View";
export const BREAKDOWN = "Breakdown";
export const NA = "NA - Not Available";
export const NS = "NS - Not Supported";
export const NO_DATA_FOR_SELECTED_FILTER =
  "Data not available for the selected filter";
export const EXPORT_CONTENT_INSIGHTS = "Export Content Insights";
export const RETAILER_WISE_BREAKDOWN = "Retailer-wise breakdown";
export const VIEW_ACTIONS = "View Actions";
export const ACTIONS = "Actions";
export const RULES = " Rules";
export const VIDEO = "Video";
export const SCORE = " Score";
export const IMAGE = "Image";
export const TITLE = "Title";
export const CONTENT = "Content";
export const DESCRIPTION = "Description";
export const RETAILER = "Retailer";
export const CATEGORY = "Category";
export const BRAND = "Brand";
export const SUMMARY_PAGE_NAME ='Summary'
export const GRADE_A_VALUE = 'Grade A : 81-100%'
export const GRADE_B_VALUE = 'Grade B : 61-80%'
export const GRADE_C_VALUE = 'Grade C : 31-60%'
export const GRADE_D_VALUE = 'Grade D : 0-30%'
// export const

// Constants used for Notification Common Component
export const CLOSE = "Close";
export const DANGER = "danger";
export const SUCCESS = "success";
export const WARNING = "warning";
export const INFO = "info";
export const TOP = "top";
export const TOP_START = "top-start";
export const TOP_END = "top-end";
export const BOTTOM = "bottom";
export const BOTTOM_START = "bottom-start";
export const BOTTOM_END = "bottom-end";

// Constants used for SearchBar Common Component
export const SEARCH_BOX_CLEAR = "CLEAR";
export const SEARCH_BOX_ENTER = "ENTER";
export const SEARCH_BOX_PLACEHOLDER =
  "Enter the Product Name (Minimum 3 characters required)";

//Constants used for dataGrid Common Component
export const NEXT = "Next";
export const PREV = "Prev";
export const ASC = "asc";
export const DESC = "desc";
export const SORT = "Sort";
export const SEARCHBOX_PLACEHOLDER =
  "Enter the Product Name (Minimum 3 characters required)";
export const WRONG_TAB =
  "Selected filter criteria is not applicable for this tab";

//Constants used for dataGrid TAB
export const NATIONAL_RETAILER = "National Retailers";
export const LOCATION_RETAILER = "Location based Retailers";
export const STORE_RETAILER = "Store based Retailers";

// Constants used for Graph Common Component
export const NO_DATA_FOR_CHART = "Data not available for the selected filters";

// Constants used for Map Component
export const GEO_MAP = "GeoMap";

//Constants used for Rating_Component
export const RATING = "Rating";
export const VALUES = "values in %";
export const RATING_WITH_REVIEW = "Ratings with Review";
export const TOTAL_RATING = "Total Rating";
export const RATING_OUT_OF_FIVE = "Rating out of 5";
export const FILTER = "Filter";

// constants used for pricing-compliance
export const TITLE_FOR_TREEMAP = "Pricing Compliance by Retailer";
export const BIGBASKET = "Bigbasket";
export const NYKAA = "Nykaa";
export const AMAZON = "Amazon";
export const FLIPKART = "Flipkart";
export const TOOLTIPTEXT_TREEMAP = "Compliance";
export const MAPUNIT_TREEMAP = "%";
export const TITLE_FOR_DATAGRID = "Pricing Comparison";
export const SKU_FILTERS_PRICINGCOMPLIANCE = {
  compliance: "Compliance",
  nonCompliance: "Non-Compliance",
};
export const PRICING_COMPLIANCE_INFO =
  "The values mentioned inside the brackets() indicates the MSRP";
export const COMPLIANCE = "Compliance";
export const NON_COMPLIANCE = "Non-Compliance";
export const RETAILER_FILTER = "retailer";
export const CATEGORY_FILTER = "category";
export const BRAND_FILTER = "brand";
export const DATE_FILTER = "date";
export const SELLER = "Seller";
export const DISCOUNT = "Discount";
export const PRICING_TREEMAP_ALL_ZERO_MESSAGE =
  "Compliance data not available for selected filter";

// Constants used for Pricing Insights - Pricing Trend
export const TITLE_FOR_DATA_TABLE = "Pricing 5 Day Trend";
export const TITLE_FOR_CHART = "Pricing trend by SKU";
export const LABEL_FOR_CHART_YAXIS = "Price in ";
export const RETAILER_APPLIED_FILTER = "retailer";
export const CATEGORY_APPLIED_FILTER = "category";
export const BRAND_APPLIED_FILTER = "brand";
export const DATE_APPLIED_FILTER = "date";
export const TYPE_OF_CHART = "line";
export const BAR_CHART = "bar";

// Constants used for TreeMap component
export const TREE_MAP_MODULE_NAME = "TreeMap";
export const NESTED_OBJECT_NAME = "name";

// Constants used for inventory trend module
export const AVAILABLE = "Availability";
export const CITY = "City";
export const LOCATION = "Location";
export const STORE = "Store";
export const TOTAL_SKU = "Total SKU";
export const Y_AXIS_LABEL = "% Availability";
export const INV_GRID_TITLE = "Availability by Retailer";
export const DONUT_TITLE = "Overall Availability";
export const CHART_TITLE = "Availability trend by Retailer";
export const MODAL_TITLE = "Inventory Position";

//Constants use to show contact admin
export const CONTACT_ADMIN = "Please contact Admin";

// Constants used for content summary  module
export const ChartTitle = "Content compliance by retailer";
export const X_AXIS_LABEL = "Retailers";
export const GRID_TITLE = "Content Score";
export const LABEL_YAXIS = "# of Grades";
export const CONTENT_SUMMARY_CALCULATION_INFO =
  "The above computations are based on retailers which support the specific dimensions.";

// Constants used for content breakdown  module
export const CONTENT_OVERALL_TITLE = "Overall Score";
export const NO_TITLE_AVAILBLE = "No Title Available";
export const CONTENT_COLORCODE_MODULE_NAME = 'ContentGrading';
// Constants used for Share of Organic Search module
export const SHARE_OF_SEARCH = "Share of Search";
export const OVERALL_SHARE_OF_SEARCH = "Overall Share of Search";
export const ORGANIC_SEARCH = "Organic Search";

//SOS - SKU LEVEL ANALYSIS
export const KEYWORD = "Keyword";

//RELOAD INFO
export const RELOAD = "Something went wrong click to reload";

// Constants used for Search - Keyword Categories
export const KEYWORD_CATEGORIES_CHART_TITLE = "Keyword Category Trends";
export const KEYWORD_CATEGORIES_GRID_TITLE = "Keyword Category-wise Breakdown";
export const KEYWORD_CATEGORIES_LABEL_FOR_CHART_YAXIS = "Values In Percentage";

//EXPORT EMAIL
export const COMMA = ",";
export const AT = "@";

// Constants used for Filter Component
export const EMPTY_DROPDOWN = " Dropdown is empty";
export const EMPTY_DROPDOWNS = " Dropdowns are empty";

// constants used for dashboard
export const X_AXIS_LABEL_DASHBOARD = "Number of SKU";
export const CHART_TITLE_DASHBOARD = "Retailer Availability";
export const CHART_TITLE_DASHBOARD_PRICING = "Pricing Compliance";
export const CHART_TITLE_DASHBOARD_CONTENT = "Content Score";
export const TITLE_FOR_TREEMAP_DASHBOARD = "Share of Search";
export const TOOLTIPTEXT_TREEMAP_DASHBOARD = "SOS";
export const DASHBOARD_AVAILABILITY_TREEMAP = "Availability";
export const NO_CHANGE_TILE_TEXT = "No change over last ";
export const DASHBOARD_SOS_TREEMAP_ALLZERO_MESSAGE = "SOS data not Available";
export const FIS_IS_ZERO_ON = "FIS is zero on ";

//constants for Navigation
export const DASHBOARD = "dashboard";

//Search - Keyword Categories List
export const KEYWORD_CATEGORIES_LIST_TREEMAP_TITLE =
  "Search scores by Keyword Category";
export const KEYWORD_CATEGORIES_LIST_TREEMAP_TOOLTIP = "Search Score";
export const KEYWORD_CATEGORIES_LIST_GRID_TITLE =
  "SKU Level Analysis - By Keyword Category";

//Retailer Types
export const MARKETPLACE = "marketplace";
export const ONLINERETAILER = "onlineretailer";
export const HYPERLOCAL = "hyperlocal";

//Category - Share of Category
export const SHARE_OF_CATEGORY_TREEMAP_TITLE = "Share of Category";
export const SHARE_OF_CATEGORY_TREEMAP_TOOLTIP = "SOC";
export const SHARE_OF_CATEGORY_GRID_TITLE = "Share of Category Shelf";
export const CATEGORY_LEVEL = "categoryLevel";
export const BRAND_LEVEL = "brandLevel";
export const LOGIN_USER_DETAILS = "loginUserDetails";
export const CATEGORY_SEARCH = "categorysearch";
export const UP = "UP";
export const DOWN = "DOWN";
export const SHARE_OF_CATEGORY = "Share of Category";
export const EXCEL = "excel";
export const TREEMAP = "Treemap";
export const DATAGRID = "Datagrid";
export const MODAL = "Modal";
export const INFO_ZERO_VALUE_MESSAGE =
  "Brands with zero percentage are not shown";
export const ALL_VALUE_ZERO_MESSAGE =
  "SOC data not available for selected filter";
export const WEEK = "week";
export const MONTH = "month";
export const DONUT = 'donut';
export const GRAPH = 'graph';
export const TILES = 'Tiles';

//Category - Competitor Analysis
export const COMPETITOR_ANALYSIS = "Competitor Analysis";
export const SKU_S_CURRENTLY_LISTED = "SKU's Currently Listed";
export const NO_OF_SKU = "noOfSku";
export const SOC = "soc";
export const MISSING_SKU = "missingSku";
export const ENTERED = "Entered";
export const EXITED = "Exited";
export const POWER_SKU = "Power SKUs";
export const SOA = "SOA";

//Retailer sos
export const SHARE_OF_SEARCH_TREEMAP_TITLE = "Share of Search";
export const SHARE_OF_SEARCH_TREEMAP_TOOLTIP = "SOS";
export const SHARE_OF_SEARCH_TREEMAP_NODATA =
  "Share of Search Data not Available";

//Module name
export const PRICING_MODULE = "Pricing Insights";
export const INVENTORY_MODULE = "Inventory Insights";
export const INVENTORY_MODULE_WITHOUT_SPACE = "inventoryinsights";
export const CONTENT_MODULE = "Content Insights";
export const CONTENT_MODULE_WITHOUT_SPACE = "contentinsights";
export const RATINGS_MODULE = "Rating & Reviews";
export const RATINGS_MODULE_WITHOUT_SPACE = "Rating&Reviews";
export const CATEGORY_MODULE = "Category Search";
export const SOPS_MODULE = "SOPS";

export const PRODUCT_INFO = "productinfo";
export const CHART = "Chart";
export const TOTAL = "Total";
export const AVERAGE = "Average";
export const BAR = "bar";

//Profile constants
export const SUPPORT_LINK = "https://pimerce.freshdesk.com";
export const SUPPORT_TEXT = "Support";
export const VERSION_TEXT = "App Version";
export const SUCCESSFULLY = "successfully";
export const LOGIN_DETAILS = "loginUserDetails";
export const FAILED = "Failed";

export const MULTI_LIST = [
  {
    id: "ALL",
    name: "ALL",
    value: "ALL",
    label: "ALL",
  },
];

// Organization Specific Color Code Constants
export const DASHBOARD_COLOR_CODES = "Dashboard ColorCodes";
export const GENERIC_COLOR_CODES = "Generic ColorCodes";
export const TREND_COLORCODES = "Trend ColorCodes";
export const CONTENT_BARGRAPH_COLOR_CODES = "ContentBarGraphColorCodes";
export const CONTENT_RATINGS_COLORCODES = "ContentRatingsBarGraphColorCodes";
// Competitor BarGraph Color Codes
export const OUR_BRAND = "ourBrand";
export const COMPETITOR_BRAND = "competitorBrand";
export const NON_FOSA = "NonFOSA";
export const OTHERS = "Others";
export const COMPETITOR_COLOR_CODES = "CompetitorColorCodes";
export const RULE_CARD_INFO =
  "For Location/Store based retailers the content grades are based on preferred Location/Store";
export const DASHBOARD_CONTENT_BAR_GRAPH_COLOR_CODES =
  "ContentBarGraphColorCodes";
export const DIMENSION_CONTENT_BAR_GRAPH_COLOR_CODES =
  "ContentDimensionBarGraphColorCodes";
export const STAR_RATING_BAR_GRAPH_COLORCODES = "StarRatingBarGraphColorCodes";
export const OVERALL_RATING_BAR_GRAPH_COLORCODES =
  "OverAllRatingBarGraphColorCodes";
export const SUB_FAMILY_LIST_ALL = [
  {
    id: "PI-BRNDE-ALL",
    name: "All Brand Element",
    label: "All Brand Element",
    value: "All Brand Element",
  },
];

export const SOS_CATEGORY = "Share of Search for category";
//UNL DIFF
export const UNL_ORG_ID = "322d4c25-a94a-4b49-9b16-114ff89527d4"
export const NO = 'No'
export const TAB_MSG = 'level filter is selected'

//MARKET SHARE
export const VIEW_BY_VALUE = 'ViewByValue'
export const VIEW_BY_VOLUME = 'ViewByVolume'
export const MARKET_SHARE = 'Market_Share'
export const MARKETSHARE_SCRAP = 'marketshare'
export const MARKETSHARE = 'Market Share'
export const MARKETSHARE_COLOR_CODES = 'MarketShareColorCodes'
export const MARKETSHARE_COMPETITOR_COLOR_CODES = 'MarketShareCompetitorColorCodes'
export const ESTIMATED_MARKET_VALUE = 'Estimated Market Value'
export const ESTIMATED_MARKET_UNIT_SOLD = 'Estimated Market Unit Sold'
export const ESTIMATED_UNIT_SOLD = 'Estimated Unit Sold'
export const MANUFACTURER_HAVING_ZERO_VALUES = 'Manufacturer with zero value are not shown'
export const MANUFACTURER_HAVING_ZERO_VOLUMES = 'Manufacturer with zero volume are not shown'
export const MARKET_SHARE_AREA_CHART_TITLE = 'Category Growth'
export const VIEW_BY_VALUE_TEXT = 'View By Value'
export const VIEW_BY_VOLUME_TEXT = 'View By Volume'
export const LINE_CHART_YAXIS_TEXT = 'Category Size in'
export const EST_MARKET_SHARE = 'Est. Market Share'
export const EST_MARKET_VALUE = 'Est. Market Value'
export const EST_MARKET_UNIT_SOLD = 'Est. Market Unit Sold'
export const EST_UNIT_SOLD = 'Est. Unit Sold'
export const MARKET_INTELLIGENCE = 'Market Intelligence'
export const CATEGORY_GROWTH = 'Category Growth'
export const NEW_PRODUCT_INTELLIGENCE = 'New Product Intelligence'
export const SKU_STATUS_FOR_EXIST = 'Exist'
export const SKU_STATUS_FOR_ENTER = 'Enter'
export const NEW_PRODUCT_LAUNCHES_TITLE = 'New Product Launches'
export const MARKET_INTELLIGENCE_SCRAP_JOB = 'marketintelligence'
export const CATEGORY_GROWTH_COMPANYWISE_GRID_TITLE = 'Company Wise Performance'
export const CATEGORY_GROWTH_TOPSELLING_GRID_TITLE = 'Top Selling Products In Category'
export const CATEGORY_GROWTH_AREA_CHART_TITLE = 'Category Growth'
// SOS Constants
export const SOS_CATEGORY_GRID =
  "Location and Store based SOS% will be applicable for specific retailers";
export const NOT_CONFIGURED = "Not Configured";
export const TARGET_SOS = "Target SOS ";
export const BELOW_THRESHOLD = "Below threshold";
export const ABOVE_THRESHOLD = "Above threshold";
export const COLOR_BELOW = torch_red_color;
export const COLOR_ABOVE = kelly_green_color;
export const FORTNIGHTLY ='Fortnightly';

//OTHERS CONSTANTS
export const WITH_OTHERS = "Include Other Brands";
export const WITHOUT_OTHERS = "Exclude Other Brands";
export const GO_BACK = "Go Back";
export const INITIAL = 'initial';

//LOGO TOOLTIP MESSAGE
export const NATIONAL_RETAILER_MSG = "Click here to view SOA by all retailers category";
export const LOCATION_BASED_RETAILER_MSG =
  "Click here to view SOA by all locations and retailers category";
export const STORE_BASED_RETAILER_MSG =
  "Click here to view SOA by all stores and retailers category";
export const NO_IMAGE = "No Image Available";
//APP TYPE
export const MOBILE_APP = "Mobile App";

//Constants used in search bar
export const KEYWORD_SEARCH = 'Search Keyword'; 
export const PLACE_HOLDER_TEXT = 'Type Keyword';
export const SEARCH_BAR_INFO_MESSAGE = 'Select keyword to proceed';

//Used in Pricing insights
export const PRICING_INSIGHTS_OLD_COLORCODES="PricingInsightsGridOld";

// Used in Content KPI
export const CONTENT_BY_SCORE = 'Score';
export const CONTENT_BY_GRADE = 'Grade';
export const  SUMMARY_BY_SCORE = 'SummaryByScore'
export const IMAGE_BY_SCORE   =  'ImageByScore'
export const  TITLE_BY_SCORE =  'TitleByScore'
export const  DESCRIPTION_BY_SCORE =  'DescriptionByScore'
export const  VIDEO_BY_SCORE = 'VideoByScore'
export const  BREAKDOWN_BY_SCORE =  'BreakdownByScore'
export const SUMMARY_BY_GRADE = "SummaryByGrade"
export const BREAKDOWN_BY_GRADE = "BreakdownByGrade"
export const IMAGE_BY_GRADE = "ImageByGrade"
export const VIDEO_BY_GRADE = "VideoByGrade"
export const TITLE_BY_GRADE = "TitleByGrade"
export const DESCRIPTION_BY_GRADE = "DescriptionByGrade"
export const RULE_PASS = 'Pass'
export const CURRENT = 'Current ' 
export const NA_ONLY = 'NA'

//Used in Applied Filter
export const RESET_FILTER = 'Reset Filter'

// General constants
export const RETAILER_LOWER_CASE = 'retailer'
export const BRAND_LOWER_CASE = 'brand'
export const CATEGORY_LOWER_CASE = 'category'
export const DESCRIPTION_LOWER_CASE = 'description'
export const IMAGE_LOWER_CASE = 'image'
export const TITLE_LOWER_CASE = 'title'
export const VIDEO_LOWER_CASE = 'video'
export const IMAGES = 'Images'
export const A = "A"
export const B = "B"
export const C = "C"
export const D = "D"
export const A_GRADES_SKU ='a_gradeSku'
export const B_GRADES_SKU ='b_gradeSku'
export const C_GRADES_SKU ='c_gradeSku'
export const D_GRADES_SKU ='d_gradeSku'
export const _SCORE = ' Score'
export const _GRADE = ' Grade'

// Used in Review Comments Analysis
export const REVIEW_COLOR_CODE ="reviewBarGraph"
export const SELECT_ALL = 'Select All'
export const ALL = 'all'
export const ONE_TO_TWO_RANGE = '1-2'
export const TWO_TO_THREE_RANGE ='2-3'
export const THREE_TO_FOUR_RANGE ='3-4'
export const FOUR_TO_FIVE_RANGE ='4-5'
export const ONE_TO_TWO_RANGE_STAR ='1 star - 2 star'
export const TWO_TO_THREE_RANGE_STAR ='2 star - 3 star'
export const THREE_TO_FOUR_RANGE_STAR ='3 star - 4 star'
export const FOUR_TO_FIVE_RANGE_STAR ='4 star - 5 star'
export const _RATING = 'rating'
export const  REVIEW_COMMENTS = 'reviewcomments'
export const USER_NAME   = 'username'
export const  REVIEW_DATE = 'reviewdate'   
export const LOADING_TEXT = 'Loading....' 