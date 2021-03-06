import { API } from '../../backend';

export const createCategory = (userId, token, category) => {
    return fetch(`${API}category/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    }).then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
}

export const getAllCategories = () => {
    return fetch(`${API}category`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
}

//products api's

export const createProduct = (userId, token, product) => {
    return fetch(`${API}product/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: product
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
};


export const getAllProducts = () => {
    return fetch(`${API}products`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
};


export const getProductInfo = (productId) => {
    return fetch(`${API}product/${productId}`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
}


export const updateProduct = (productId, userId, token, product) => {
    return fetch(`${API}product/${productId}/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(product)
    }).then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
}


export const deleteProduct = (productId, userId, token) => {
    return fetch(`${API}product/${productId}/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err,'error'));
};