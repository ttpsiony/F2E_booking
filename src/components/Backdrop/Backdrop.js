import React from 'react';
import styled from 'styled-components';

const Backdrop = ({
	loading,
	showGalleryModal,
	setShowGalleryModal,
	showCalendarModal,
	setShowCalendarModal,
	showConfirmModal,
	setShowConfirmModal,
	//
	setAnimating,
	time,
}) => (
	<Wrapper
		onClick={() => {
			if (loading) return;
			if (showGalleryModal && setShowGalleryModal) {
				setAnimating(false);
				setTimeout(() => {
					setShowGalleryModal(false);
				}, time);
			}
			if (showCalendarModal && setShowCalendarModal) {
				setAnimating(false);
				setTimeout(() => {
					setShowCalendarModal(false);
				}, time);
			}
			if (showConfirmModal && setShowConfirmModal) {
				setAnimating(false);
				setTimeout(() => {
					setShowConfirmModal(false);
				}, time);
			}
			document.body.style.overflowY = 'auto';
		}}
	>
		{loading && (
			<div className="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		)}
	</Wrapper>
);

const Wrapper = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.15);
	z-index: 500;
	display: flex;
	align-items: center;
	justify-content: center;

	.lds-ring {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-ring div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 64px;
		height: 64px;
		margin: 8px;
		border: 8px solid #330867;
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #330867 transparent transparent transparent;
	}
	.lds-ring div:nth-child(1) {
		animation-delay: -0.45s;
	}
	.lds-ring div:nth-child(2) {
		animation-delay: -0.3s;
	}
	.lds-ring div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

export default Backdrop;
