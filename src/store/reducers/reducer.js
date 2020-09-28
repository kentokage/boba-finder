import * as actionTypes from '../actions/actionTypes';

const initialState = {
	user: {}
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return { ...state, user: { email: action.email, password: action.password }}
		case actionTypes.AUTH_SUCCESS:
			console.log(state.user);
			return { ...state,
				user: {
					...state.user, ...action.authData
				}
			}
		default:
			return state;
	}
}

export default reducer; 