// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {

    const token = localStorage.getItem('token'); // Check if token exists

    // If no token is found, redirect to the register page
    if (token) {
        return <Navigate to="/dashboard" />;
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Use the navigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_API +'login', {
                email,
                password
            });
            // Store the token in local storage (assuming token is returned by backend)
            localStorage.setItem('token', response.data.token);
            setSuccess('Login successful! Redirecting to profile...');

            // Redirect to profile page after successful login
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <React.Fragment>
            <section style={{height:`100vh`}}>
                <div class="container h-100">
                    <div class="row justify-content-center align-items-center h-100">
                        <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                            <div class="card shadow-lg">
                                <div class="card-body p-5">
                                    <h1 class="fs-4 card-title fw-bold mb-3">Login</h1>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-3">
                                            <label>Email<span style={{ color: `red` }}>*</span></label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className='form-control'
                                                placeholder="Email"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Password<span style={{ color: `red` }}>*</span></label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className='form-control'
                                                placeholder="Password"
                                                required
                                            />
                                        </div>
                                        {success && <p style={{ color: 'green' }}>{success}</p>}
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        <div className="form-group mb-3">
                                            <div className="d-grid gap-2">
                                                <button className='btn btn-primary' type="submit">Login</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="text-center mt-5 text-muted">
                                Copyright &copy; 2017-2021 &mdash; Your Company
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Login;
