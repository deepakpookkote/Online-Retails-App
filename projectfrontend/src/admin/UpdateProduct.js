import React, { useState, useEffect } from 'react';
import Base from '../core/Base'
import { Link } from 'react-router-dom';
import { getAllCategories, updateProduct, getProductInfo } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';

const UpdateProduct = ({ match }) => {

    const { user, token } = isAuthenticated();

    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getRedirect: false,
        formData: ""
    })

    const { name, price, description, stock, categories, category, loading, error, createdProduct, getRedirect, formData } = values;

    const preLoad = (productId) => {
        getProductInfo(productId).then(data => {
            if (data && data.error) {
                setValues({
                    ...values, error: data.error
                })
            } else {
                preloadCategories();
                setValues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    stock: data.stock,
                    formData: new FormData()
                })
                console.log(formData);
            }
        })
    }

    const preloadCategories = () => {
        getAllCategories().then(data => {
            if (data && data.error) {
                setValues({
                    ...values, error: data.error
                })
            } else {
                setValues({
                    categories: data.categoryList,
                    formData: new FormData()
                })
                console.log(data.categoryList, 'TEST');
            }
        })
    }

    useEffect(() => {
        preLoad(match.params.productId);
    }, [])

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({
            ...values,
            error: "",
            loading: true
        })
        console.log(formData);
        updateProduct(match.params.productId, user._id, token, formData).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error
                })
            } else {
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    photo: "",
                    stock: "",
                    loading: false,
                    createdProduct: data.name
                })
            }
        }).catch(error => {

        })
    }

    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({
            ...values,
            [name]: value
        });
    }

    const successMessage = () => {
        return (
            <div className="alert alert-success mat-3" style={{ display: createdProduct ? "" : "none" }}>
                <h2>{createdProduct} updated successfully!</h2>
            </div>
        )
    }

    const warningMessage = () => {
        return (
            <div className="alert alert-warning mat-3" style={{ display: error ? "" : "none" }}>
                <h2>{error} update Failed!</h2>
            </div>
        )
    }

    const updateProductForm = () => (
        <form >
            <span>Post photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    name="photo"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories && categories.map((cate, index) => {
                        return (
                            <option key={index} value={cate._id}>{cate.name}</option>
                        )
                    })}
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    value={stock}
                />
            </div>

            <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
                Update Product
          </button>
        </form>
    );
    return (
        <Base
            className="container bg-info p-4"
            title="Update a product here!!"
            description="Product Updating section">
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {updateProductForm()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateProduct;
