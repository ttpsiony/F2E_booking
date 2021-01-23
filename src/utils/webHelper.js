export function isMobileDevice() {
	return (
		typeof navigator !== 'undefined' &&
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
			navigator.userAgent,
		)
	);
}

export const cloneDeep = (item) => {
	if (item === null || item === undefined || Number.isNaN(item)) return null;
	if (typeof item !== 'object') return item;

	let newItem = item instanceof Array ? [] : {};
	Object.keys(item).forEach((i) => {
		newItem[i] = typeof item[i] === 'object' ? cloneDeep(item[i]) : item[i];
	});

	return newItem;
};

export const calcCalendar = (
	calcYear = new Date().getFullYear(),
	calcMonth = new Date().getMonth(),
) => {
	const eachMonthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	const monthFirstDay = new Date(`${calcYear}/${calcMonth + 1}/01`).getDay();
	if (calcYear % 400 === 0 || (calcYear % 4 === 0 && calcYear % 100 !== 0)) {
		eachMonthDay[1] = 29;
	}
	const currentMonthDay = eachMonthDay[calcMonth];
	const remainderDay = 7 - ((monthFirstDay + currentMonthDay) % 7 || 7);
	const loopTime = monthFirstDay + currentMonthDay + remainderDay;

	const renderMonthArr = [];
	let week = -1;
	for (let i = 0; i < loopTime; i += 1) {
		if (i % 7 === 0) {
			week += 1;
			renderMonthArr[week] = [];
		}
		if (i < monthFirstDay || i >= loopTime - remainderDay) {
			renderMonthArr[week].push(null);
		} else {
			renderMonthArr[week].push(i + 1 - monthFirstDay);
		}
	}

	return renderMonthArr;
};

export const formateDate = (date) => {
	if (date === undefined || date === null || date === '') return null;

	const timestamp = new Date(date);
	if (timestamp.toString() === 'Invalid Date') return null;

	const year = timestamp.getFullYear();
	const month = timestamp.getMonth() + 1;
	const day = timestamp.getDate();

	return `${year}年${month}月${day}日`;
};

export const diffTwoDate = (date1, date2) => {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;

	const timestamp1 = new Date(date1);
	const timestamp2 = new Date(date2);
	const isValid =
		timestamp1.toString() === 'Invalid Date' || timestamp2.toString() === 'Invalid Date';
	if (isValid) return null;

	return Math.floor(Math.abs(timestamp2 - timestamp1) / MS_PER_DAY);
};

export const summaryDay = (checkInDate, checkOutDate) => {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;
	const diff = diffTwoDate(checkInDate, checkOutDate);
	if (!diff) return { weekdayCount: 0, weekendCount: 0 };
	const startTimestamp = new Date(checkInDate).getTime();
	let weekdayCount = 0;
	let weekendCount = 0;
	Array.from({ length: diff }).forEach((_, idx) => {
		const day = new Date(startTimestamp + idx * MS_PER_DAY).getDay();
		if (day === 0 || day === 5 || day === 6) {
			// 星期五、六、日
			weekendCount += 1;
		} else {
			weekdayCount += 1;
		}
	});

	return {
		weekdayCount,
		weekendCount,
	};
};

export const isValidDate = (dateStr = '') => {
	if (dateStr === undefined || dateStr === null || dateStr === '') return false;

	const timestamp = new Date(dateStr);
	if (timestamp.toString() === 'Invalid Date') return false;

	return true;
};

export default {
	isMobileDevice,
	cloneDeep,
	calcCalendar,
	formateDate,
	diffTwoDate,
	summaryDay,
	isValidDate,
};
