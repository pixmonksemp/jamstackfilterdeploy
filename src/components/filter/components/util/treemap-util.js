/** @format */
import { blackColor, whiteColor } from "../../styling/scss/_variables.scss";
export const colorCodeData = {
	modulename: 'ContentInsights',
	thresholdset: [
		{
			min: 0.0,
			max: 10.0,
			colorcode: '#b4001e',
			fontColor: whiteColor
		},
		{
			min: 10.01,
			max: 20.0,
			colorcode: '#ea0a11',
			fontColor: whiteColor
		},
		{
			min: 20.01,
			max: 30.0,
			colorcode: '#ff6334',
			fontColor: blackColor
		},
		{
			min: 30.01,
			max: 40.0,
			colorcode: '#ffab50',
			fontColor: blackColor
		},
		{
			min: 40.01,
			max: 50.0,
			colorcode: '#feffb6',
			fontColor: blackColor
		},
		{
			min: 50.01,
			max: 60.0,
			colorcode: '#d4f17c',
			fontColor: blackColor
		},
		{
			min: 60.01,
			max: 70.0,
			colorcode: '#97db57',
			fontColor: blackColor
		},
		{
			min: 70.01,
			max: 80.0,
			colorcode: '#3bc155',
			fontColor: blackColor
		},
		{
			min: 80.01,
			max: 90.0,
			colorcode: '#009c47',
			fontColor: whiteColor
		},
		{
			min: 90.01,
			max: 100.0,
			colorcode: '#006b31',
			fontColor: whiteColor
		}
	]
}

export const treemapFilters = ['View By Retailer', 'View By Category']
