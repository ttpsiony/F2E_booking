import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { formateDate } from 'utils/webHelper';
import { actions } from 'reduxSaga';

const ConfirmModal = ({
	time = 200,
	animating,
	setAnimating,
	setShowConfirmModal,
	setIsSavingReserve,
	scrollTo,
	// deviceWidth,
	//
	roomId,
	name,
	limit,
	checkIn,
	checkOut,
	weekdayPrice,
	weekdayCount,
	weekendPrice,
	weekendCount,
	total = 0,
}) => {
	const animatedProps = useSpring({
		from: {
			opacity: animating ? 0 : 1,
			transform: animating ? 'scale(0)' : 'scale(1)',
		},
		to: {
			opacity: animating ? 1 : 0,
			transform: animating ? 'scale(1)' : 'scale(0)',
		},
		config: {
			duration: time,
		},
	});

	const dispatch = useDispatch();
	const [scrollPosition, setScrollPosition] = useState(scrollTo);
	const [userName, setUserName] = useState('');
	const [userPhone, setUserPhone] = useState('');
	useEffect(() => {
		window.addEventListener('scroll', scrolling);

		return () => {
			window.removeEventListener('scroll', scrolling);
		};
	}, [window]);

	const scrolling = () => {
		setScrollPosition(window.scrollY);
	};

	return (
		<Wrapper scrollPosition={scrollPosition}>
			<animated.div className="confirm-modal" style={{ ...animatedProps }}>
				<div className="order-info-wrapper">
					<h3>預訂資料</h3>
					<div className="order-info">
						<div className="order-section">
							<div className="title">日期</div>
							<div className="info">
								{formateDate(checkIn)} ~ {formateDate(checkOut)}
							</div>
						</div>
						<div className="order-section">
							<div className="flex">
								<div className="title">房型</div>
								<div className="title">房型</div>
							</div>
							<div className="flex">
								<div className="info pf-15">{name}</div>
								<div className="info pf-15">{limit} 位</div>
							</div>
						</div>
						<div className="order-section">
							<div className="title">價錢</div>
							{!!weekdayCount && (
								<div className="flex price">
									<div>
										$ {weekdayPrice} x {weekdayCount}晚
									</div>
									<div>$ {weekdayPrice * weekdayCount}</div>
								</div>
							)}
							{!!weekendCount && (
								<div className="flex price">
									<div>
										$ {weekendPrice} x {weekendCount}晚
									</div>
									<div>$ {weekendPrice * weekendCount}</div>
								</div>
							)}
							<div className="flex price total">
								<div>總金額</div>
								<div>$ {total}</div>
							</div>
						</div>
					</div>

					<div className="user-basic-info">
						<div className="name">
							<span>姓名</span>
							<input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
						</div>
						<div className="phone">
							<span>電話</span>
							<input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
						</div>
					</div>

					<div className="btn-wrapper">
						<div>
							<button
								className="cancel"
								type="button"
								onClick={() => {
									document.body.style.overflowY = 'auto';
									setAnimating(false);
									setTimeout(() => {
										setShowConfirmModal(false);
									}, time);
								}}
							>
								取消
							</button>
						</div>
						<div>
							<button
								className="confirm"
								type="button"
								disabled={!userName || !userPhone}
								onClick={() => {
									if (!userName || !userPhone) return;

									dispatch(
										actions.postReserveInfoRequest({
											roomId,
											userName,
											userPhone,
											checkIn,
											checkOut,
											total,
										}),
									);

									document.body.style.overflowY = 'auto';
									setIsSavingReserve(false);
									setAnimating(false);
									setTimeout(() => {
										setShowConfirmModal(false);
									}, time);
								}}
							>
								預訂
							</button>
							<div className="tip">您暫時不會被收款</div>
						</div>
					</div>
				</div>
			</animated.div>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	.confirm-modal {
		z-index: 700;
		background: #fff;
		box-shadow: 0px 3px 6px #00000029;
		border-radius: 4px;
		color: #000;
		position: absolute;
		width: 460px;
		left: calc((100% - 520px) / 2);
		top: ${(p) => `calc(${p.scrollPosition}px + 15px)`};
		@media (max-width: 767px) {
			width: calc(100% - 30px);
			left: 15px;
			top: ${(p) => `calc(${p.scrollPosition}px + 15px)`};
		}
	}

	h3 {
		font-size: 28px;
		margin: 0;
		margin-bottom: 15px;
	}

	.order-section {
		margin-bottom: 15px;
	}

	.flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
		> div {
			flex: 1;
		}

		&.price {
			padding: 4px 0;
			font-size: 14px;

			div:nth-child(1) {
				padding-left: 15px;
			}
			div:nth-child(2) {
				text-align: right;
			}

			&.total {
				border-top: 1px solid #d4d4d4;
			}

			&.total > div {
				padding-left: 0;
				padding-top: 4px;

				&:nth-child(2) {
					font-size: 18px;
					color: #fadd02;
				}
			}
		}
	}

	.pf-15 {
		padding-left: 15px;
	}

	.title {
		color: #707070;
		font-size: 14px;
		margin-bottom: 4px;
	}

	.info {
		color: #101010;
		font-size: 18px;
		@media (max-width: 767px) {
			font-size: 16px;
		}
	}

	.order-info-wrapper {
		padding: 30px;
		@media (max-width: 767px) {
			padding: 30px 15px;
		}
	}

	.order-info {
		padding: 15px;
		background: #efefef;
	}

	/*  */
	.user-basic-info {
		margin-top: 15px;

		.name,
		.phone {
			padding: 8px 0;
			display: flex;
			align-items: center;
			/* border-bottom: 1px solid #cdcdcd; */

			span {
				width: 50px;
			}
			input {
				font-size: 14px;
				padding: 8px 4px;
				flex: 1;
				border: 1px solid #ccc;
				border-radius: 4px;
				box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
				transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
				outline: none;

				&:focus {
					border-color: #66afe9;
					box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
				}
			}
		}
	}

	/*  */
	.btn-wrapper {
		margin-top: 15px;
		display: flex;
		justify-content: space-between;

		> div {
			width: calc(50% - 15px);
		}

		.tip {
			font-size: 14px;
			color: #484848;
			text-align: center;
			padding-top: 4px;
		}

		button {
			cursor: pointer;
			width: 100%;
			height: 48px;
			outline: none;
			padding: 8px 15px;
			transition: box-shadow 0.2s ease 0s, -ms-transform 0.1s ease 0s,
				-webkit-transform 0.1s ease 0s, transform 0.1s ease 0s;
			border: none;

			&:active {
				transform: scale(0.96);
			}
		}

		button.cancel {
			background: #efefef;
			color: #707070;

			&:active {
				background: #cdcdcd;
				color: #707070;
			}
		}
		button.confirm {
			background: linear-gradient(
				to right,
				rgb(230, 30, 77) 0%,
				rgb(227, 28, 95) 50%,
				rgb(215, 4, 102) 100%
			);
			color: rgb(255, 255, 255);

			&:active {
				background: rgb(255, 56, 92);
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

export default ConfirmModal;
