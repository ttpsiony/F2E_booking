import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { actions } from 'reduxSaga';
import { summaryDay, isValidDate, formateDate, isMobileDevice } from 'utils/webHelper';
import ReserveCard from 'components/ReserveCard/Reserve';
import ReserveModal from 'components/ReserveCard/ReserveModal';
import ConfirmModal from 'components/ReserveCard/ConfirmModal';
import Gallery from 'components/Gallery/Gallery';
import Backdrop from 'components/Backdrop/Backdrop';
import Footer from 'components/Footer/Footer';
import styles from './styles.scss';

const ANIMATE_DURATION = 300;

function Room() {
	const { loading, roomIntro, checkIn, checkOut } = useSelector((state) => state.booking);
	const dispatch = useDispatch();
	const { roomId } = useParams();
	const history = useHistory();
	//
	const [isMobile, setIsMobile] = useState(false);
	const [showGalleryModal, setShowGalleryModal] = useState(false);
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showMoreService, setShowMoreService] = useState(false);
	const [slideIdx, setSlideIdx] = useState(0);
	const [animating, setAnimating] = useState(true);
	const [isSavingReserve, setIsSavingReserve] = useState(false);

	const imageList = roomIntro.sliderList || [];
	const serviceList = roomIntro.services || [];

	useEffect(() => {
		dispatch(actions.getRoomByIdRequest(roomId));

		window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
		window.addEventListener('resize', windowResizing);

		return () => {
			window.removeEventListener('resize', windowResizing);
			dispatch(actions.resetRoomIntro());
			dispatch(actions.setReserveValue('checkOut', ''));
			dispatch(actions.setReserveValue('checkIn', ''));
		};
	}, []);

	const windowResizing = () => {
		window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
	};

	const summary = () => {
		const weekdayCount = summaryDay(checkIn, checkOut).weekdayCount || 0;
		const weekendCount = summaryDay(checkIn, checkOut).weekendCount || 0;
		const total = roomIntro.weekdayPrice * weekdayCount + roomIntro.weekendPrice * weekendCount;

		return {
			weekdayCount,
			weekendCount,
			total,
		};
	};

	//
	return (
		<>
			{(loading || showGalleryModal || showCalendarModal || showConfirmModal) && (
				<Backdrop
					loading={loading}
					showGalleryModal={showGalleryModal}
					setShowGalleryModal={setShowGalleryModal}
					showCalendarModal={showCalendarModal}
					setShowCalendarModal={setShowCalendarModal}
					showConfirmModal={showConfirmModal}
					setShowConfirmModal={setShowConfirmModal}
					setAnimating={setAnimating}
					time={ANIMATE_DURATION}
				/>
			)}

			{!loading && (
				<div className={styles['room-container']}>
					<div className={styles['image-gallery']}>
						<span
							className={styles.logo}
							onClick={() => {
								history.push('/');
							}}
						>
							FANCY MARBLE
						</span>
						<span
							className={styles['show-image-gallery-btn']}
							onClick={() => {
								window.scrollTo({ top: 0 });
								document.body.style.overflowY = 'hidden';
								setSlideIdx(0);
								setShowGalleryModal(true);
								setAnimating(true);
							}}
						>
							<i className="fas fa-th-large"></i>
							顯示全部相片
						</span>
						{/*  */}
						<span
							className={cx(styles['mobile-slider-btn'], styles.left)}
							onClick={() => {
								setSlideIdx((idx) => (idx - 1 + 6) % 6);
							}}
						>
							<i className="fas fa-chevron-left"></i>
						</span>
						<span
							className={cx(styles['mobile-slider-btn'], styles.right)}
							onClick={() => {
								setSlideIdx((idx) => (idx + 1 + 6) % 6);
							}}
						>
							<i className="fas fa-chevron-right"></i>
						</span>
						{imageList
							.filter((_, idx) => isMobile || idx < 3)
							.map((el, idx) => (
								<div
									key={`room-${idx + 1}`}
									className={cx(styles[`second-area-${idx + 1}`], styles['img-wrapper'], {
										[styles.hidden]: isMobile && slideIdx !== idx,
									})}
									onClick={() => {
										if (!isMobile || isMobileDevice()) {
											window.scrollTo({ top: 0 });
											document.body.style.overflowY = 'hidden';
											setShowGalleryModal(true);
											setAnimating(true);
											setSlideIdx(idx);
										}
									}}
								>
									<img src={el.src} alt="room" />
								</div>
							))}
					</div>
					{/*  */}
					<div className={styles['room-info-wrapper']}>
						<div className={styles['room-info']}>
							<h1>
								<div>{roomIntro.name}</div>
								<div>{roomIntro.enName}</div>
							</h1>
							<div className={styles['detail-title']}>客房資訊</div>
							<div className={styles['detail-description']}>
								<div>描述</div>
								<p>{roomIntro.description}</p>
							</div>
							<div className={styles['check-in-info']}>
								<div>入住資訊</div>
								<div>
									<span>Check-in</span>
									<span>{roomIntro.checkInTime}</span>
								</div>
								<div>
									<span>Check-out</span>
									<span>{roomIntro.checkOutTime}</span>
								</div>
								<div>
									<span>人數限制</span>
									<span>{roomIntro.limitNum}人</span>
								</div>
								<div>
									<span>客房大小</span>
									<span>{roomIntro.roomSize}平方公尺</span>
								</div>
							</div>
							<div className={styles['room-service']}>
								<div>客房設備</div>
								<div className={styles['service-wrapper']}>
									{serviceList
										.filter((_, idx) => showMoreService || idx < 4)
										.map((el) => (
											<div key={el.name} className={!el.isProvided ? styles['not-provided'] : null}>
												<span>
													<i className={el.className}></i>
												</span>
												<span>{el.name}</span>
											</div>
										))}
									<span
										className={styles['more-service-btn']}
										onClick={() => {
											setShowMoreService((prevShowMoreService) => !prevShowMoreService);
										}}
									>
										顯示{!showMoreService ? '全部' : '較少'}設備與服務
									</span>
								</div>
							</div>
						</div>
						<div className={styles.reserve}>
							<ReserveCard
								weekdayPrice={roomIntro.weekdayPrice || 0}
								weekendPrice={roomIntro.weekendPrice || 0}
								reservedDate={roomIntro.reservedDate || []}
								setShowConfirmModal={setShowConfirmModal}
								setAnimating={setAnimating}
							/>
						</div>
					</div>

					{isValidDate(checkIn) && isValidDate(checkOut) && (
						<div className={styles['summary-wrapper']}>
							<div className={styles['reserve-info']}>
								<div>預定資訊</div>
								<div>{`${formateDate(checkIn)}-${formateDate(checkOut)}`}</div>
							</div>
							{!!summary().weekdayCount && (
								<div className={styles.weekday}>
									<span>
										$ {roomIntro.weekdayPrice} x {summary().weekdayCount}晚
									</span>
									<span>$ {roomIntro.weekdayPrice * summary().weekdayCount}</span>
								</div>
							)}
							{!!summary().weekendCount && (
								<div className={styles.weekend}>
									<span>
										$ {roomIntro.weekendPrice} x {summary().weekendCount}晚
									</span>
									<span>$ {roomIntro.weekendPrice * summary().weekendCount}</span>
								</div>
							)}
							<div className={styles.total}>
								<span>總計</span>
								<span>$ {summary().total}</span>
							</div>
							<div className={styles['summary-button-wrapper']}>
								<button
									className={styles.show}
									type="button"
									onClick={() => {
										if (isMobile) {
											document.body.style.overflowY = 'hidden';
											setShowCalendarModal(true);
											setAnimating(true);
										}
									}}
								>
									查看其他日期
								</button>
								<button
									className={styles.clear}
									type="button"
									onClick={() => {
										dispatch(actions.setReserveValue('checkOut', ''));
										dispatch(actions.setReserveValue('checkIn', ''));
										setIsSavingReserve(false);
									}}
								>
									清除日期
								</button>
							</div>
						</div>
					)}

					<Footer />
					{isMobile && (
						<div className={styles['small-screen-booking-btn-wrapper']}>
							<div>
								<div>
									<span>平日: </span>
									<span>
										<strong>${roomIntro.weekdayPrice}</strong>
									</span>
								</div>
								<div>
									<span>假日: </span>
									<span>
										<strong>${roomIntro.weekendPrice}</strong>
									</span>
								</div>
							</div>
							<button
								type="button"
								onClick={() => {
									if (!isSavingReserve) {
										if (isMobile) {
											document.body.style.overflowY = 'hidden';
											setShowCalendarModal(true);
											setAnimating(true);
										}
									} else {
										document.body.style.overflowY = 'hidden';
										setShowConfirmModal(true);
										setAnimating(true);
									}
								}}
							>
								<i className="far fa-calendar-check"></i>
								<span>{checkIn && checkOut ? '預定' : '查看可預訂日期'}</span>
							</button>
						</div>
					)}

					{showGalleryModal && !isMobile && (
						<Gallery
							imageList={imageList || []}
							slideIdx={slideIdx}
							setSlideIdx={setSlideIdx}
							setShowGalleryModal={setShowGalleryModal}
							animating={animating}
							setAnimating={setAnimating}
							time={300}
						/>
					)}
					{showCalendarModal && isMobile && (
						<ReserveModal
							scrollPosition={(typeof window === 'object' && window.scrollY) || 0}
							showCalendarModal={showCalendarModal}
							setShowCalendarModal={setShowCalendarModal}
							weekdayPrice={roomIntro.weekdayPrice || 0}
							weekendPrice={roomIntro.weekendPrice || 0}
							reservedDate={roomIntro.reservedDate || []}
							animating={animating}
							setAnimating={setAnimating}
							time={ANIMATE_DURATION}
							isSavingReserve={isSavingReserve}
							setIsSavingReserve={setIsSavingReserve}
						/>
					)}
				</div>
			)}
			{showConfirmModal && checkIn && checkOut && (
				<ConfirmModal
					roomId={roomId}
					{...summary()}
					name={roomIntro.name || ''}
					limit={roomIntro.limitNum || 1}
					checkIn={checkIn}
					checkOut={checkOut}
					weekdayPrice={roomIntro.weekdayPrice || 0}
					weekendPrice={roomIntro.weekendPrice || 0}
					showConfirmModal={showConfirmModal}
					setShowConfirmModal={setShowConfirmModal}
					setIsSavingReserve={setIsSavingReserve}
					animating={animating}
					setAnimating={setAnimating}
					scrollTo={(typeof window === 'object' && window.scrollY) || 0}
					deviceWidth={(typeof window === 'object' && window.innerWidth) || 0}
					// time={ANIMATE_DURATION}
				/>
			)}
		</>
	);
}

export default Room;
