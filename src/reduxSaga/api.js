export const getHomeDataRequestAPI = () =>
	fetch('http://localhost:5000/home', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((result) => {
			if (result.error) {
				throw Promise.reject(result);
			}
			return result;
		})
		.catch((error) => error);

export const getRoomDataByIdRequestAPI = (id) =>
	fetch(`http://localhost:5000/room/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((result) => {
			if (result.error) {
				throw Promise.reject(result);
			}
			return result;
		})
		.catch((error) => error);

export const postReserveInfoAPI = (id, data) =>
	fetch(`http://localhost:5000/room/${id}/reservation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.then((result) => {
			if (result.error) {
				throw Promise.reject(result);
			}
			return result;
		})
		.catch((error) => error);

//
//
//
export default {
	getHomeDataRequestAPI,
	getRoomDataByIdRequestAPI,
	postReserveInfoAPI,
};
