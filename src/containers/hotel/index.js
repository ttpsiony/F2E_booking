import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from 'reduxSaga';
import Backdrop from 'components/Backdrop/Backdrop';
import Banner from 'components/Banner/Banner';
import Card from 'components/Card/Card';
import Footer from 'components/Footer/Footer';
import styles from './styles.scss';

//
function Hotel() {
	const { loading, homePage } = useSelector((state) => state.booking);
	const dispatch = useDispatch();
	const [showPage, setShowPage] = useState(false);

	useEffect(() => {
		dispatch(actions.getHomeIntroRequest());

		return () => {
			dispatch(actions.resetHomeIntro());
		};
	}, []);

	const roomsIntro = homePage.roomsInfo || [];

	const showMorePage = (isShowPage) => {
		setShowPage(isShowPage);
		setTimeout(() => {
			window.scrollTo({
				top: window.innerHeight,
				behavior: 'smooth',
			});
		}, 150);
	};

	return (
		<>
			{loading && <Backdrop loading={loading} />}

			{!loading && (
				<div>
					<Banner onClickHandler={showMorePage} bannerPic={homePage.bannerPic} />
					{showPage && (
						<div>
							<div className={styles['room-type-section']}>
								<div
									className={styles['section-title']}
									onClick={() => {
										dispatch(actions.testDispatch(1));
									}}
								>
									客房介紹
								</div>
								<div className={styles['card-wrapper']}>
									{(roomsIntro || []).map((room) => (
										<Card key={room.id} roomUid={room.id} room={room} />
									))}
								</div>
							</div>
							<div className={styles['traffic-section']}>
								<div className={styles['section-title']}>交通位置</div>
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3614.931726512868!2d121.5658572149996!3d25.036390933971248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1z5Y-w5YyX5ZGo6YKK55qE5L-h576pYTEz!5e0!3m2!1szh-TW!2stw!4v1605196318329!5m2!1szh-TW!2stw"
									title="google-map-iframe"
									width="100%"
									height="480px"
									style={{ border: 0 }}
									aria-hidden="false"
								/>
							</div>
							<Footer />
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default Hotel;
