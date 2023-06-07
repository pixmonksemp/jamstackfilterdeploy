/** @format */
import ratingIcon from '../../assets/ratingIcon.svg'
import contentIcon from '../../assets/contentIcon.svg'
import inventoryIcon from '../../assets/inventoryIcon.svg'
import pricingIcon from '../../assets/pricingIcon.svg'
import categoryIcon from '../../assets/assortmentIcon.svg'
import promotionIcon from '../../assets/promotionIcon.svg'
import dashboardIcon from '../../assets/dashboardIcon.svg'
import searchIcon from '../../assets/searchIcon.svg'

export const renderIconList = [
    { key: 'search', value: searchIcon },
    { key: 'rating', value: ratingIcon },
    { key: 'content', value: contentIcon },
    { key: 'inventory', value: inventoryIcon },
    { key: 'dashboard', value: dashboardIcon },
    { key: 'pricing', value: pricingIcon },
    { key: 'category', value: categoryIcon },
    { key: 'promotion', value: promotionIcon },
    { key: 'managemaster', value: promotionIcon}
]

/**
 * This is the Mock SideMenu Options Rendering Response Data
 * @tutorial - Reference Parent & Child Level Side Menu Options Response Structrure
 * @yields - {
        'key': 'search', - // Parent Menu
        'navigate': '/searchInsights',
        'icon': 'searchIcon',
        'title': 'Search',
        'items': [ // Child Menu Level One
            {
                'key': 'sos',
                'navigate': '/sosComparison',
                'icon': 'searchIcon',
                'title': 'Share of Search',
                'items': [ // Child Menu Level Two
                    {
                        'key': 'sops',
                        'navigate': '/sopsComparison',
                        'title': 'SOP-1',
                        'items': [ Upto Child Level infinity ]
                    }
                ]
            }
        ]
    }
 */
