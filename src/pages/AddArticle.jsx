import React, { useState } from 'react';
import Header from '../components/Header';
import Container from 'react-bootstrap/esm/Container';
import Breadcrumbs from '../components/Breadcrumbs';
import { Col, Form, Row, Card, Accordion } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';
import { Helmet } from "react-helmet";

const AddArticle = ({ username, id }) => { // Accept username as a prop
    const [article, setarticle] = useState({ article_title: '', article_shortDesc: '', article_content: '', article_author: username || '', article_slug: '', article_page_title: '', article_page_keywords: '', article_page_desc: '' });
    const [selectedFiles, setSelectedFiles] = useState({ image1: null, image2: null, pdfs: [] });
    const [previews, setPreviews] = useState({ image1: '', image2: '', pdfs: [] });
    const [error, setError] = useState('');

    // Function to generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()                   // Convert to lowercase
            .replace(/ /g, '-')               // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');         // Remove all non-word characters except hyphens
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'article_title') {
            const slug = generateSlug(value);  // Generate slug when title changes
            setarticle({ ...article, article_title: value, article_slug: slug });
        } else {
            setarticle({ ...article, [name]: value });
        }
    };

    const handleContentChange = (article_content) => {
        setarticle({ ...article, article_content });
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('article_title', article.article_title);
        formData.append('article_shortDesc', article.article_shortDesc);
        formData.append('article_content', article.article_content);
        formData.append('article_author', article.article_author);
        formData.append('article_slug', article.article_slug);
        formData.append('article_page_title', article.article_page_title);
        formData.append('article_page_keywords', article.article_page_keywords);
        formData.append('article_page_desc', article.article_page_desc);

        if (selectedFiles.image1) {
            formData.append('image1', selectedFiles.image1);
        }
        if (selectedFiles.image2) {
            formData.append('image2', selectedFiles.image2);
        }
        selectedFiles.pdfs.forEach((pdf, index) => {
            formData.append('pdfs', pdf); // Append each PDF file to the FormData
        });

        axios.post(`${import.meta.env.VITE_BACKEND_API}articles/add`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                alert('article added successfully');
            })
            .catch(error => {
                console.error('Error adding article:', error);
                setError('Failed to add article');
            });
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Add Articles</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Add article</h4>
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
                                            name="article_title"
                                            value={article.article_title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Slug <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Slug"
                                            name="article_slug"
                                            value={article.article_slug}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Short Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Short Description"
                                            name="article_shortDesc"
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
                                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',

                                                ],
                                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                            }}
                                            name="article_content"
                                            value={article.article_content}
                                            onEditorChange={handleContentChange}
                                            required
                                        />
                                    </Form.Group>

                                    {/* PDF Upload Input for Multiple Files */}
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Author <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control type="file" name="pdfs" accept="application/pdf" multiple onChange={handleFileChange} required />
                                        {previews.pdfs.length > 0 && (
                                            <div>
                                                <p className='mt-3'>Selected PDFs:</p>
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
                                            <Card.Header>Author</Card.Header>
                                            <Card.Body>
                                                <Form.Label>Author <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Author"
                                                    name="article_author"
                                                    value={article.article_author}
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
                                                        name="article_page_title"
                                                        value={article.article_page_title}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Keywords <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Keywords"
                                                        name="article_page_keywords"
                                                        value={article.article_page_keywords}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Description"
                                                        name="article_page_desc"
                                                        value={article.article_page_desc}
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

export default AddArticle;
