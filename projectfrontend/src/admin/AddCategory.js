import React, { useState } from 'react'
import Base from '../core/Base';
import { isAuthenticated } from '../auth/helper';
import { Link } from 'react-router-dom';
import { createCategory } from './helper/adminapicall';




const { user, token } = isAuthenticated();

const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const successMessage = () => {
        if(success) {
            return <h4 className="text-success">Category created successfully</h4>
        }
    }

    const warningMessage = () => {
        if(error) {
            return <h4 className="text-warning">Failed to create Category</h4>
        }
    }

    const myCategoryForm = () => {
        return (
            <form>
                <div className="form-group">
                    <p className="lead">Enter the category</p>
                    <input
                        type="text"
                        className="form-control my-3"
                        onChange={handleChange}
                        value={name}
                        autoFocus
                        placeholder="For Ex. Summer"></input>
                    <button onClick={onSubmit} className="btn btn-outline-info">Create category</button>
                </div>
            </form>
        )
    }
    const goBack = () => {
        return (
            <div className="mt-5">
                <Link className="btn btn btn-success mb-3" to="/admin/dashboard">Back to Home</Link>
            </div>
        )
    }

    const handleChange = (event) => {
        setError("");
        setName(event.target.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess(false);
        createCategory(user._id, token, { name })
            .then(data => {
                if (data.error) {
                    setError(true)
                } else {
                    setError("");
                    setSuccess(true);
                    setName("");
                }
            })
            .catch(error => console.log(error,'test'));
    }
    return (
        <Base title="create new category" description="Add a new category for new t-shirts" className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()} {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory;
