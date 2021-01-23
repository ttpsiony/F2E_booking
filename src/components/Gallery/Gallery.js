import React from 'react';
import styled from 'styled-components';
import { useSpring, useTransition, animated } from 'react-spring';

function Gallery({
	time,
	animating,
	setAnimating,
	setShowGalleryModal,
	imageList,
	slideIdx,
	setSlideIdx,
}) {
	const animatedProps = useSpring({
		from: {
			opacity: animating ? 0 : 1,
			top: animating ? '50%' : '0px',
		},
		to: async (next) => {
			await next({
				opacity: animating ? 1 : 0,
				top: animating ? '0px' : '50%',
			});
		},
		config: {
			duration: time,
		},
	});
	const transitions = useTransition(slideIdx, (p) => p, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	});

	return (
		<Wrapper>
			<animated.div className="gallery" style={{ ...animatedProps }}>
				<div className="header">
					<span
						className="close-btn"
						onClick={() => {
							setSlideIdx(0);
							setAnimating(false);
							document.body.style.overflowY = 'auto';
							setTimeout(() => {
								setShowGalleryModal(false);
							}, time);
						}}
					>
						<i className="fas fa-times"></i>
						<span>關閉</span>
					</span>
					<div className="page">
						<span>
							<strong>{slideIdx + 1}</strong>
						</span>
						<span>/</span>
						<span>{imageList.length}</span>
					</div>
				</div>
				<div className="slider-wrapper">
					{slideIdx !== 0 && (
						<span
							className="slider-btn left-button"
							onClick={() => {
								const updateSlideIdx = slideIdx - 1;
								setSlideIdx(updateSlideIdx);
							}}
						>
							<i className="fas fa-chevron-left"></i>
						</span>
					)}
					{slideIdx !== imageList.length - 1 && (
						<span
							className="slider-btn right-button"
							onClick={() => {
								const updateSlideIdx = slideIdx + 1;
								setSlideIdx(updateSlideIdx);
							}}
						>
							<i className="fas fa-chevron-right"></i>
						</span>
					)}
					<div className="slide-images">
						{transitions.map(({ item, props, key }) => {
							const currentItem = imageList[item];
							return (
								<animated.div className="slide-img-wrapper" key={key} style={{ ...props }}>
									<img src={currentItem.src} alt="slider pic" />
								</animated.div>
							);
						})}
					</div>
				</div>
			</animated.div>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	.gallery {
		padding: 30px;
		position: absolute;
		left: 0;
		top: 50%;
		width: 100vw;
		height: 100vh;
		background: #fff;
		z-index: 1000;
	}

	.header {
		position: relative;
		margin-bottom: 30px;

		span.close-btn {
			position: absolute;
			left: 0px;
			top: 0px;
			padding: 4px 16px;
			background: rgba(0, 0, 0, 0.6);
			background: rgba(34, 34, 34, 0.1);
			color: rgb(34, 34, 34);
			border-radius: 8px;
			cursor: pointer;

			i {
				margin-right: 8px;
			}
		}

		.page {
			text-align: center;
			font-size: 18px;
			span {
				padding: 0 4px;
			}
		}
	}

	.slider-wrapper {
		position: relative;
		height: 100%;
		width: 100%;

		.slider-btn {
			position: absolute;
			width: 50px;
			height: 50px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			top: 50%;
			transform: translateY(-50%);
			background: #fff;
			cursor: pointer;
			box-shadow: 0 4.6px 5.3px rgba(0, 0, 0, 0.018), 0 0.4px 17.9px rgba(0, 0, 0, 0.033),
				0 0px 10px rgba(0, 0, 0, 0.07);
			z-index: 10;

			&.left-button {
				left: 30px;
			}
			&.right-button {
				right: 30px;
			}
		}
	}

	.slide-images {
		position: relative;
		width: calc(100% - 120px);
		height: 100%;
		margin: 0 auto;

		div.slide-img-wrapper {
			position: absolute;
			width: 90%;
			height: 80vh;
			left: 5%;
			top: 40vh;
			transform: translate(0%, -50%);
			text-align: center;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				user-select: none;
				-webkit-user-drag: none;
			}
		}
	}
`;

export default Gallery;
