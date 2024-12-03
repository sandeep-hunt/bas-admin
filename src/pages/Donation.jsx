import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from 'react-bootstrap/esm/Container';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import styles for skeleton
import Modal from 'react-bootstrap/Modal';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const Donation = () => {

    const [loading, setLoading] = useState(true);  // Loading state
    const [donationData, setDonationData] = useState([]);
    const [rowData, setRowData] = useState("");
    const [show, setShow] = useState(false);


    const tablelistrowdata = donationData?.map((donor, i) => {
        const createdDate = new Date(donor?.donation_created_date);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        const formattedDate = createdDate.toLocaleDateString('en-US', options)
            .replace(/(\d+)(?=,)/, day => {
                if (day.endsWith("1") && day !== "11") return `${day}st`;
                if (day.endsWith("2") && day !== "12") return `${day}nd`;
                if (day.endsWith("3") && day !== "13") return `${day}rd`;
                return `${day}th`;
            });

        return {
            key: i + 1,
            doner_name: donor?.doner_name,
            doner_email: donor?.doner_email,
            donation_created_date: formattedDate,
            donation_freq: donor?.donation_freq,
            donate_receipt_no: donor?.donate_receipt_no,
            doner_mobile: donor?.doner_mobile,
            action: donor
        };
    });

    const donerTypeHtmlCellRender = (row) => {

        if (parseInt(row.donation_freq) === 0) {
            return <div> Monthly</div>

        }
        if (parseInt(row.donation_freq) === 2) {
            return <div> Yearly</div>

        }
        if (parseInt(row.donation_freq) === 1) {
            return <div>One Time</div>
        }

    }

    const actionHtmlCellRender = (row) => {
        return <>
            <div onClick={() => { setRowData(row?.action); handleClose("settingValue") }} className=' border rounded p-2 cursor-pointer '>View</div>
        </>
    }

    const columns = [
        {
            name: 'Sno',
            selector: row => row.key,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Doner Name',
            selector: row => row.doner_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Doner Email',
            selector: row => row.doner_email,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Date',
            selector: row => row.donation_created_date,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Doner Type',
            selector: row => row.donation_freq,
            cell: donerTypeHtmlCellRender,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Doner Receipt',
            selector: row => row.donate_receipt_no,
            sortable: true,
            wrap: true,
        }
        , {
            name: 'Doner Moblie',
            selector: row => row.doner_mobile,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            selector: row => row.action,
            cell: actionHtmlCellRender,
            wrap: true,
        },
    ];

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            axios.get(import.meta.env.VITE_BACKEND_API + 'donation', {
                headers: { Authorization: token }
            })
                .then(response => {
                    if (response?.data?.length !== 0) {
                        setDonationData(response?.data);
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching Category:', error);
                    setLoading(false);  // In case of an error, also stop loading
                    setDonationData([])
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

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

    const handleClose = (value) => {
        setShow(!show);
        if (value !== "settingValue") {
            setRowData("")
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Donations</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Donation List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs pageName="donation" />
                        </div>
                    </div>
                    <div className="mt-3">

                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={loading ? Array(5).fill({}) : tablelistrowdata}
                            fixedHeader
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 30]}
                            customStyles={customStyles}
                        />
                    </div>
                </div>
                <Modal show={show} onHide={() => { handleClose("removingValue") }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{"Donor Details"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Body>
                                <Form >
                                    <Row>
                                        <Col sm={12} md={12}>
                                            <Row>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData?.doner_name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Email</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData.doner_email}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Address</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            value={rowData.doner_address}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner City</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData.doner_city}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner State</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData.doner_state}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Pincode</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData.doner_pincode}
                                                            disabled
                                                        />

                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Mobile</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="State"
                                                            name="state"
                                                            value={rowData.doner_mobile}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Gender</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData.doner_gender}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Doner Age</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData.doner_age}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Donation Payment Id</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData?.donation_payment_id}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Donate Receipt No</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={rowData?.donate_receipt_no}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Donation Amount</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={"Rs." + rowData?.donation_amount}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Donation Period</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={
                                                                rowData?.donation_freq === 1
                                                                    ? "One Time"
                                                                    : rowData?.donation_freq === 0
                                                                        ? "Monthly"
                                                                        : rowData?.donation_freq === 2
                                                                            ? "Yearly"
                                                                            : "Unknown"
                                                            }
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12} md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Donation Created Date</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={
                                                                rowData?.donation_created_date
                                                                    ? new Date(rowData?.donation_created_date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })
                                                                    : 'Not Available'
                                                            }
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                </Modal>
            </Container>
        </React.Fragment>
    );
}

export default Donation;