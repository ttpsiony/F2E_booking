import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from 'reduxSaga';
import { summaryDay, isValidDate } from 'utils/webHelper';
import styles from './styles.scss';
import Calendar from './Calendar';

function Reserve({ weekdayPrice, weekendPrice, reservedDate, setShowConfirmModal, setAnimating }) {
	const { checkIn, checkOut } = useSelector((state) => state.booking);
	const dispatch = useDispatch();
	const calendarDivRef = useRef(null);
	const [focusInputClassName, setFocusInputClassName] = useState('');
	const [showCalendar, setShowCalendar] = useState(false);
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth());

	const onInputFocusHandler = (className) => {
		setFocusInputClassName(className);
		const input = document.querySelector(className);
		input.placeholder = 'YYYY/MM/DD';
	};

	const onInputBlurHandler = (className) => {
		const input = document.querySelector(className);
		const regRex = new RegExp('check-in', 'ig');
		input.placeholder = className.match(regRex) ? '入住' : '退房';
	};

	const onNextMonthClickHandler = () => {
		month === 11 && setYear(year + 1);
		setMonth((month + 12 + 1) % 12);
	};

	const onPrevMonthClickHandler = () => {
		month === 0 && setYear(year - 1);
		setMonth((month + 12 - 1) % 12);
	};

	const onDayClickHandler = (y, m, d) => {
		if (!d) return;
		const regRex = new RegExp('check-in', 'ig');
		const time = `${y}/${m + 1}/${d}`;
		if (!focusInputClassName.match(regRex) && checkIn) {
			if (new Date(checkIn).getTime() === new Date(time).getTime()) return;
			// 判斷 checkOut, checkIn 時間先後
			if (new Date(checkIn).getTime() > new Date(time).getTime()) {
				dispatch(actions.setReserveValue('checkOut', checkIn));
				dispatch(actions.setReserveValue('checkIn', time));
			} else {
				dispatch(actions.setReserveValue('checkOut', time));
			}
			setFocusInputClassName('');
			calendarDivRef.current.blur();
			return;
		}

		// 第一次選擇 checkIn
		if (!checkIn) {
			dispatch(actions.setReserveValue('checkIn', time));
			return;
		}
		// 如果重新選擇 checkIn，重新判斷 時間先後
		if (new Date(time).getTime() > new Date(checkOut).getTime()) {
			dispatch(actions.setReserveValue('checkOut', time));
			dispatch(actions.setReserveValue('checkIn', checkOut));
		} else {
			dispatch(actions.setReserveValue('checkOut', checkOut));
			dispatch(actions.setReserveValue('checkIn', time));
		}
	};

	const summary = () => {
		const weekdayCount = summaryDay(checkIn, checkOut).weekdayCount || 0;
		const weekendCount = summaryDay(checkIn, checkOut).weekendCount || 0;
		const total = weekdayPrice * weekdayCount + weekendPrice * weekendCount;

		return {
			weekdayCount,
			weekendCount,
			total,
		};
	};

	return (
		<div className={styles['reserve-card-container']}>
			<div className={styles.card}>
				<div className={styles.price}>
					<div>
						<span>$ {weekdayPrice}</span>
						<span>平日(一～四)</span>
					</div>
					<div>
						<span>$ {weekendPrice}</span>
						<span>假日</span>
					</div>
				</div>
				<div className={styles.calendar}>
					<div>日期</div>
					<div
						style={{ outline: 'none' }}
						role="button"
						tabIndex={0}
						ref={calendarDivRef}
						onFocus={() => {
							setShowCalendar(true);
						}}
						onBlur={() => {
							setFocusInputClassName('');
							setShowCalendar(false);
						}}
					>
						<div className={styles['date-input-wrapper']}>
							<div>
								<input
									className="check-in-input"
									type="text"
									placeholder="入住"
									onFocus={() => onInputFocusHandler('.check-in-input')}
									onBlur={() => onInputBlurHandler('.check-in-input')}
									onChange={(e) => {
										if (e.target.value === '') {
											dispatch(actions.setReserveValue('checkOut', ''));
										}
										dispatch(actions.setReserveValue('checkIn', e.target.value));
									}}
									value={checkIn}
								/>
								{checkIn && (
									<i
										className="fas fa-times-circle"
										onClick={() => {
											dispatch(actions.setReserveValue('checkIn', ''));
											dispatch(actions.setReserveValue('checkOut', ''));
										}}
									/>
								)}
							</div>
							<i className="fas fa-long-arrow-alt-right"></i>
							<div>
								<input
									className="check-out-input"
									type="text"
									placeholder="退房"
									onFocus={() => onInputFocusHandler('.check-out-input')}
									onBlur={() => onInputBlurHandler('.check-out-input')}
									onChange={(e) => dispatch(actions.setReserveValue('checkOut', e.target.value))}
									value={checkOut}
									disabled={!checkIn}
								/>
								{checkIn && checkOut && (
									<i
										className="fas fa-times-circle"
										onClick={() => dispatch(actions.setReserveValue('checkOut', ''))}
									/>
								)}
							</div>
						</div>
						<div style={{ position: 'relative' }}>
							{showCalendar && (
								<Calendar
									onDayClickHandler={onDayClickHandler}
									year={year}
									month={month}
									onNextMonthClickHandler={onNextMonthClickHandler}
									onPrevMonthClickHandler={onPrevMonthClickHandler}
									checkIn={checkIn}
									checkOut={checkOut}
									reservedDate={reservedDate}
								/>
							)}
						</div>
					</div>
				</div>
				{isValidDate(checkIn) && isValidDate(checkOut) && (
					<div className={styles['summary-wrapper']}>
						{!!summary().weekdayCount && (
							<div className={styles.weekday}>
								<span>
									$ {weekdayPrice} x {summary().weekdayCount}晚
								</span>
								<span>$ {weekdayPrice * summary().weekdayCount}</span>
							</div>
						)}
						{!!summary().weekendCount && (
							<div className={styles.weekend}>
								<span>
									$ {weekendPrice} x {summary().weekendCount}晚
								</span>
								<span>$ {weekendPrice * summary().weekendCount}</span>
							</div>
						)}
						<div className={styles.total}>
							<span>總計</span>
							<span>$ {summary().total}</span>
						</div>
					</div>
				)}

				{((checkIn && !isValidDate(checkIn)) || (checkOut && !isValidDate(checkOut))) && (
					<div className={styles['warning-tip']}>請填有效日期</div>
				)}

				<div className={styles['button-wrapper']}>
					<button
						type="button"
						onClick={() => {
							if (isValidDate(checkIn) && isValidDate(checkOut)) {
								document.body.style.overflowY = 'hidden';
								setShowConfirmModal(true);
								setAnimating(true);
								return;
							}
							calendarDivRef.current.focus();
						}}
					>
						<i className="far fa-calendar-check"></i>
						<span>{isValidDate(checkIn) && isValidDate(checkOut) ? '預定' : '查看可預訂日期'}</span>
					</button>
					<span className={styles.tip}>您暫時不會被收款</span>
				</div>
			</div>
		</div>
	);
}

export default Reserve;
