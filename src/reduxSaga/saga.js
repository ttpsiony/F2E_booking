import { all, takeLatest, put, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { ActionTypes, actions } from 'reduxSaga';
import * as API from './api';

// TODO: error message 的 modal (如果想要的話)

function* watchGetHomeIntroRequest() {
	try {
		// call api
		const { data } = yield call(API.getHomeDataRequestAPI);

		//
		yield put(actions.getHomeIntroSuccess(data || {}));
		//
	} catch (error) {
		//
		console.log(error);
		yield put(actions.getHomeIntroFailure(error));
	}
}

function* watchGetRoomByIdRequest(action) {
	// TODO: push後，route 會換，但畫面沒有跳轉
	try {
		// call api
		const { data } = yield call(API.getRoomDataByIdRequestAPI, action.roomId);
		//
		yield put(actions.getRoomByIdSuccess(data));
	} catch (error) {
		//
		console.log(error);
		yield put(actions.getRoomByIdFailure(error));
		yield put(push('/'));
	}
}

function* watchPostReserveRequest(action) {
	try {
		const { roomId, ...rest } = action.payload;

		yield call(API.postReserveInfoAPI, roomId, rest);

		yield put(actions.postReserveInfoSuccess());
		yield put(actions.getRoomByIdRequest(roomId));
		//
	} catch (error) {
		//
		console.log(error);
		yield put(actions.postReserveInfoFailure());
	}
}

export default function* Saga() {
	yield all([
		takeLatest(ActionTypes.GET_HOME_INTRO_REQUEST, watchGetHomeIntroRequest),
		takeLatest(ActionTypes.GET_ROOM_BY_ID_REQUEST, watchGetRoomByIdRequest),
		takeLatest(ActionTypes.POST_RESERVE_INFO_REQUEST, watchPostReserveRequest),
	]);
}
