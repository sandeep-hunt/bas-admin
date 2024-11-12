import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Container from 'react-bootstrap/esm/Container';
import Breadcrumbs from '../components/Breadcrumbs';
import { Col, Form, Row, Card, Accordion } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBlog = ({ username }) => { // Accept username as a prop
    const navigator = useNavigate();
    const [blog, setBlog] = useState({ blog_title: '', blog_shortDesc: '', blog_content: '', blog_author: username || '', blog_slug: '', blog_page_title: '', blog_page_keywords: '', blog_page_desc: '',blog_category:null });
    const [selectedFiles, setSelectedFiles] = useState({ image1: null, image2: null });
    const [previews, setPreviews] = useState({ image1: '', image2: '' });
    const [error, setError] = useState('');
    const[categoryData,setCategoryData]=useState([]);

    const fetchData = async () => {
        try {
              const token = localStorage.getItem('token');

          axios.get(import.meta.env.VITE_BACKEND_API + 'category', {
                    headers: { Authorization: token }
                })
                .then(response => {
                               if( response?.data?.length !== 0 ){
                                setCategoryData(response?.data);
                                // setLoading(false);
                               }
                            })
                            .catch(error => {
                                console.error('Error fetching Category:', error);
                                setCategoryData([])
                                // setLoading(false);  // In case of an error, also stop loading
                            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
  useEffect(() => {
    window.scrollTo(0, 0);
    

    fetchData();
}, []);

const options = categoryData?.map((val, i) => {
    return (
      <option value={val?.category_id} key={i}>
        {val?.category_name}
      </option>
    )});

    // Function to generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()                   // Convert to lowercase
            .replace(/ /g, '-')               // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');         // Remove all non-word characters except hyphens
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'blog_title') {
            const slug = generateSlug(value);  // Generate slug when title changes
            setBlog({ ...blog, blog_title: value, blog_slug: slug });
        } else {
            setBlog({ ...blog, [name]: value });
        }
    };

    const handleContentChange = (blog_content) => {
        setBlog({ ...blog, blog_content });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setSelectedFiles({ ...selectedFiles, [name]: file });
        setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('blog_title', blog.blog_title);
        formData.append('blog_shortDesc', blog.blog_shortDesc);
        formData.append('blog_content', blog.blog_content);
        formData.append('blog_author', blog.blog_author);
        formData.append('blog_slug', blog.blog_slug);
        formData.append('blog_page_title', blog.blog_page_title);
        formData.append('blog_page_keywords', blog.blog_page_keywords);
        formData.append('blog_page_desc', blog.blog_page_desc);
        formData.append('blog_category', blog.blog_category);
        

        if (selectedFiles.image1) {
            formData.append('image1', selectedFiles.image1);
        }
        if (selectedFiles.image2) {
            formData.append('image2', selectedFiles.image2);
        }
        const token = localStorage.getItem('token');

        axios.post(`${import.meta.env.VITE_BACKEND_API}blogs/add`, formData, {
            headers: {  Authorization: token  }
        })
            .then(response => {
                alert('Blog added successfully');
                navigator(`/blogs`)
            })
            .catch(error => {
                console.error('Error adding blog:', error);
                setError('Failed to add blog');
            });
    };

 

    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Add Blog</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <Row>
                                <Col sm={12} md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Title <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Title"
                                            name="blog_title"
                                            value={blog.blog_title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Slug <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Slug"
                                            name="blog_slug"
                                            value={blog.blog_slug}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Short Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Short Description"
                                            name="blog_shortDesc"
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
                                            value={blog.category} 
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
                                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                                    
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
                                            <Card.Header>Author</Card.Header>
                                            <Card.Body>
                                                <Form.Label>Author <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Author"
                                                    name="blog_author"
                                                    value={blog.blog_author}
                                                    onChange={handleChange}
                                                    disabled
                                                    required
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Form.Group>
                                </Col>

                                <Col sm={12} md={4}>
                                    {/* SEO Section */}
                                    <Accordion defaultActiveKey="0" className='mb-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>SEO</Accordion.Header>
                                            <Accordion.Body>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Page Title <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Page Title"
                                                        name="blog_page_title"
                                                        value={blog.blog_page_title}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Keywords <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Keywords"
                                                        name="blog_page_keywords"
                                                        value={blog.blog_page_keywords}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Description"
                                                        name="blog_page_desc"
                                                        value={blog.blog_page_desc}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                    {/* Featured Image */}
                                    <Accordion defaultActiveKey="0" className='mb-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Thumbnail Image</Accordion.Header>
                                            <Accordion.Body>
                                                {previews.image1 && (
                                                    <div>
                                                        <p>Image 1 Preview:</p>
                                                        <img src={previews.image1} alt="Selected" className='img-fluid' />
                                                    </div>
                                                )}
                                                <Form.Group className="mt-3 mb-3">
                                                    <Form.Label>Select Image <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image1"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        required // Marking image as required
                                                    />
                                                </Form.Group>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                    {/* Featured Image 2 */}
                                    <Accordion defaultActiveKey="0" className='mb-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Featured Image</Accordion.Header>
                                            <Accordion.Body>
                                                {previews.image2 && (
                                                    <div>
                                                        <p>Image 2 Preview:</p>
                                                        <img src={previews.image2} alt="Selected" className='img-fluid' />
                                                    </div>
                                                )}
                                                <Form.Group className="mt-3 mb-3">
                                                    <Form.Label>Select Image <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image2"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        required // Marking image as required
                                                    />
                                                </Form.Group>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                    <Form.Group>
                                        <div className="d-grid gap-2">
                                            <Button type="submit">Publish</Button>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default AddBlog;
