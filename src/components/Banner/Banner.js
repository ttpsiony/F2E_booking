import React from 'react';
import { useHistory } from 'react-router';
import styles from './styles.scss';

function Banner(props) {
	const history = useHistory();
	const { onClickHandler, bannerPic } = props;

	const onGoToIndexPageHandler = () => {
		history.push('/');
	};

	return (
		<div className={styles['banner-container']} style={{ backgroundImage: `url(${bannerPic})` }}>
			<span className={styles.logo} onClick={onGoToIndexPageHandler}>
				FANCY MARBLE
			</span>
			<div className={styles.title}>舒適體驗的首選</div>
			<span
				className={styles['start-explore']}
				onClick={() => {
					onClickHandler(true);
				}}
			>
				開始探索
			</span>
			<div className={styles['scrolling-down']}>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	);
}

export default Banner;
