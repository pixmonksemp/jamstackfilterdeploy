import React from 'react'
import { Card } from 'react-bootstrap'
import exclamation from '../../assets/Info.svg'
import i18n from "../../translate/i18n";
import './style.scss'

let message=i18n.t("noRecordMessage"),
	icon = exclamation

function DataNotAvailable (props) {
		return (
			<Card className='no-data-container'>
				<Card.Body>
					<Card.Img src={icon} className='no-data-image' />
					<div className='no-data-message'>{props.validationMessage? props.validationMessage : message}</div>
				</Card.Body>
			</Card>
		)
}

export default DataNotAvailable