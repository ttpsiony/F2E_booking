import React from 'react';
import styles from './styles.scss';
import Slider from '../Slider/Slider';

function Card({ roomUid, room }) {
	return (
		<div className={styles.card}>
			<div className={styles['image-wrapper']}>
				<Slider sliderList={room.sliderList || []} roomUid={roomUid} />
			</div>
			<div className={styles['room-type']}>{room.name}</div>
			<div className={styles['weekday-price']}>平日 ${room.weekdayPrice}</div>
			<div className={styles['weekend-price']}>假日 ${room.weekendPrice}</div>
		</div>
	);
}

export default Card;
