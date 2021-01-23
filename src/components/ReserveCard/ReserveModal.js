import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from 'reduxSaga';
import styled from 'styled-components';
import cx from 'classnames';
import { useSpring, animated, config } from 'react-spring';
import { calcCalendar, formateDate, diffTwoDate } from 'utils/webHelper';

const ReserveModal = ({
	time,
	animating,
	setAnimating,
	scrollPosition,
	setShowCalendarModal,
	weekdayPrice,
	weekendPrice,
	reservedDate,
	isSavingReserve,
	setIsSavingReserve,
}) => {
	const { checkIn, checkOut } = useSelector((state) => state.booking);
	const dispatch = useDispatch();
	const styleProps = useSpring({
		from: {
			opacity: animating ? 0 : 1,
			top: animating ? '100%' : '1.5%',
		},
		to: async (next) => {
			await next({
				opacity: animating ? 1 : 0,
				top: animating ? '1.5%' : '100%',
			});
		},
		config: {
			...config.default,
			duration: time,
		},
	});
	const [calendar, setCalendar] = useState([]);
	const [onMouseOverDay, setOnMouseOverDay] = useState('');

	useEffect(() => {
		const year = new Date().getFullYear();
		const month = new Date().getMonth();
		const arr = calendar.length < 6 ? [0, 1, 2] : [0, 1, 2, 3, 4, 5];
		const initCalendar = arr.map((i) => {
			const y = month + i > 11 ? year + 1 : year;
			return {
				year: y,
				month: (month + i) % 12,
				table: renderCalendar(y, (month + i) % 12),
			};
		});
		setCalendar(initCalendar);
	}, [checkIn, checkOut, onMouseOverDay]);

	const renderCalendar = (year, month) => {
		const tbody = calcCalendar(year, month).map((week, idx) => {
			const MS_PER_DAY = 1000 * 60 * 60 * 24;
			const weekDay = week.map((day, index) => {
				const renderedDay = `${year}/${month + 1}/${day}`;
				const dayTimestamp = new Date(renderedDay).getTime();
				let isDisabled = false;

				// 已預約日不能被選取
				const isReserved = (reservedDate || [])
					.map((el) => new Date(el).getTime())
					.includes(dayTimestamp);
				isDisabled =
					dayTimestamp <= new Date().getTime() ||
					dayTimestamp > new Date().getTime() + MS_PER_DAY * 90 ||
					isReserved;

				if (checkIn) {
					// 只能選擇在 checkIn之前最後的已預約日 到 checkIn之後的第一個已預約日 之間的日期
					const theLastBeforeCur = (reservedDate || [])
						.map((el) => new Date(el).getTime())
						.filter((el) => el < new Date(checkIn).getTime())
						.pop();
					const theFirstAfterCur = (reservedDate || [])
						.map((el) => new Date(el).getTime())
						.filter((el) => el > new Date(checkIn).getTime())
						.shift();

					isDisabled =
						isDisabled ||
						!!(theLastBeforeCur && dayTimestamp < theLastBeforeCur) ||
						!!(theFirstAfterCur && dayTimestamp > theFirstAfterCur);
				}

				const isCheckIn = renderedDay === checkIn;
				const isCheckOut = renderedDay === checkOut;

				let isBetween = false;
				if (onMouseOverDay && checkIn) {
					if (new Date(onMouseOverDay).getTime() >= new Date(checkIn).getTime()) {
						isBetween =
							dayTimestamp >= new Date(checkIn).getTime() &&
							dayTimestamp <= new Date(onMouseOverDay).getTime();
					} else {
						isBetween =
							dayTimestamp >= new Date(onMouseOverDay).getTime() &&
							dayTimestamp <= new Date(checkIn).getTime();
					}
				} else if (checkIn && checkOut) {
					isBetween =
						dayTimestamp > new Date(checkIn).getTime() &&
						dayTimestamp < new Date(checkOut).getTime();
				}

				return (
					<td
						key={`day-${index + 1}`}
						className={cx({
							'disabled-day': isDisabled,
							'check-in': isCheckIn,
							'check-out': isCheckOut,
							'between-day': isBetween,
							'is-null-day': !day,
						})}
						onMouseEnter={() => {
							day && (!checkIn || !checkOut) && setOnMouseOverDay(renderedDay);
						}}
						onMouseLeave={() => {
							onMouseOverDay && setOnMouseOverDay('');
						}}
						onClick={() => {
							!isDisabled && onDayClickHandler(year, month, day);
						}}
					>
						<div>{day}</div>
					</td>
				);
			});

			return <tr key={`week-${idx + 1}`}>{weekDay}</tr>;
		});

		return (
			<table>
				<tbody>{tbody}</tbody>
			</table>
		);
	};

	const onDayClickHandler = (y, m, d) => {
		if (!d) return;
		const date = `${y}/${m + 1}/${d}`;
		if (new Date(checkIn).getTime() === new Date(date).getTime()) return;

		// 第一次選擇 checkIn
		if (!checkIn) {
			dispatch(actions.setReserveValue('checkIn', date));
			return;
		}
		// 判斷 checkIn checkOut 時間先後
		if (new Date(date).getTime() < new Date(checkIn).getTime()) {
			dispatch(actions.setReserveValue('checkIn', date));
			dispatch(actions.setReserveValue('checkOut', checkIn));
		} else {
			dispatch(actions.setReserveValue('checkIn', checkIn));
			dispatch(actions.setReserveValue('checkOut', date));
		}
	};

	const getMoreDay = () => {
		const lastCalendar = calendar.slice(-1)[0] || {};
		const lastYear = lastCalendar.year || new Date().getFullYear();
		const lastMonth = lastCalendar.month || new Date().getMonth();

		if ((calendar || []).length >= 6) return;
		const newCalendar = [1, 2, 3].map((i) => {
			const y = lastMonth + i > 11 ? lastYear + 1 : lastYear;
			return {
				year: y,
				month: (lastMonth + i) % 12,
				table: renderCalendar(y, (lastMonth + i) % 12),
			};
		});
		const updateCalendar = calendar.concat(newCalendar);
		setCalendar(updateCalendar);
	};

	return (
		<Wrapper scrollPosition={scrollPosition}>
			<animated.div className="calendar" style={{ ...styleProps }}>
				<div className="calendar-header-wrapper">
					<div className="calendar-header">
						<span
							onClick={() => {
								setAnimating(false);
								document.body.style.overflowY = 'auto';
								setTimeout(() => {
									setShowCalendarModal(false);
								}, time);

								if (!isSavingReserve) {
									dispatch(actions.setReserveValue('checkOut', ''));
									dispatch(actions.setReserveValue('checkIn', ''));
								}
							}}
						>
							<i className="fas fa-times" />
						</span>
						<button
							type="button"
							className="clear"
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
				<div className="calendar-body-wrapper">
					<div className="booking-title-bar">
						<h2>
							{checkIn && checkOut
								? `${diffTwoDate(checkIn, checkOut)}晚`
								: !checkIn
								? '選擇入住日期'
								: '選擇退房日期'}
						</h2>
						<div>
							{!checkIn || !checkOut
								? '新增旅行日期，查看確切價格'
								: `${formateDate(checkIn)}-${formateDate(checkOut)}`}
						</div>
					</div>
					<div className="calendar-scrolling-wrapper">
						<div className="days-bar-wrapper">
							<ul className="days-bar">
								{['日', '一', '二', '三', '四', '五', '六'].map((day) => (
									<li key={day}>{day}</li>
								))}
							</ul>
						</div>
						<div className="render-calendar-wrapper">
							<div className="render-calendar">
								{calendar.map((el) => (
									<div key={`${el.year}-${el.month + 1}`} className="each-calendar">
										<h3>
											{el.year}年{el.month + 1}日
										</h3>
										<div>{el.table}</div>
									</div>
								))}
							</div>
							<div className="show-more-day">
								<button type="button" onClick={getMoreDay}>
									載入更多日期
								</button>
							</div>
						</div>
					</div>
					<div className="calendar-footer">
						<div>
							<div>
								<span>平日: </span>
								<span>
									<strong>${weekdayPrice}</strong>
								</span>
							</div>
							<div>
								<span>假日: </span>
								<span>
									<strong>${weekendPrice}</strong>
								</span>
							</div>
						</div>
						<button
							type="button"
							disabled={!checkIn || !checkOut}
							onClick={() => {
								setAnimating(false);
								document.body.style.overflowY = 'auto';
								setIsSavingReserve(true);
								setTimeout(() => {
									setShowCalendarModal(false);
								}, time);
							}}
						>
							儲存
						</button>
					</div>
				</div>
			</animated.div>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	.calendar {
		position: fixed;
		z-index: 1000;
		width: 100vw;
		height: calc(100% - 1.5%);
		left: 0;
		background: #fff;
		border-radius: 15px 15px 0 0;
	}

	.calendar-header-wrapper {
		padding: 15px;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 8px;

		i {
			font-size: 18px;
		}

		span {
			cursor: pointer;

			&:nth-of-type(1) {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 30px;
				height: 30px;
				border-radius: 50%;

				&:hover {
					background: #eee;
				}
			}
		}

		button.clear {
			cursor: pointer;
			display: inline-block;
			margin: 0px -8px;
			position: relative;
			text-align: center;
			width: auto;
			touch-action: manipulation;
			font-size: 14px;
			border-radius: 8px;
			outline: none;
			padding: 8px;
			transition: box-shadow 0.2s ease 0s, -ms-transform 0.1s ease 0s,
				-webkit-transform 0.1s ease 0s, transform 0.1s ease 0s;
			border: none;
			background: transparent;
			color: rgb(34, 34, 34);
			text-decoration: underline;

			&:hover {
				border: none;
				background: rgb(247, 247, 247);
				color: rgb(0, 0, 0);
			}
			&:active {
				transform: scale(0.96);
				border: none;
				background: rgb(247, 247, 247);
				color: rgb(0, 0, 0);
			}
		}
	}

	/*  */
	.calendar-body-wrapper {
		position: relative;
		height: 100%;

		.booking-title-bar {
			padding: 0 15px;
			div {
				color: rgb(113, 113, 113);
				font-size: 14px;
				padding-top: 8px;
			}
		}
	}

	.calendar-scrolling-wrapper {
		position: relative;
		margin-top: 30px;

		.days-bar-wrapper {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 20px 0 15px;

			&::before {
				content: '';
				position: absolute;
				width: 110vw;
				border-bottom: 1px solid rgb(221, 221, 221);
				bottom: -15px;
				z-index: 2;
			}
			&::after {
				content: '';
				position: absolute;
				width: 110vw;
				background: #fff;
				height: 15px;
				bottom: -15px;
				z-index: 1;
			}
		}

		ul.days-bar {
			max-width: 500px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;

			li {
				width: 47px;
				list-style: none;
				text-align: center;
			}
		}
	}

	.render-calendar-wrapper {
		width: 100%;
		height: calc(100vh - 275px);
		overflow: hidden scroll;

		.render-calendar {
			padding: 0 15px;

			div.each-calendar {
				margin-top: 30px;
				margin-bottom: 30px;
				display: flex;
				justify-content: center;
				flex-direction: column;

				h3 {
					width: 80%;
					margin: 0 auto;
					@media (max-width: 425px) {
						width: 90%;
					}
				}

				table {
					width: 100%;
					font-size: 14px;
					max-width: 500px;
					margin: 0 auto;

					tbody {
						width: 100%;
					}

					tr {
						display: inline-block;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 4px 0;
						max-width: 500px;
						margin: 0 auto;

						td {
							position: relative;
							display: inline-flex;
							align-items: center;
							justify-content: center;
							text-align: center;
							cursor: pointer;
							width: 47px;
							height: 47px;
							text-align: center;
							/* border: 1px solid #000; */

							> div {
								width: 40px;
								height: 40px;
								display: flex;
								align-items: center;
								justify-content: center;
							}

							&.disabled-day {
								text-decoration: line-through;
								color: rgb(176, 176, 176);
							}

							&:not(.disabled-day):not(.is-null-day):hover:before {
								content: '';
								position: absolute;
								width: 40px;
								height: 40px;
								border-radius: 50%;
								border: 1px solid #000;
								left: 50%;
								top: 50%;
								transform: translate(-50%, -50%);
							}

							&.check-in {
								background: rgb(247, 247, 247);
								border-top-left-radius: 50%;
								border-bottom-left-radius: 50%;

								> div {
									background: #000;
									color: #fff;
									border-radius: 50%;
								}
							}
							&.check-out {
								background: rgb(247, 247, 247);
								border-top-right-radius: 50%;
								border-bottom-right-radius: 50%;

								> div {
									background: #000;
									color: #fff;
									border-radius: 50%;
								}
							}
							&:not(.disabled-day):not(.is-null-day).between-day {
								background: rgb(247, 247, 247);
							}
						}
					}
					/* tr */
				}
				/* table  */
			}
		}

		.show-more-day {
			padding: 15px;
		}

		button {
			cursor: pointer;
			display: inline-block;
			margin: 0px;
			position: relative;
			text-align: center;
			text-decoration: none;
			touch-action: manipulation;
			font-size: 16px;
			border-radius: 8px;
			border: 1px solid rgb(34, 34, 34);
			outline: none;
			padding: 13px 23px;
			transition: box-shadow 0.2s ease 0s, -ms-transform 0.1s ease 0s,
				-webkit-transform 0.1s ease 0s, transform 0.1s ease 0s;
			background: rgb(255, 255, 255);
			color: rgb(34, 34, 34);
			width: 100%;

			&:hover {
				border-color: rgb(0, 0, 0);
				background: rgb(247, 247, 247);
				color: rgb(34, 34, 34);
			}
			&:active {
				transform: scale(0.96);
				border-color: rgb(0, 0, 0);
				background: rgb(247, 247, 247);
				color: rgb(34, 34, 34);
			}
		}
	}

	.calendar-footer {
		position: absolute;
		left: 0;
		bottom: 65px;
		padding: 0 30px;
		width: 100%;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid rgb(221, 221, 221);
		background: #fff;

		> div span {
			margin-right: 8px;
			font-size: 16px;
		}

		button {
			cursor: pointer;
			display: inline-block;
			margin: 0px;
			position: relative;
			text-align: center;
			text-decoration: none;
			width: auto;
			touch-action: manipulation;
			font-size: 16px;
			border-radius: 8px;
			outline: none;
			padding: 8px 15px;
			transition: box-shadow 0.2s ease 0s, -ms-transform 0.1s ease 0s,
				-webkit-transform 0.1s ease 0s, transform 0.1s ease 0s;
			border: none;
			background: rgb(34, 34, 34);
			color: rgb(255, 255, 255);

			&:active {
				transform: scale(0.96);
				border: none;
				background: rgb(0, 0, 0);
				color: rgb(255, 255, 255);
			}

			&:disabled {
				cursor: not-allowed;
				opacity: 1;
				border: none;
				background: rgb(221, 221, 221);
				color: rgb(255, 255, 255);
			}
		}
	}
`;

export default ReserveModal;
