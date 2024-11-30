import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailPattern.test(email);
        setIsValidEmail(isValid);
        setEmailError(isValid ? '' : 'Please enter a valid email address.');
    };

    const validatePassword = (password) => {
        const isValid = password.length >= 4; // Minimum 4 characters
        setIsValidPassword(isValid);
        setPasswordError(
            isValid ? '' : 'Password must be at least 4 characters long.'
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate email and password before submitting
        validateEmail(email);
        validatePassword(password);

        if (!isValidEmail || !isValidPassword) return;

        setIsSubmitting(true); // Disable the button and show spinner

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_API + 'login', {
                email,
                password,
            });

            // Store the token in local storage (assuming token is returned by backend)
            localStorage.setItem('token', response?.data?.token);
            localStorage.setItem('userData', JSON.stringify(response?.data));

            setSuccess('Login successful! Redirecting to profile...');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsSubmitting(false); // Re-enable the button after submission
        }
    };

    const isButtonDisabled = !email || !password || isSubmitting;

    return (
        <React.Fragment>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <section style={{ height: `100vh` }}>
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                            <div className="card shadow-lg">
                                <div className="card-body p-5">
                                    <h1 className="fs-4 card-title fw-bold mb-3">Login</h1>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-3">
                                            <label>Email <span style={{ color: `red` }}>*</span></label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    validateEmail(e.target.value);
                                                }}
                                                className={`form-control ${
                                                    isValidEmail ? '' : 'is-invalid'
                                                }`}
                                                placeholder="Email"
                                                required
                                            />
                                            {!isValidEmail && (
                                                <small className="text-danger">{emailError}</small>
                                            )}
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Password <span style={{ color: `red` }}>*</span></label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    validatePassword(e.target.value);
                                                }}
                                                className={`form-control ${
                                                    isValidPassword ? '' : 'is-invalid'
                                                }`}
                                                placeholder="Password"
                                                required
                                            />
                                            {!isValidPassword && (
                                                <small className="text-danger">{passwordError}</small>
                                            )}
                                        </div>
                                        {success && <p style={{ color: 'green' }}>{success}</p>}
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        <div className="form-group mb-3">
                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    type="submit"
                                                    disabled={isButtonDisabled}
                                                >
                                                    {isSubmitting ? (
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                    ) : (
                                                        'Login'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Login;
