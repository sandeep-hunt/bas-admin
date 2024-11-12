import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Container from 'react-bootstrap/esm/Container'
import Breadcrumbs from '../components/Breadcrumbs'
import { Col, Form, Row, Card, Accordion } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from 'react-router-dom';
import axios from 'axios'

const EditArticle = () => {
    const { Articleid } = useParams();
    const [article, setarticle] = useState('');
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState({ image1: null, image2: null, pdfs: [] });  // Store the selected image
    const [previews, setPreviews] = useState({ image1: '', image2: '', pdfs: [] });  // Preview for the selected image

    // Fetch the article data from the backend using the title
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_API}articles/${Articleid}`)
            .then(response => {
                setarticle(response.data);
                setPreviews({
                    image1: response.data.article_thumbnail ? `${import.meta.env.VITE_BACKEND_API}${response.data.article_thumbnail}` : '',
                    image2: response.data.article_image ? `${import.meta.env.VITE_BACKEND_API}${response.data.article_image}` : '',
                    pdfs: JSON.parse(response.data.article_attachment)
                });
            })
            .catch(error => {
                console.error('Error fetching the article:', error);
                setError('Failed to fetch article');
            });
    }, [Articleid]);

    const handleContentChange = (article_content) => {
        setarticle({ ...article, article_content });  // Update the article content
    };

    // Handle form changes
    const handleChange = (e) => {
        setarticle({ ...article, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'pdfs') {
            setSelectedFiles({ ...selectedFiles, pdfs: Array.from(files) });
            setPreviews({ ...previews, pdfs: Array.from(files).map(file => file.name) }); // Show PDF names
        } else {
            const file = files[0];
            setSelectedFiles({ ...selectedFiles, [name]: file });
            if (name.startsWith('image')) {
                setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
            }
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('article_title', article.article_title);
        formData.append('article_shortDesc', article.article_shortDesc);
        formData.append('article_content', article.article_content);
        formData.append('article_slug', article.article_slug);
        formData.append('article_page_title', article.article_page_title);
        formData.append('article_page_keywords', article.article_page_keywords);
        formData.append('article_page_desc', article.article_page_desc);

        if (selectedFiles.image1) {
            formData.append('image1', selectedFiles.image1);  // Append image1 if selected
        }
        if (selectedFiles.image2) {
            formData.append('image2', selectedFiles.image2);  // Append image2 if selected
        }
        selectedFiles.pdfs.forEach((pdf, index) => {
            formData.append('pdfs', pdf); // Append each PDF file to the FormData
        });

        axios.put(`${import.meta.env.VITE_BACKEND_API}articles/update/${Articleid}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                alert('article updated successfully');
            })
            .catch(error => {
                console.error('Error updating the article:', error);
                setError('Failed to update article');
            });
    };

    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Edit article</h4>
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
                                            name='article_title'
                                            placeholder="Title"
                                            value={article.article_title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Short Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name='article_shortDesc'
                                            placeholder="Short Description"
                                            value={article.article_shortDesc}
                                            onChange={handleChange}
                                            required
                                        />
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
                                            name="article_content"
                                            value={article.article_content}
                                            onEditorChange={handleContentChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className='mb-3'>
                                        <Form.Label>Attachment <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control type="file" name="pdfs" accept="application/pdf" multiple onChange={handleFileChange} />
                                        {previews.pdfs.length > 0 && (
                                            <div className='mt-3'>
                                                <p>Selected PDFs:</p>
                                                <ul>
                                                    {previews.pdfs.map((pdf, index) => (
                                                        <li key={index}>{pdf}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Card>
                                            <Card.Header>Slug</Card.Header>
                                            <Card.Body>
                                                <Form.Label>Slug <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name='article_slug'
                                                    placeholder="Slug"
                                                    value={article.article_slug}
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
                                                    value={article.author}
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
                                                        name='article_page_title'
                                                        placeholder="Page Title"
                                                        value={article.article_page_title}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Keywords <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name='article_page_keywords'
                                                        placeholder="Page Meta Keywords"
                                                        value={article.article_page_keywords}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name='article_page_desc'
                                                        placeholder="Page Meta Description"
                                                        value={article.article_page_desc}
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
                                            <Button type='submit'>Update article</Button>
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

export default EditArticle;
