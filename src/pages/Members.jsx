import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from 'react-bootstrap/esm/Container'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet'

const Members = () => {

    const [messageData, setMessageDate] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            axios.get(import.meta.env.VITE_BACKEND_API + 'members', {
                headers: { Authorization: token }
            })
                .then(response => {
                    if (response?.data?.length !== 0) {
                        setMessageDate(response?.data);
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching Category:', error);
                    setLoading(false);  // In case of an error, also stop loading
                    setMessageDate([]);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        window.scrollTo(0, 0);


        fetchData();
    }, []);

    const [showPop, setShowPop] = useState(false);

    const [rejectedId, setRejectedId] = useState(null);

    const [rejectReason, setRejectReason] = useState("");



    const approvedHandler = async (member_id) => {
        const dataToSubmit = {
            status: 1,
            reject_reason: "",
        };

        const token = localStorage.getItem("token");

        try {
            // API request
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}members/update-member-status/${member_id}`,
                dataToSubmit,
                {
                    headers: { Authorization: token },
                }
            );

            // Check success response
            if (response.status === 200) {
                fetchData();
                alert("Member approved successfully!");
            }
        } catch (error) {
            // Handle errors
            if (error.response) {

                alert(error.response.data.error);
            } else if (error.request) {
                alert("No response from the server. Please try again later.");
            }
        }
    };

    const handleClose = (value) => {

        setShowPop(!showPop);

        if (value === "removingValue") {
            setRejectReason("")
            setRejectedId(null);
        }

    }




    const rejectedHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}members/update-member-status/${rejectedId}`,
                { status: 2, reject_reason: rejectReason },
                { headers: { Authorization: token } }
            );
            if (response.status === 200) {
                fetchData();
                alert("Member rejected successfully!");
                handleClose("removingValue");
            }
        } catch (error) {
            console.error("Error rejecting member:", error);
            alert("Failed to reject member. Please try again.");
        }
    };


    const statusHtmlCellRender = (row) => {

        if (row?.status === 0) {
            return <>
                <div className=' flex  gap-2 '>
                    <button type='button' className=' whitespace-nowrap w-[70px] h-8 bg-[#B5B5B5] text-sm  text-[#FFFFFF] rounded '>Pending</button>
                    <button type='button' onClick={() => { approvedHandler(row?.key) }} className=' whitespace-nowrap w-[80px] h-8 bg-[#00B656] text-sm  text-[#FFFFFF] rounded '>Apporved</button>
                    <button onClick={() => { setRejectedId(row?.key); handleClose() }} type='button' className=' whitespace-nowrap w-[80px] h-8 bg-[#EA4242] text-sm  text-[#FFFFFF] rounded '>Rejected</button>
                </div>
            </>
        }
        if (row?.status === 1) {
            return <>
                <div>
                    <button type='button' className=' whitespace-nowrap text-sm font-medium '>Apporved</button>
                </div>
            </>
        }
        if (row?.status === 2) {
            return <>
                <div>
                    <button type='button' className=' whitespace-nowrap text-sm font-medium ' >Rejected</button>
                </div>
            </>
        }

    }


    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            minWidth: "80px",
            maxWidth: "80px"
        },
        {
            name: ' Name',
            selector: row => row.name,
            sortable: true,
            minWidth: "100px",
            maxWidth: "150px"
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Mobile',
            selector: row => row.mobile,
            sortable: true,
            minWidth: "100px",
            maxWidth: "150px"
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
            minWidth: "100px",
            maxWidth: "150px"
        },
        {
            name: 'Action',
            selector: row => row.action,
            sortable: true,
            minWidth: "100px",
            maxWidth: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: statusHtmlCellRender,
        },
    ];
    const tableListData = messageData?.map((message, index) => {
        return {
            key: message?.member_id,
            id: index + 1,
            name: message?.name,
            email: message?.email,
            mobile: message?.mobile,
            type: message?.member_type,
            status: message?.status,
            action: <div className='flex gap-2'>
                <Link className='btn btn-primary btn-sm' to={`edit-member/${message?.member_id}`}>Edit</Link>
                <div className='btn btn-outline-danger btn-sm' onClick={() => { handleDeleteHandler(message?.member_id) }}>Delete</div>
            </div>
        }
    })

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
    const skeletonTableData = [
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

    const handleDeleteHandler = async (categoryId) => {
        const token = localStorage.getItem('token');

        if (window.confirm('Are you sure you want to delete this category?')) {

            const response = await axios.delete(import.meta.env.VITE_BACKEND_API + `members/delete-member/${categoryId}`, {
                headers: { Authorization: token }
            });
            const get_response = await axios.get(import.meta.env.VITE_BACKEND_API + 'members', {
                headers: { Authorization: token }
            });
            setMessageDate(get_response?.data);
            alert(response?.data?.message);
        }
    };
    return (
        <React.Fragment>
            <Helmet>
                <title>Members List</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Members List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs pageName="members" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-end mb-3">
                            <Link className='btn btn-primary' to="/add-member">Add Member</Link>
                            {/* <input type="text" onChange={handleFilter} /> */}
                        </div>
                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={loading ? skeletonTableData : tableListData}
                            pagination
                            customStyles={customStyles}
                        />
                    </div>
                    <Modal show={showPop} onHide={() => { handleClose("removingValue") }}>
                        <Modal.Header closeButton>
                            <Modal.Title>{"Reject Reason"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={rejectedHandler}>
                                        <Row>
                                            <Col sm={12} md={12}>
                                                <Row>
                                                    <Col sm={12} md={12}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Reason</Form.Label>
                                                            <Form.Control
                                                                required
                                                                as="textarea"
                                                                value={rejectReason}
                                                                onChange={(e) => setRejectReason(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Button type="submit" variant="danger">
                                            Reject
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Modal.Body>
                    </Modal>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default Members