import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from 'react-bootstrap/esm/Container';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import styles for skeleton
import { Spinner } from 'react-bootstrap';  // Import Bootstrap Spinner
import { Helmet } from 'react-helmet';

const Articles = () => {
    const columns = [
        {
            name: 'ID',
            selector: row => row.article_id,
            sortable: true,
        },
        {
            name: 'Title',
            selector: row => row.article_title,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Slug',
            selector: row => row.article_slug,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Image',
            selector: row => <img width={100} src={`${import.meta.env.VITE_BACKEND_API}${row.article_image}`} />,
        },
        {
            name: 'Short Description',
            selector: row => row.article_shortDesc.split(' ').slice(0, 11).join(' ') + '....',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Created Date',
            selector: row => row.created_at,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div>
                    <Link className='btn btn-primary btn-sm' to={"edit-article/" + row.article_id}>Edit</Link>
                    <button
                        onClick={() => handleDelete(row.article_id)}
                        className="btn btn-danger btn-sm"
                        disabled={deleteLoading || isDeleted[row.article_id]}>
                        {deleteLoading || isDeleted[row.article_id] ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            ),
        }
    ];

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [deleteLoading, setDeleteLoading] = useState(false);  // Delete button loading state
    const [isDeleted, setIsDeleted] = useState({});  // Track which rows are being deleted

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = () => {
        const token = localStorage.getItem('token');
        axios.get(import.meta.env.VITE_BACKEND_API + 'articles', {
            headers: { Authorization: token }
        })
            .then(response => {
                setRecords(response.data);
                setFilteredRecords(response.data);  // Initialize with all records
                setLoading(false);  // Data fetched, stop loading
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                setLoading(false);  // In case of an error, also stop loading
            });
    }

    // Handle the delete functionality
    const handleDelete = (articleId) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            setDeleteLoading(true);  // Set the loading state to true when delete starts
            setIsDeleted(prev => ({ ...prev, [articleId]: true })); // Disable the delete button for this row

            const token = localStorage.getItem('token');
            axios.delete(`${import.meta.env.VITE_BACKEND_API}articles/delete/${articleId}`, {
                headers: { Authorization: token }
            })
                .then(response => {
                    alert('Article deleted successfully');
                    fetchArticles();
                })
                .catch(error => {
                    console.error('Error deleting article:', error);
                })
                .finally(() => {
                    setDeleteLoading(false);  // Reset the loading state after delete operation is complete
                });
        }
    };

    // Handle the filter functionality
    const handleFilter = (event) => {
        const query = event.target.value.toLowerCase();
        const newFilteredRecords = records.filter(row => {
            return row.article_title.toLowerCase().includes(query) || row.article_slug.toLowerCase().includes(query);
        });
        setFilteredRecords(newFilteredRecords);
    };

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

    return (
        <React.Fragment>
            <Helmet>
                <title>Articles List</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Articles List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between mb-3">
                            <Link className='btn btn-primary' to="/add-article">Add Article</Link>
                            <input type="text" placeholder="Filter by title or slug" onChange={handleFilter} />
                        </div>
                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={loading ? Array(5).fill({}) : filteredRecords}
                            fixedHeader
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            customStyles={customStyles}
                        />
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}

export default Articles;
