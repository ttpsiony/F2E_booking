import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import styled from 'styled-components';
import { isMobileDevice } from 'utils/webHelper';

// TODO: throttle 沒有效用
function Slider({ sliderList, roomUid }) {
	const history = useHistory();
	const [showController, setShowController] = useState(false);
	const [wrapperWidth, setWrapperWidth] = useState(0);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		window.addEventListener('resize', windowResizing);
		const sliderWrapper = document.querySelector('.slider-wrapper');
		const sliderWrapperWidth = window.getComputedStyle(sliderWrapper).getPropertyValue('width');
		const width = +sliderWrapperWidth.replace('px', '') || 0;
		setWrapperWidth(width);

		return () => {
			window.removeEventListener('resize', windowResizing);
		};
	}, []);

	const windowResizing = () => {
		const sliderWrapper = document.querySelector('.slider-wrapper');
		const sliderWrapperWidth = window.getComputedStyle(sliderWrapper).getPropertyValue('width');
		const width = +sliderWrapperWidth.replace('px', '') || 0;
		setWrapperWidth(width);
	};

	const onMouseEnterHandler = () => setShowController(true);
	const onMouseLeaveHandler = () => setShowController(false);

	const onSlideClickHandler = (e, direction = 'left') => {
		e.stopPropagation();
		if (direction === 'left' && currentIndex === 0) return;
		if (direction === 'right' && currentIndex === sliderList.length - 1) return;

		const newCurrentIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
		setCurrentIndex(newCurrentIndex);
	};

	// TODO: throttle 沒有效用
	const throttle = (fn, delay) => {
		let lastTime = 0;

		return (...arg) => {
			const now = new Date();
			if (now - lastTime < delay) return;
			lastTime = now;
			fn(...arg);
			console.log(lastTime);
		};
	};

	const onRoomTypeClickHandler = () => {
		window.scrollTo({ top: 0 });
		history.push(`/room/${roomUid}`);
	};

	return (
		<SliderWrapper className="slider-wrapper">
			<span
				className={cx('arrow-left', { show: showController || isMobileDevice() })}
				onMouseEnter={onMouseEnterHandler}
				onClick={(e) => throttle(onSlideClickHandler(e, 'left'), 500)}
			>
				<i className="fas fa-chevron-left"></i>
			</span>
			<div
				className="slider-img-wrapper"
				style={{ transform: `translateX(${-1 * currentIndex * wrapperWidth}px)` }}
				onClick={onRoomTypeClickHandler}
			>
				{sliderList.map((el, idx) => (
					<img
						className={`slider-${idx + 1}`}
						key={`slider-${idx + 1}`}
						src={el.src}
						alt={el.name}
						onMouseEnter={onMouseEnterHandler}
						onMouseLeave={onMouseLeaveHandler}
					/>
				))}
			</div>
			<span
				className={cx('arrow-right', { show: showController || isMobileDevice() })}
				onMouseEnter={onMouseEnterHandler}
				onClick={(e) => throttle(onSlideClickHandler(e, 'right'), 500)}
			>
				<i className="fas fa-chevron-right"></i>
			</span>
			<div
				className={cx('dots', { show: showController || isMobileDevice() })}
				onMouseEnter={onMouseEnterHandler}
			>
				{sliderList.map((_, idx) => (
					<span key={`dot_${idx + 1}`} className={cx({ 'high-light': idx === currentIndex })} />
				))}
			</div>
		</SliderWrapper>
	);
}

const SliderWrapper = styled.div`
	width: auto;
	position: relative;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);

	.slider-img-wrapper {
		cursor: pointer;
		display: flex;
		transition: all 500ms ease-out;

		img {
			width: 100%;
			object-fit: cover;
		}
	}

	.arrow-left,
	.arrow-right {
		position: absolute;
		z-index: 10;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateY(-50%);
		font-size: 14px;
		font-weight: normal;
		border-radius: 50%;
		background: #fff;
		color: #000;
		box-shadow: 0 0 10px #ccc;
		cursor: pointer;
		opacity: 0;

		&.show {
			transition: opacity 500ms ease-in-out;
			opacity: 1;
		}
	}

	.arrow-left {
		left: 10px;
		top: 50%;
	}

	.arrow-right {
		right: 10px;
		top: 50%;
	}

	.dots {
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		opacity: 0;

		span {
			padding: 4px;
			border-radius: 50%;
			background: #99a;
			box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
			margin: 0 4px;

			&.high-light {
				background: #fff;
				box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
			}
		}

		&.show {
			transition: opacity 500ms ease-in-out;
			opacity: 1;
		}
	}
`;

export default Slider;
