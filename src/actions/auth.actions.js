import axios from '../helpers/axios'
import { authConstants, cartConstants } from './constants'

export const signup = (user) => {
    return async (dispatch) => {
        try {
            dispatch({ type: authConstants.SIGNUP_REQUEST});
            const res = await axios.post('/signup', user);
            if(res.status === 201){
                dispatch({ type: authConstants.SIGNUP_SUCCESS });
                const {token, user} = res.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                dispatch({
                    type: authConstants.LOGIN_SUCCESS,
                    payload: {
                        token,
                        user,
                    }
                });
            } else {
                dispatch({ type: authConstants.SIGNUP_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
        
        
    }
}

export const login = (user) => {

	return async (dispatch) => { // applyMiddleware(thunk) makes this dispatch available
        // trigger LOGIN_REQUEST action to update state
        dispatch({ type: authConstants.LOGIN_REQUEST })
        const res = await axios.post(`/signin`, { // the actual login request
            ...user
        })

        if(res.status === 200){
            // if login success
            const { token, user } = res.data
            localStorage.setItem('token', token) // store token
            localStorage.setItem('user', JSON.stringify(user)) // store user
            // trigger LOGIN_SUCESS action to update state
            dispatch({ 
                type: authConstants.LOGIN_SUCCESS,
                payload: {
                    token,
                    user
                } 
            })
        } else {
            // if login fail
            if(res.status === 400) {
                // trigger LOGIN_FAILURE action to update state
                dispatch({ 
                    type: authConstants.LOGIN_FAILURE, 
                    payload: { error: res.data.message }
                })
            }
        }
		
	}
}

export const isUserLoggedIn = () => {
    return async dispatch => {
        const token = localStorage.getItem('token')
        // 通过localStorage里的token信息，来更新state里的登入状态
        if(token){
            const user = JSON.parse(localStorage.getItem('user'))
            dispatch({ 
                type: authConstants.LOGIN_SUCCESS,
                payload: {
                    token,
                    user
                } 
            })
        } else {
            dispatch({ 
                type: authConstants.LOGIN_FAILURE, 
                payload: { error: 'Failed to login' }
            })
        }
    }
}

export const signout = () => {
    return async dispatch => {
        // start logout 
        dispatch({
            type: authConstants.LOGOUT_REQUEST
        })
        const res = await axios.post(`/signout`)
        if (res.status === 200) {
            localStorage.clear()
            // logout success
            dispatch({
                type: authConstants.LOGOUT_SUCCESS
            });
            dispatch({ type: cartConstants.RESET_CART });
        } else {
            dispatch({
                type: authConstants.LOGOUT_FAILURE,
                payload: { error: res.data.error }
            })
        }
    }
        
}