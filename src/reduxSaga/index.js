import { handleActions } from 'redux-actions';

export const ActionTypes = {
	GET_HOME_INTRO_REQUEST: 'GET_HOME_INTRO_REQUEST',
	GET_HOME_INTRO_SUCCESS: 'GET_HOME_INTRO_SUCCESS',
	GET_HOME_INTRO_FAILURE: 'GET_HOME_INTRO_FAILURE',
	RESET_HOME_INTRO: 'RESET_HOME_INTRO',

	GET_ROOM_BY_ID_REQUEST: 'GET_ROOM_BY_ID_REQUEST',
	GET_ROOM_BY_ID_SUCCESS: 'GET_ROOM_BY_ID_SUCCESS',
	GET_ROOM_BY_ID_FAILURE: 'GET_ROOM_BY_ID_FAILURE',
	RESET_ROOM_INTRO: 'RESET_ROOM_INTRO',

	SET_RESERVE_VALUE: 'SET_RESERVE_VALUE',
	POST_RESERVE_INFO_REQUEST: 'POST_RESERVE_INFO_REQUEST',
	POST_RESERVE_INFO_SUCCESS: 'POST_RESERVE_INFO_SUCCESS',
	POST_RESERVE_INFO_FAILURE: 'POST_RESERVE_INFO_FAILURE',
};

//
//
//
export const initialState = {
	homePage: {},
	roomIntro: {},
	loading: false,
	error: null,
	//
	checkIn: '',
	checkOut: '',
};

export const actions = {
	resetHomeIntro: () => ({
		type: ActionTypes.RESET_HOME_INTRO,
	}),
	getHomeIntroRequest: () => ({
		type: ActionTypes.GET_HOME_INTRO_REQUEST,
	}),
	getHomeIntroSuccess: (data) => ({
		type: ActionTypes.GET_HOME_INTRO_SUCCESS,
		data,
	}),
	getHomeIntroFailure: (error) => ({
		type: ActionTypes.GET_HOME_INTRO_FAILURE,
		error,
	}),

	//
	//
	resetRoomIntro: () => ({
		type: ActionTypes.RESET_ROOM_INTRO,
	}),
	getRoomByIdRequest: (roomId) => ({
		type: ActionTypes.GET_ROOM_BY_ID_REQUEST,
		roomId,
	}),
	getRoomByIdSuccess: (data) => ({
		type: ActionTypes.GET_ROOM_BY_ID_SUCCESS,
		data,
	}),
	getRoomByIdFailure: (error) => ({
		type: ActionTypes.GET_ROOM_BY_ID_FAILURE,
		error,
	}),

	//

	setReserveValue: (mode = 'checkIn', date) => ({
		type: ActionTypes.SET_RESERVE_VALUE,
		mode,
		date,
	}),
	postReserveInfoRequest: (payload) => ({
		type: ActionTypes.POST_RESERVE_INFO_REQUEST,
		payload,
	}),
	postReserveInfoSuccess: () => ({
		type: ActionTypes.POST_RESERVE_INFO_SUCCESS,
	}),
	postReserveInfoFailure: (error) => ({
		type: ActionTypes.POST_RESERVE_INFO_FAILURE,
		error,
	}),
};

export default handleActions(
	{
		[ActionTypes.RESET_HOME_INTRO]: (state) => {
			return {
				...state,
				homePage: {},
			};
		},
		[ActionTypes.GET_HOME_INTRO_REQUEST]: (state) => {
			return {
				...state,
				loading: true,
			};
		},
		[ActionTypes.GET_HOME_INTRO_SUCCESS]: (state, { data }) => {
			return {
				...state,
				homePage: data,
				loading: false,
			};
		},
		[ActionTypes.GET_HOME_INTRO_FAILURE]: (state, { error }) => {
			return {
				...state,
				loading: false,
				error,
			};
		},

		//
		//
		[ActionTypes.RESET_ROOM_INTRO]: (state) => {
			return {
				...state,
				roomIntro: {},
				roomId: 0,
			};
		},
		[ActionTypes.GET_ROOM_BY_ID_REQUEST]: (state, { roomId }) => {
			return {
				...state,
				roomId: +roomId || 0,
				loading: true,
			};
		},
		[ActionTypes.GET_ROOM_BY_ID_SUCCESS]: (state, { data }) => {
			return {
				...state,
				roomIntro: data,
				loading: false,
			};
		},
		[ActionTypes.GET_ROOM_BY_ID_FAILURE]: (state, { error }) => {
			return {
				...state,
				loading: false,
				error,
			};
		},

		//
		[ActionTypes.SET_RESERVE_VALUE]: (state, { mode, date }) => {
			return {
				...state,
				[mode]: date,
			};
		},

		[ActionTypes.POST_RESERVE_INFO_REQUEST]: (state) => {
			return {
				...state,
				loading: true,
			};
		},
		[ActionTypes.POST_RESERVE_INFO_SUCCESS]: (state) => {
			return {
				...state,
				loading: false,
				checkIn: '',
				checkOut: '',
			};
		},
		[ActionTypes.POST_RESERVE_INFO_FAILURE]: (state, { error }) => {
			return {
				...state,
				loading: false,
				error,
			};
		},
	},

	initialState,
);
