import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from 'react-bootstrap/esm/Container';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import styles for skeleton
import { Spinner } from 'react-bootstrap'; // Import Bootstrap Spinner
import { Helmet } from 'react-helmet';

const Blogs = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingRowId, setDeletingRowId] = useState(null); // Track deleting row ID

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        const token = localStorage.getItem('token');

        axios.get(import.meta.env.VITE_BACKEND_API + 'blogs', {
            headers: { Authorization: token }
        })
            .then(response => {
                setRecords(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
                setRecords([]);
            });
    };

    const handleDelete = (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            setDeletingRowId(blogId); // Set the ID of the row being deleted
            const token = localStorage.getItem('token');
            axios.delete(`${import.meta.env.VITE_BACKEND_API}blogs/delete/${blogId}`, {
                headers: { Authorization: token }
            })
                .then(response => {
                    alert('Blog deleted successfully');
                    fetchBlogs();
                })
                .catch(error => {
                    console.error('Error deleting blog:', error);
                })
                .finally(() => {
                    setDeletingRowId(null); // Reset the deleting row ID
                });
        }
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.blog_id,
            sortable: true,
        },
        {
            name: 'Title',
            selector: row => row.blog_title,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Slug',
            selector: row => row.blog_slug,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Image',
            selector: row => <img width={100} src={`${import.meta.env.VITE_BACKEND_API}${row.blog_image}`} />,
        },
        {
            name: 'Short Description',
            selector: row => row.blog_shortDesc,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Category Name',
            selector: row => row.category_name,
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
            cell: row => (
                <div className='gap-2 flex flex-row'>
                    <Link
                        className={`btn btn-primary btn-sm ${deletingRowId ? 'disabled' : ''}`}
                        to={"edit-blog/" + row.key}
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(row.key)}
                        className="btn btn-danger btn-sm"
                        disabled={!!deletingRowId} // Disable all buttons during deletion
                    >
                        {deletingRowId === row.key ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            ),
        },
    ];

    const tablelistrowdata = records?.map((row, i) => {
        return {
            key: row.blog_id,
            blog_id: i + 1,
            created_at: row.created_at,
            category_name: row.category_name,
            blog_slug: row.blog_slug,
            blog_title: row.blog_title,
            blog_image: row.blog_image,
            blog_shortDesc: row?.blog_shortDesc?.split(' ')?.slice(0, 11)?.join(' ') + '....'
        };
    });

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
                <title>Blogs List</title>
            </Helmet>
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
                            <Link className='btn btn-primary' to="/add-blog">Add Blog</Link>
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
            </Container>
        </React.Fragment>
    );
};

export default Blogs;
