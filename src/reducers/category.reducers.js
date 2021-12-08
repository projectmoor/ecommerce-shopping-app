import { categoryConstants } from "../actions/constants"

const initState = {
    categories: [],
    loading: false,
    error: null
}

const buildNewCategories = (parentId, categories, category) => {
    let myCategoreis = []

    if(parentId === undefined) {
        return [
            ...categories,
            {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                type: category.type,
                children: [],
            }
        ]
    }

    for(let cat of categories){
        if(cat._id === parentId) {
            myCategoreis.push({
                ...cat,
                children: cat.children ? buildNewCategories(parentId, [...cat.children, {
                    _id: category._id,
                    name: category.name,
                    slug: category.slug,
                    type: category.type,
                    parentId: category.parentId,
                    children: category.children
                }], category) : []
            })
        } else {
            myCategoreis.push({
                ...cat,
                children: cat.children ? buildNewCategories(parentId, cat.children, category) : []
            })
        }
        
    }
    return myCategoreis
}

export default (state = initState, action) => {
    switch(action.type){
        case categoryConstants.GET_ALL_CATEGORIES_SUCCESS:
            state = {
                ...state,
                categories: action.payload.categories
            }
            break
        case categoryConstants.ADD_NEW_CATEGORY_REQUEST:
            state = {
                ...state,
                loading: true
            }
            break
        case categoryConstants.ADD_NEW_CATEGORY_SUCCESS:
            const category = action.payload.category;
            const updatedCategories =  buildNewCategories(category.parentId, state.categories, category)
            // console.log(updatedCategories)
            state = {
                ...state,
                loading: false,
                categories: updatedCategories
            }
            break
        case categoryConstants.ADD_NEW_CATEGORY_FAILURE:
            state = {
                ...initState
            }
            break
    }

    return state;
}