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
import Skeleton from 'react-loading-skeleton';  // Skeleton loading
import 'react-loading-skeleton/dist/skeleton.css';  // Skeleton styles


const Gallery = () => {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);  // Track if editing an image
    const [currentImage, setCurrentImage] = useState(null);  // Image being edited
    const [newImage, setNewImage] = useState(null); // Uploaded image file
    const [newTitle, setNewTitle] = useState('');  // Image title
    const [imagePreview, setImagePreview] = useState('');  // Image preview URL

    const handleClose = () => {
        setShow(false);
        setEditMode(false);
        setCurrentImage(null);
        setNewImage(null);
        setNewTitle('');
        setImagePreview('');
    };
    const handleShow = () => setShow(true);

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for skeleton
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(12);  // Number of items per page

    // Fetch paginated items when the component mounts or page changes
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                setLoading(true);  // Start loading
                const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'gallery', {
                    params: {
                        page: currentPage,
                        limit: limit
                    }
                });
                setImages(response.data.items);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setLoading(false);  // Stop loading after fetch
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);  // Stop loading even if there is an error
            }
        };

        fetchData();
    }, [currentPage, limit]);

    // Function to change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle "Previous" and "Next" buttons
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle Delete Image
    const handleDelete = async (imageId) => {
        try {
            await axios.delete(import.meta.env.VITE_BACKEND_API + `gallery/delete/${imageId}`);
            setImages(images.filter(image => image.gallery_id !== imageId));  // Update state
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    // Handle Edit Image
    const handleEdit = (image) => {
        setEditMode(true);
        setCurrentImage(image);
        setNewTitle(image.gallery_image_name);  // Set the current title
        const new_imgPrev = import.meta.env.VITE_BACKEND_API + image.gallery_imagePath;
        setImagePreview(new_imgPrev);  // Show existing image in the preview
        handleShow();  // Show modal
    };

    // Handle Save Changes (Update Image)
    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append('title', newTitle);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            await axios.put(import.meta.env.VITE_BACKEND_API + `gallery/update/${currentImage.gallery_id}`, formData);
            setShow(false);
            setEditMode(false);
            setNewImage(null);
            setNewTitle('');
            setCurrentImage(null);
            setImagePreview('');
            // Fetch updated images
            const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'gallery', {
                params: {
                    page: currentPage,
                    limit: limit
                }
            });
            setImages(response.data.items);
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    // Handle Add New Image
    const handleAddImage = async () => {
        const formData = new FormData();
        formData.append('title', newTitle);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            await axios.post(import.meta.env.VITE_BACKEND_API + 'gallery/add', formData);
            setShow(false);
            setNewImage(null);
            setNewTitle('');
            setImagePreview('');
            // Fetch updated images
            const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'gallery', {
                params: {
                    page: currentPage,
                    limit: limit
                }
            });
            setImages(response.data.items);
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    // Handle Image Upload and Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview('');
        }
    };

    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Blogs List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between mb-3">
                            <Button variant="primary" onClick={handleShow}>Add Image</Button>
                        </div>
                    </div>
                    <Row className="g-4">
                        {loading ? (
                            // Display skeleton loading while fetching images
                            Array(limit).fill(0).map((_, idx) => (
                                <Col key={idx} sm={12} md={3}>
                                    <Card>
                                        <Skeleton height={200} />
                                        <Card.Body>
                                            <Skeleton height={30} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            images.map(image => (
                                <Col key={image.gallery_id} sm={12} md={3}>
                                    <Card>
                                        <Card.Img variant="top" src={import.meta.env.VITE_BACKEND_API + image.gallery_imagePath} alt={`Image ${image.gallery_id}`} />
                                        <Card.Body>
                                            <Card.Title>{image.gallery_image_name}</Card.Title>
                                            <Button variant="primary" size='sm' onClick={() => handleEdit(image)}>Edit</Button>{' '}
                                            <Button variant="outline-danger" size='sm' onClick={() => handleDelete(image.gallery_id)}>Delete</Button>
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

                {/* Add/Edit Image Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? 'Edit Image' : 'Add Image'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    placeholder="Select Image"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                            {imagePreview && (
                                <div className="mb-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label>Image Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Image Title"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <div className="d-grid gap-2">
                                    <Button onClick={editMode ? handleSaveChanges : handleAddImage}>
                                        {editMode ? 'Save Changes' : 'Add Image'}
                                    </Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </React.Fragment>
    );
}

export default Gallery;
