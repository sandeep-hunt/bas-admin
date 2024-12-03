import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Container from 'react-bootstrap/esm/Container'
import Breadcrumbs from '../components/Breadcrumbs'
import { Col, Form, Row, Card, Accordion } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const EditMember = () => {
    const { member_id } = useParams();
    const navigator = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        age: '',
        gender: '',
        member_type: '',
        state: '',
        city: '',
        address: '',
        pincode: '',
        aadhaarFile: "",
        panFile: "",
        resumeFile: ""
    });

    console.log("formData", formData)

    const [images, setImages] = useState(
        {
            aadhaarFile: "",
            panFile: "",
            resumeFile: ""
        })

    const [error, setError] = useState('');  // State to store error message

    useEffect(() => {
        // Make sure the URL is correct
        const token = localStorage.getItem('token');

        axios.get(import.meta.env.VITE_BACKEND_API + `members/${member_id}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                const nameParts = response.data.name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts[1] : '';
                setFormData({
                    firstName: firstName,
                    lastName: lastName,
                    email: response.data.email,
                    mobile: response.data.mobile,
                    age: response.data.age,
                    gender: response.data.gender,
                    member_type: response.data.member_type,
                    state: response.data.state,
                    city: response.data.city,
                    address: response.data.address,
                    pincode: response.data.pincode,
                    aadhaarFile: "",
                    panFile: "",
                    resumeFile: ""
                });

                setImages({
                    aadhaarFile: response.data.aadhaarFilePath,
                    panFile: response.data.panFilePath,
                    resumeFile: response.data.resumeFilePath
                })
            })

            .catch(error => {
                setError('Failed to fetch member data');
            });
    }, [member_id]); // Ensure the effect runs when `member_id` changes


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;

        const file = e.target.files[0];

        setFormData({ ...formData, [name]: file });
        if (name === "aadhaarFile") {
            setImages({ ...images, [name]: "" })
        }
        if (name === "panFile") {
            setImages({ ...images, [name]: "" })
        }
        if (name === "resumeFile") {
            setImages({ ...images, [name]: "" })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullName = formData.firstName + ' ' + formData.lastName;
        const dataToSubmit = {
            ...formData,
            name: fullName,
        };
        delete dataToSubmit.firstName;
        delete dataToSubmit.lastName;

        const formDataObj = new FormData();
        Object.keys(dataToSubmit).forEach(key => formDataObj.append(key, dataToSubmit[key]));

        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(import.meta.env.VITE_BACKEND_API + `members/update-member/${member_id}`, formDataObj, {
                headers: { Authorization: token }
            });

            navigator(`/members`)

        } catch (error) {
            if (error.response) {

                alert(error.response.data.error);
            } else if (error.request) {
                alert("No response from the server. Please try again later.");
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    };
    return (
        <React.Fragment>
            <Helmet>
                <title>Edit Member</title>
            </Helmet>
            <Header />
            <Container>
                {error?.length > 0 && <div>{error}</div>}
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Edit Member</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs pageName="members" pageName1="Edit Member" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <h4>Personal Details</h4>
                                            <Row>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>First Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="First Name"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Last Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Last Name"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Mobile<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Mobile"
                                                            name="mobile"
                                                            value={formData.mobile}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Age<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Age"
                                                            name="age"
                                                            value={formData.age}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Gender<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <div className="d-flex align-items-center">
                                                            <Form.Check
                                                                inline
                                                                label={<span className="cursor-pointer">Male</span>}
                                                                name="gender"
                                                                value="Male"
                                                                type="radio"
                                                                checked={formData.gender === "Male"}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <Form.Check
                                                                inline
                                                                label={<span className="cursor-pointer">Female</span>}
                                                                name="gender"
                                                                value="Female"
                                                                type="radio"
                                                                checked={formData.gender === "Female"}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3 flex flex-col">
                                                        <Form.Label>Member Type<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <div className="d-flex align-items-center">
                                                            <Form.Check
                                                                inline
                                                                type="radio"
                                                                name="member_type"
                                                                value="Volunteer"
                                                                checked={formData.member_type === "Volunteer"}
                                                                onChange={handleChange}
                                                                required
                                                                label={<span className="cursor-pointer">Volunteer</span>}
                                                            />
                                                            <Form.Check
                                                                inline
                                                                type="radio"
                                                                name="member_type"
                                                                value="Member"
                                                                checked={formData.member_type === "Member"}
                                                                onChange={handleChange}
                                                                required
                                                                label={<span className="cursor-pointer">Member</span>}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>



                                            </Row>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <h4>Contact Details</h4>
                                            <Row>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>State<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="State"
                                                            name="state"
                                                            value={formData.state}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>City<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="City"
                                                            name="city"
                                                            value={formData.city}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Address<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Address"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Pincode<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Pincode"
                                                            name="pincode"
                                                            value={formData.pincode}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <h4>documents</h4>
                                            <Row>
                                                <Col sm={12}>
                                                    <div className="mb-3">
                                                        <Form.Label>Aadhaar Card</Form.Label>
                                                        <div className=' flex items-center  gap-4'>
                                                            {images.aadhaarFile && (
                                                                true ? (
                                                                    <a
                                                                        href={`${import.meta.env.VITE_BACKEND_API}${images.aadhaarFile}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className='bg-orange-400 p-2 h-10 border rounded cursor-pointer text-sm text-[#FFFFFF] font-semibold'
                                                                    >
                                                                        View Aadhaar
                                                                    </a>
                                                                ) : (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_BACKEND_API}${formData.aadhaarFile}`}
                                                                        alt="Aadhaar"
                                                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                                                    />
                                                                )
                                                            )}
                                                            <div >
                                                                <Form.Group className=" ">
                                                                    <Form.Control type="file" name="aadhaarFile" onChange={handleFileChange}
                                                                        accept=".jpg, .jpeg, .png, .pdf"
                                                                    />
                                                                </Form.Group>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={12}>
                                                    <div className="mb-3">
                                                        <Form.Label>PAN Card</Form.Label>
                                                        <div className='flex  gap-12'>
                                                            {images.panFile && (
                                                                true ? (
                                                                    <a
                                                                        href={`${import.meta.env.VITE_BACKEND_API}${images.panFile}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className='bg-orange-400 p-2 border rounded cursor-pointer text-sm text-[#FFFFFF] font-semibold'
                                                                    >
                                                                        View PAN
                                                                    </a>
                                                                ) : (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_BACKEND_API}${formData.panFile}`}
                                                                        alt="PAN"
                                                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                                                    />
                                                                )
                                                            )}
                                                            <div >
                                                                <Form.Group className=" ">
                                                                    <Form.Control type="file" name="panFile" onChange={handleFileChange}
                                                                        accept=".jpg, .jpeg, .png, .pdf"
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col sm={12}>
                                                    <div className="mb-3">
                                                        <Form.Label>Resume</Form.Label>
                                                        <div className=' flex gap-4'>
                                                            {images.resumeFile && (
                                                                <a
                                                                    href={`${import.meta.env.VITE_BACKEND_API}${images.resumeFile}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className=' bg-orange-400 p-2 border rounded cursor-pointer text-sm text-[#FFFFFF] font-semibold'
                                                                >
                                                                    View Resume
                                                                </a>
                                                            )}
                                                            <div >
                                                                <Form.Group className=" ">
                                                                    <Form.Control type="file" name="resumeFile" onChange={handleFileChange}
                                                                        accept=".jpg, .jpeg, .png, .pdf"
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12}>
                                            <Button type="submit">Update Member</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default EditMember