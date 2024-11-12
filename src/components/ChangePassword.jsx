import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ChangePassword() {

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
});

  const [formData, setFormData] = useState({
    id:'',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (userData) {
        setFormData({
            id: userData.user_id,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    }
}, [userData]);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTogglePassword = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.href = '/';
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New Password and Confirm Password do not match');
      return;
    }
    const { confirmPassword, ...dataToSend } = formData;
  
    const token = localStorage.getItem('token');
        
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API}change-password`, 
            dataToSend, 
            {
                headers: { 
                    Authorization: token,
                }
            }
        );
        alert(response?.data?.message || 'Password changed successfully');
        if( response?.data?.message === 'Password changed successfully'){
          handleLogout()

        }
    } catch (error) {
      
        const errorMessage = error.response?.data?.message 
            || error.response?.data?.error 
            || 'An unexpected error occurred';
        alert(errorMessage);
        
    }
  };
  

  return (
    <Container>
      <div className="bg-white border border-gray-500 w-full p-4 rounded shadow">
        <div className="text-lg font-semibold leading-5 mb-4">Change Password</div>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit} className='max-w-[400px]'>
              <Row>
                <Col sm={12}>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>
                      Old Password<span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        type={showPassword.oldPassword ? 'text' : 'password'}
                        placeholder="Old Password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required
                      />
                      <span
                        onClick={() => handleTogglePassword('oldPassword')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: '#888'
                        }}
                      >
                        {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>
                      New Password<span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        type={showPassword.newPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                      <span
                        onClick={() => handleTogglePassword('newPassword')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: '#888'
                        }}
                      >
                        {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>
                      Confirm Password<span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        type={showPassword.confirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <span
                        onClick={() => handleTogglePassword('confirmPassword')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: '#888'
                        }}
                      >
                        {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Button type="submit">Update Password</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
