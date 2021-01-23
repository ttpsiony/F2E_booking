import React, { useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { calcCalendar } from 'utils/webHelper';

function Calendar(props) {
	const {
		onDayClickHandler,
		onNextMonthClickHandler,
		onPrevMonthClickHandler,
		year,
		month,
		checkIn,
		checkOut,
		reservedDate,
	} = props;
	const [onMouseOverDay, setOnMouseOverDay] = useState('');

	const renderCalendarTable = () => {
		const MS_PER_DAY = 1000 * 60 * 60 * 24;
		const calc = calcCalendar(year, month).map((week, idx) => {
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
						onMouseDown={() => {
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
				<thead>
					<tr>
						{['日', '一', '二', '三', '四', '五', '六'].map((el) => (
							<th key={el}>
								<div>{el}</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>{calc}</tbody>
			</table>
		);
	};

	return (
		<Wrapper>
			<div className="current-month">
				{year !== new Date().getFullYear() && (
					<span className="arrow-left" onClick={onPrevMonthClickHandler}>
						<i className="fas fa-angle-left"></i>
					</span>
				)}
				<span className="month">
					{year} / {month + 1}
				</span>
				<span className="arrow-right" onClick={onNextMonthClickHandler}>
					<i className="fas fa-angle-right"></i>
				</span>
			</div>
			<div className="date-table-wrapper">{renderCalendarTable()}</div>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 360px;
	position: absolute;
	left: -40px;
	top: 5px;
	padding: 15px;
	z-index: 10;
	background: #fff;
	box-shadow: 0px 3px 6px #00000029;
	@media (max-width: 991px) {
		left: -60px;
	}

	.current-month {
		position: relative;
		text-align: center;

		> span.month {
			font-size: 20px;
		}

		.arrow-left,
		.arrow-right {
			cursor: pointer;
			display: inline-block;
			width: 10px;
			height: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			font-size: 18px;
		}
		.arrow-left {
			left: 0;
			top: 10px;
		}
		.arrow-right {
			right: 0;
			top: 10px;
		}
	}

	.date-table-wrapper {
		table {
			width: 100%;
			font-size: 14px;
			margin-top: 15px;

			thead tr {
				padding: 8px 0;
			}

			tbody tr {
				padding: 4px 0;

				&:last-child {
					padding-bottom: 0;
				}
			}

			tr {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			td,
			th {
				width: 47px;
				height: 47px;
				text-align: center;
				/* border: 1px solid #000; */

				> div {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			th {
				color: #101010;
				font-weight: normal;
			}
			td {
				color: #484848;
				position: relative;
				cursor: pointer;

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
	}
`;

export default Calendar;
