/** @format */

import { bool } from 'prop-types'
import React, { Component } from 'react'
import ApiUtil from '../api-util'

export function parseMethodNames(methods) {
	switch (typeof methods) {
		case 'object':
			return Object.keys(methods).map(key => {
				const value = methods[key]
				switch (typeof value) {
					case 'object': {
						const { url, type, onError } = value
						if (!url) {
							throw new Error(
								`Missing 'url' key in object '${key}'`
							)
						}
						if (!type) {
							throw new Error(
								`Missing 'type' key in object '${key}'`
							)
						}
						if (onError && typeof onError !== 'function') {
							throw new Error(
								`onError must be a function for resource '${key}'`
							)
						}
						return Object.assign({ alias: key }, value)
					}
					default: {
						throw new Error('Invalid method data type')
					}
				}
			})
		default:
			throw new Error('Invalid method data type.')
	}
}

export default function ApiConnector(ChildComponent, options) {
	const methods = parseMethodNames(options.methods)
	class ApiWrapper extends Component {
		constructor(props) {
			super(props)
			const dispatchToPropsStore = this.mapDispatchToProps(methods)
			this.state = {
				actionResultToPropsStore: {},
				isFetching: true,
				dispatchToPropsStore,
				errorType: ''
			}

			this.initApiCall = this.initApiCall.bind(this)
			this.mapDispatchToProps = this.mapDispatchToProps.bind(this)
		}

		mapDispatchToProps(methods) {
			// props -> api method name 
			return methods.reduce((props, nameInfo) => {
				const { alias, type, url } = nameInfo
				props[alias] = (...params) => {
					return this.initApiCall(type, url, alias, ...params)
				}
				return props
			}, {})
		}

		initApiCall(type, url, resource, data, params) {
			let isApiFailed = true
			// resource -> api method name
			// data -> request parameter send
			this.setState({ actionResultToPropsStore: {} })

			switch (type) {
				case 'get':
					ApiUtil.get(url, data, params).then(content => {
						this.handleResponse(resource, content, data)
					})
					break
				case 'post':
					ApiUtil.post(url, data, params).then(content => {
						if (content == undefined && isApiFailed) {
							isApiFailed = false
							ApiUtil.post(url, data, params).then(content => {
								this.handleResponse(resource, content, data)
							})
						} else {
							this.handleResponse(resource, content, data)
						}
					})
					break
				case 'put':
					ApiUtil.put(url, data, params).then(content => {
						this.handleResponse(resource, content, data)
					})
					break
				case 'delete':
					ApiUtil.delete(url, data, params).then(content => {
						this.handleResponse(resource, content, data)
					})
					break
				default:
					break
			}
		}


		handleResponse(resource, content, params) {
			const { actionResultToPropsStore } = this.state
			this.handleError(content)
			actionResultToPropsStore[`${resource}Result`] = {
				content,
				params,
				isFetching: false
			}
			this.setState({ actionResultToPropsStore })
		}

		handleError(content) { }

		render() {
			const {
				actionResultToPropsStore,
				dispatchToPropsStore,
				isFetching,
				errorType
			} = this.state

			const childProps = {
				...actionResultToPropsStore,
				...dispatchToPropsStore
			}

			return (
				<ChildComponent
					{...childProps}
					initApiCall={this.initApiCall}
					{...this.props}
				// isFetching={isFetching}
				/>
			)
		}
	}
	return ApiWrapper
}
