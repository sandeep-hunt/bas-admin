import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Container from 'react-bootstrap/esm/Container'
import Breadcrumbs from '../components/Breadcrumbs'
import { Col, Form, Row, Card, Accordion } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { Helmet } from 'react-helmet'

const EditBlog = () => {
    const navigator = useNavigate();
    const { Blogid } = useParams();
    const [blog, setBlog] = useState('');
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState({ image1: null, image2: null });  // Store the selected image
    const [previews, setPreviews] = useState({ image1: '', image2: '' });  // Preview for the selected image
    const [categoryData, setCategoryData] = useState([]);

    // Fetch the blog data from the backend using the title
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${import.meta.env.VITE_BACKEND_API}blogs/${Blogid}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                setBlog(response.data);
                setPreviews({
                    image1: response.data.blog_thumbnail ? `${import.meta.env.VITE_BACKEND_API}${response.data.blog_thumbnail}` : '',
                    image2: response.data.blog_image ? `${import.meta.env.VITE_BACKEND_API}${response.data.blog_image}` : ''
                });
            })
            .catch(error => {
                console.error('Error fetching the blog:', error);
                setError('Failed to fetch blog');
            });
        axios.get(import.meta.env.VITE_BACKEND_API + 'category', {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response?.data?.length !== 0) {
                    setCategoryData(response?.data);
                    // setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching Category:', error);
                setCategoryData([])
                // setLoading(false);  // In case of an error, also stop loading
            });
    }, [Blogid]);

    const handleContentChange = (blog_content) => {
        setBlog({ ...blog, blog_content });  // Update the blog content
    };

    // Handle form changes
    const handleChange = (e) => {
        setBlog({ ...blog, [e.target.name]: e.target.value });
    };

    // Handle image file selection
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setSelectedFiles({ ...selectedFiles, [name]: file });

        // Show a preview for the selected image
        setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('blog_title', blog.blog_title);
        formData.append('blog_shortDesc', blog.blog_shortDesc);
        formData.append('blog_content', blog.blog_content);
        formData.append('blog_slug', blog.blog_slug);
        formData.append('blog_page_title', blog.blog_page_title);
        formData.append('blog_page_keywords', blog.blog_page_keywords);
        formData.append('blog_page_desc', blog.blog_page_desc);
        formData.append('blog_category', blog.blog_category);

        if (selectedFiles.image1) {
            formData.append('image1', selectedFiles.image1);  // Append image1 if selected
        }
        if (selectedFiles.image2) {
            formData.append('image2', selectedFiles.image2);  // Append image2 if selected
        }
        const token = localStorage.getItem('token');

        axios.put(`${import.meta.env.VITE_BACKEND_API}blogs/update/${Blogid}`, formData, {
            headers: { Authorization: token }
        })
            .then(() => {
                alert('Blog updated successfully');
                navigator(`/blogs`)
            })
            .catch(error => {
                console.error('Error updating the blog:', error);
                setError('Failed to update blog');
            });
    };
    const options = categoryData?.map((val, i) => {
        return (
            <option value={val?.category_id} key={i}>
                {val?.category_name}
            </option>
        )
    });

    return (
        <React.Fragment>
            <Helmet>
                <title>Edit Blog</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Edit Blog</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            <Row>
                                <Col sm={12} md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Title <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name='blog_title'
                                            placeholder="Title"
                                            value={blog.blog_title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Short Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name='blog_shortDesc'
                                            placeholder="Short Description"
                                            value={blog.blog_shortDesc}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Categories <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="blog_category"
                                            value={blog.blog_category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {options}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Content <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Editor
                                            apiKey={import.meta.env.VITE_TINYMCE_API}
                                            init={{
                                                plugins: [
                                                    // Core editing features
                                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                                    // Your account includes a free trial of TinyMCE premium features
                                                    // Try the most popular premium features until Oct 18, 2024:

                                                ],
                                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                            }}
                                            name="blog_content"
                                            value={blog.blog_content}
                                            onEditorChange={handleContentChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Card>
                                            <Card.Header>Slug</Card.Header>
                                            <Card.Body>
                                                <Form.Label>Slug <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name='blog_slug'
                                                    placeholder="Slug"
                                                    value={blog.blog_slug}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Card>
                                            <Card.Header>Author</Card.Header>
                                            <Card.Body>
                                                <Form.Label>Author</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Author"
                                                    value={blog.author}
                                                    disabled
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={4}>
                                    <Accordion defaultActiveKey="0" className='mb-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>SEO</Accordion.Header>
                                            <Accordion.Body>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Page Title <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name='blog_page_title'
                                                        placeholder="Page Title"
                                                        value={blog.blog_page_title}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Keywords <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name='blog_page_keywords'
                                                        placeholder="Page Meta Keywords"
                                                        value={blog.blog_page_keywords}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name='blog_page_desc'
                                                        placeholder="Page Meta Description"
                                                        value={blog.blog_page_desc}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    <Accordion defaultActiveKey="0" className='mb-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Thumbnail Image</Accordion.Header>
                                            <Accordion.Body>
                                                {previews.image1 && (
                                                    <div>
                                                        <p>Preview:</p>
                                                        <img src={previews.image1} alt="Selected" className='img-fluid' />
                                                    </div>
                                                )}
                                                <Form.Group className="mt-3 mb-3">
                                                    <Form.Label>Select Image</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image1"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </Form.Group>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    <Accordion defaultActiveKey="0" className='mb-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Featured Image</Accordion.Header>
                                            <Accordion.Body>
                                                {previews.image2 && (
                                                    <div>
                                                        <p>Preview:</p>
                                                        <img src={previews.image2} alt="Selected" className='img-fluid' />
                                                    </div>
                                                )}
                                                <Form.Group className="mt-3 mb-3">
                                                    <Form.Label>Select Image</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image2"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </Form.Group>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    <Form.Group>
                                        <div className="d-grid gap-2">
                                            <Button type='submit'>Update Blog</Button>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default EditBlog;
