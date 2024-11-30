import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from 'react-bootstrap/esm/Container';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import styles for skeleton
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Helmet } from 'react-helmet';

const Blogs = () => {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state
    const [categoryData, setCategoryData] = useState([]);
    const [categoryValue, setCategoryValue] = useState("");
    const [categoryId, setCategoryId] = useState(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setShow(!show);
    };

    const onClickAddHandler = () => {
        setCategoryId(null);
        setCategoryValue("");
        setShow(!show);
        setEditMode(false)
    };

    const onClickEditHandler = (id, name, boolean) => {
        setShow(!show);
        setEditMode(boolean)
        setCategoryId(id);
        setCategoryValue(name);
    }

    const handleDeleteHandler = async (categoryId) => {
        const token = localStorage.getItem('token');

        if (window.confirm('Are you sure you want to delete this category?')) {
            setDeletingCategoryId(categoryId); // Set the ID of the category being deleted

            try {
                const response = await axios.delete(import.meta.env.VITE_BACKEND_API + `category/delete-category/${categoryId}`, {
                    headers: { Authorization: token }
                });

                const get_response = await axios.get(import.meta.env.VITE_BACKEND_API + 'category', {
                    headers: { Authorization: token }
                });

                setCategoryData(get_response?.data);
                alert(response?.data?.message);
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete the category. Please try again.");
            } finally {
                setDeletingCategoryId(null); // Reset the deleting category ID
            }
        }
    };


    const tablelistrowdata = categoryData?.map((category, i) => {
        return {
            key: category?.category_id,
            category_name: category?.category_name
        };
    });

    const columns = [
        {
            name: 'Category Name',
            selector: row => row.category_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            cell: row => (
                <div className='flex gap-2'>
                    <div
                        className='btn btn-primary btn-sm'
                        onClick={() => { onClickEditHandler(row?.key, row?.category_name, true); }}
                    >
                        Edit
                    </div>
                    <div
                        className={`btn btn-danger btn-sm ${deletingCategoryId !== null && 'disabled'}`}
                        onClick={() => { handleDeleteHandler(row?.key); }}
                        disabled={deletingCategoryId !== null} // Disable all buttons while one is deleting
                    >
                        {deletingCategoryId === row?.key ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : (
                            'Delete'
                        )}
                    </div>
                </div>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            axios.get(import.meta.env.VITE_BACKEND_API + 'category', {
                headers: { Authorization: token }
            })
                .then(response => {
                    if (response?.data?.length !== 0) {
                        setCategoryData(response?.data);
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching Category:', error);
                    setLoading(false);  // In case of an error, also stop loading
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    console.log("loading", loading)

    // Custom styles for the table
    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold'
            },
        },
        cells: {
            style: {
                fontSize: '14px',
            },
        },
    };

    // Skeleton columns for loading
    const skeletonColumns = [
        {
            name: <Skeleton width={50} />,
            selector: () => <Skeleton width={50} />,
        },
        {
            name: <Skeleton width={150} />,
            selector: () => <Skeleton width={150} />,
        },
        {
            name: <Skeleton width={100} />,
            selector: () => <Skeleton width={100} />,
        },
        {
            name: <Skeleton width={100} />,
            selector: () => <Skeleton width={100} />,
        },
        {
            name: <Skeleton width={100} />,
            selector: () => <Skeleton width={100} />,
        },
        {
            name: <Skeleton width={100} />,
            selector: () => <Skeleton width={100} />,
        },
        {
            name: <Skeleton width={100} />,
            cell: () => <Skeleton width={100} height={30} />,
        },
    ];

    const handlerAddHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_API + 'category/add-category', { category_name: categoryValue }, {
                headers: { Authorization: token }
            });
            const get_response = await axios.get(import.meta.env.VITE_BACKEND_API + 'category', {
                headers: { Authorization: token }
            });
            setCategoryData(get_response?.data);
            onClickAddHandler();
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.error || 'An unexpected error occurred.'}`);
            } else if (error.request) {
                alert("No response from the server. Please try again later.");
            } else {
                alert("An error occurred while making the request. Please try again.");
            }
        }
    };

    const handleEditHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(import.meta.env.VITE_BACKEND_API + `category/update-category/${categoryId}`, { category_name: categoryValue }, {
                headers: { Authorization: token }
            });
            const get_response = await axios.get(import.meta.env.VITE_BACKEND_API + 'category', {
                headers: { Authorization: token }
            });
            setCategoryData(get_response?.data);
            onClickAddHandler();
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.error || 'An unexpected error occurred.'}`);
            } else if (error.request) {
                alert("No response from the server. Please try again later.");
            } else {
                alert("An error occurred while making the request. Please try again.");
            }
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Categories List</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Category List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-end mb-3">
                            <div className=' btn btn-primary ' onClick={onClickAddHandler} >Create Category</div>
                        </div>
                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={loading ? Array(5).fill({}) : tablelistrowdata}
                            fixedHeader
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            customStyles={customStyles}
                        />
                    </div>
                </div>

                {/* Add/Edit Image Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? 'Edit Category' : 'Add Category'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editMode ? handleEditHandler : handlerAddHandler}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="input"
                                    placeholder="Enter Category Name"
                                    required
                                    value={categoryValue}
                                    onChange={(e) => { setCategoryValue(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <div className="d-grid gap-2">
                                    <Button type="submit">
                                        {editMode ? 'Save Changes' : 'Add Category'}
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

export default Blogs;