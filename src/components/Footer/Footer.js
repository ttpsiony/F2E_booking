import React from 'react';
import styles from './styles.scss';

function Footer() {
	return (
		<div className={styles.footer}>
			<div className={styles.contact}>
				<i className="fas fa-phone-alt"></i>
				<span>02 - 12345678</span>
			</div>
			<div className={styles.contact}>
				<i className="fas fa-envelope"></i>
				<span>FANCY_MARBLE@test.com</span>
			</div>
			<div className={styles.contact}>
				<i className="fas fa-map-marker-alt"></i>
				<span>台北市找不到這區沒這條道路不知道幾號</span>
			</div>
			<span>
				<i className="fab fa-facebook-square"></i>
			</span>
			<span>
				<i className="fab fa-instagram-square"></i>
			</span>
		</div>
	);
}

export default Footer;
