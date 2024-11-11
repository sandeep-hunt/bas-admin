import React from 'react'
import Header from '../components/Header'
import Container from 'react-bootstrap/esm/Container'
import Breadcrumbs from '../components/Breadcrumbs'
import { Col, Form, Row, Card, Accordion } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

const EditMember = () => {
    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Edit Member</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <h4>Personal Details</h4>
                                            <Row>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>First Name<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="First Name" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Last Name<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="Last Name" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="email" placeholder="Email" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Mobile<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="Mobile" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Age<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="Age" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <label className='mb-3'>Gender<span style={{color: `red`}}>*</span></label>
                                                    <Form.Group className='mb-3'>
                                                        <Form.Check
                                                            inline
                                                            label="Male"
                                                            name="gender"
                                                            value="Male"
                                                            type="radio"
                                                            id="inline-radio-1"
                                                        />
                                                        <Form.Check
                                                            inline
                                                            label="Female"
                                                            name="gender"
                                                            value="Female"
                                                            type="radio"
                                                            id="inline-radio-1"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <label className='mb-3'>Member Type<span style={{color: `red`}}>*</span></label>
                                                    <Form.Group className='mb-3'>
                                                        <Form.Check
                                                            inline
                                                            label="Volunteer"
                                                            name="member_type"
                                                            value="Volunteer"
                                                            type="radio"
                                                            id="inline-radio-1"
                                                        />
                                                        <Form.Check
                                                            inline
                                                            label="Volunteer"
                                                            name="member_type"
                                                            value="Volunteer"
                                                            type="radio"
                                                            id="inline-radio-1"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <h4>Contact Details</h4>
                                            <Row>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>State<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="State" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>City<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="City" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Address<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="Address" />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Pincode<span style={{color: `red`}}>*</span></Form.Label>
                                                        <Form.Control type="text" placeholder="Pincode" />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12}>
                                            <Button>Update Member</Button>
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