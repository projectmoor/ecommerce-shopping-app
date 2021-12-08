import axios from '../helpers/axios'
import { categoryConstants } from './constants'

export const getAllCategory = () => {
    return async dispatch => {
        // start request
        dispatch({
            type: categoryConstants.GET_ALL_CATEGORIES_REQUEST
        })
        const res = await axios.get(`/category/getcategory`)

        if(res.status === 200){
            // request success
            const { categoryList } = res.data
            dispatch({
                type: categoryConstants.GET_ALL_CATEGORIES_SUCCESS,
                payload: {categories: categoryList}
            })
        } else {
            // request failure
            dispatch({
                type: categoryConstants.GET_ALL_CATEGORIES_FAILURE,
                payload: { error: res.data.message }
            })
        }
    }
}
