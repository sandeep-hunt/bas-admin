import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Helmet } from 'react-helmet';

const Events = () => {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        event_name: '',
        event_slug: '',
        event_image: '',
        event_thumbnail: '', // Added thumbnail image field
        event_price: '',
        event_date: '',
        event_time: '',
        event_location: '',
        event_status: 1,
        event_booking_count:0,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null); // Added thumbnail preview
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [editTempData,setEditTempData]= useState(null);
    const [editButtonDisable,setEditButtonDisabled]= useState(true);


    console.log("formData",formData)
    console.log("editTempData",editTempData)


    useEffect(() => {
        fetchEvents();
    }, [currentPage, limit]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'events',);
            setEvents(response.data.items);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEditMode(false);
        setFormData({ event_name: '', event_slug: '', event_image: '', event_thumbnail: '', event_price: '', event_date: '', event_time: '', event_location: '', event_status: 1 });
        setImagePreview(null);
        setThumbnailPreview(null); // Clear thumbnail preview
    };

    // Function to generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()                   // Convert to lowercase
            .replace(/ /g, '-')               // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');         // Remove all non-word characters except hyphens
    };

    const handleFormChange = (e) => {
        setEditButtonDisabled(false);
        const { name, value } = e.target;
        if (name === 'event_name') {
            const slug = generateSlug(value);  // Generate slug when title changes
            setFormData({ ...formData, event_name: value, event_slug: slug });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setEditButtonDisabled(false);
        const file = e.target.files[0];
        setFormData({ ...formData, event_image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    // Handle thumbnail image change
    const handleThumbnailChange = (e) => {
        setEditButtonDisabled(false);
        const file = e.target.files[0];
        setFormData({ ...formData, event_thumbnail: file });
        setThumbnailPreview(URL.createObjectURL(file));
    };

    // Handle add or edit event
    const handleAddOrEditEvent = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => formDataObj.append(key, formData[key]));

        try {
            if (editMode) {
                if( formData?.event_name === editTempData?.event_name &&  
                    formData?.event_slug === editTempData?.event_slug &&
                    formData?.event_image === editTempData?.event_image && 
                    formData?.event_thumbnail === editTempData?.event_thumbnail &&
                    formData?.event_price === editTempData?.event_price &&
                    formData?.event_date  === editTempData?.event_date &&
                    formData?.event_time  === editTempData?.event_time &&
                    formData?.event_location  === editTempData?.event_location &&
                    formData?.event_status === editTempData?.event_status ){
                    alert("No new date to update.");
                    setEditButtonDisabled(true)
                    return false
                }
                await axios.put(import.meta.env.VITE_BACKEND_API + `events/update/${currentEventId}`, formDataObj);
            } else {
                await axios.post(import.meta.env.VITE_BACKEND_API + 'events/add/', formDataObj);
            }
            fetchEvents();
            handleClose();
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || "An error occurred while processing your request.";
                alert(errorMessage);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleEdit = (event) => {
        setFormData({
            event_name: event.event_name,
            event_slug: event.event_slug,
            event_image: event.event_image,
            event_thumbnail: event.event_thumbnail, // Edit thumbnail field
            event_price: event.event_price,
            event_date: formatDate(event.event_date),
            event_time: event.event_time,
            event_location: event.event_location,
            event_status: event.event_status,
            event_booking_count:event?.event_booking_count
        });
        setEditTempData({
            event_name: event?.event_name,
            event_slug: event?.event_slug,
            event_image: event?.event_image,
            event_thumbnail: event?.event_thumbnail,
            event_price: event?.event_price,
            event_date:formatDate(event.event_date),
            event_time: event?.event_time,
            event_location: event?.event_location,
            event_status: event?.event_status,
        })
        setCurrentEventId(event.event_id);
        const new_imgPrev = import.meta.env.VITE_BACKEND_API + event.event_image;
        const new_thumbPrev = import.meta.env.VITE_BACKEND_API + event.event_thumbnail; // Set thumbnail preview
        setImagePreview(new_imgPrev);
        setThumbnailPreview(new_thumbPrev); // Set thumbnail preview
        setEditMode(true);
        handleShow();
    };

    // Handle delete event
    const handleDelete = async (eventId) => {
        try {
            await axios.delete(import.meta.env.VITE_BACKEND_API + `events/delete/${eventId}`);
            fetchEvents(); // Fetch updated events after deletion
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];  // "YYYY-MM-DD" format
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Events List</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4>Events List</h4>
                        <Breadcrumbs pageName="events" />
                    </div>
                    <div className="mt-3 d-flex justify-content-between mb-3">
                        <Button variant="primary" onClick={handleShow}>Add Event</Button>
                    </div>
                    <Row className="g-4">
                        {loading ? (
                            Array(limit).fill(0).map((_, idx) => (
                                <Col key={idx} sm={12} md={3}>
                                    <Card>
                                        <Skeleton height={200} />
                                        <Card.Body>
                                            <Skeleton height={30} />
                                            <Skeleton height={30} />
                                            <Skeleton height={30} />
                                            <Skeleton height={30} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            events.map(event => (
                                <Col key={event.event_id} sm={12} md={3}>
                                    <Card>
                                        <Card.Img variant="top" src={import.meta.env.VITE_BACKEND_API+event.event_image} />
                                        <Card.Body>
                                            <Card.Title>
                                                <h5>{event.event_name}</h5>
                                                <h6>{event.event_location}</h6>
                                                <h6>{formatDate(event.event_date)}</h6>
                                                <h6>{event.event_time}</h6>
                                                <h6>&#8377; {event.event_price}</h6>
                                                <h6>{event.event_status == '1' ? 'active' : 'finished'}</h6>
                                                <h6 className='my-2 text-sm'>Event Booking Status {event?.event_booking_count}</h6>
                                                { 
                                                
                                                parseInt(event.event_status) === 1 &&
                                                
                                                <Row>
                                                    <Col sm={12} md={6}>
                                                        <Button variant="primary btn-sm" onClick={() => handleEdit(event)}>Edit</Button>
                                                    </Col>
                                                   {event?.event_booking_count  === 0 && <Col sm={12} md={6}>
                                                        <Button variant="outline-danger btn-sm" onClick={() => handleDelete(event.event_id)}>Delete</Button>
                                                    </Col>}
                                                </Row>}
                                            </Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                        <div className="pagination">
                            {/* Render page numbers */}
                            <button
                                className="page-btn"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={currentPage === page ? 'active' : ''}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                className="page-btn"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </Row>
                </div>

                {/* Modal for Add/Edit Event */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? 'Edit Event' : 'Add Event'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddOrEditEvent}>
                            <Form.Group className="mb-3">
                                <Form.Label>Event Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="event_name"
                                    value={formData.event_name}
                                    onChange={handleFormChange}
                                    placeholder="Event Name"
                                    required
                                    disabled={editMode ?  formData?.event_booking_count !== 0 &&  true : false}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Event Slug</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="event_slug"
                                    value={formData.event_slug}
                                    onChange={handleFormChange}
                                    placeholder="Event Slug"
                                    required
                                    disabled={editMode ?  formData?.event_booking_count !== 0 &&  true : false}
                                />
                            </Form.Group>
                            <Row>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Image</Form.Label>
                                        <Form.Control type="file" name="event_image" onChange={handleFileChange}
                                         disabled={editMode ?  formData?.event_booking_count !== 0 && true : false}
                                        />
                                        {/* Image preview */}
                                        {imagePreview && (
                                            <img src={imagePreview} alt="preview" style={{ marginTop: '10px', width: '100%', height: 'auto' }} />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Thumbnail</Form.Label>
                                        <Form.Control type="file" name="event_thumbnail" onChange={handleThumbnailChange}
                                        disabled={editMode ?  formData?.event_booking_count !== 0 && true : false}
                                        />
                                        {/* Thumbnail preview */}
                                        {thumbnailPreview && (
                                            <img src={thumbnailPreview} alt="thumbnail preview" style={{ marginTop: '10px', width: '100%', height: 'auto' }} />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Price</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="event_price"
                                            value={formData.event_price}
                                            onChange={handleFormChange}
                                            placeholder="Event Price"
                                            required
                                            disabled={editMode ?  formData?.event_booking_count !== 0 && true : false}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="event_date"
                                            value={formData.event_date}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="event_time"
                                            value={formData.event_time}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </Form.Group>
                                    {/* {formData.event_time} */}
                                </Col>
                                <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="event_location"
                                            value={formData.event_location}
                                            onChange={handleFormChange}
                                            placeholder="Event Location"
                                            required
                                            disabled={editMode ?  formData?.event_booking_count !== 0 && true : false}
                                        />
                                    </Form.Group>
                                </Col>
                                { editMode &&  <Col sm={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="event_status"
                                            value={formData.event_status}
                                            onChange={handleFormChange}
                                        >  
                                            <option value="1">Active</option>
                                            <option value="0">Finished</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>}
                            </Row>
                            <Button type="submit" variant="primary"
                                disabled={editMode ? editButtonDisable : false}
                            >
                                {editMode ? 'Update Event' : 'Add Event'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </React.Fragment>
    );
};

export default Events;
