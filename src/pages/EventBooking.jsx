import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from 'react-bootstrap/esm/Container'
import DataTable from 'react-data-table-component'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios'
import { Helmet } from 'react-helmet'

const EventBooking = () => {

    const [eventBookingData, setEventBookingData] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [isRefunding, setIsRefunding] = useState(false);  // Global loading state for all buttons
    const [loadingRefundRow, setLoadingRefundRow] = useState(null);  // Track the row being refunded


    const getDataHandler = async () => {

        const token = localStorage.getItem('token');
        try {
            const get_response = await axios.get(import.meta.env.VITE_BACKEND_API + 'eventsBooking', {
                headers: { Authorization: token }
            });
            if (get_response?.data) {
                setEventBookingData(get_response?.data);
                setLoading(false);
            }
        } catch (error) {
            setEventBookingData([])
            setLoading(false);
        }
    }

    useEffect(() => {
        getDataHandler();

    }, [])

    const refundHandler = async (row) => {
        const dataToSubmit = {
            payment_id: row?.payment_id,
            bookingId: row?.key,
            email: row?.email,
        };

        const token = localStorage.getItem('token');

        if (!token) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        // Disable all buttons and show spinner for the specific row
        setIsRefunding(true);
        setLoadingRefundRow(row.key);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}payment/refund`,
                dataToSubmit,
                {
                    headers: { Authorization: token }
                }
            );

            // Show success message
            if (response?.data?.message) {
                alert(response.data.message);
            } else {
                alert("Refund processed successfully.");
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || "An error occurred while processing your request.";
                alert(errorMessage);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            // Re-enable all buttons and remove the loading spinner for the specific row
            setIsRefunding(false);
            setLoadingRefundRow(null);
        }

        getDataHandler(); // Refresh data
    };

    const statusHtmlCellRender = (row) => {
        return (
            <>
                <div>
                    {row.status?.toLowerCase() === "paid" && (
                        <div className='flex items-center gap-4'>
                            <div>paid</div>
                            {row?.event_status !== 0 && <div
                                onClick={(e) => { refundHandler(row) }}
                                className={`${isRefunding ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 cursor-pointer'
                                    } w-[70px] h-8 flex justify-center items-center p-1 rounded text-sm font-semibold text-[#FFFFFF]`}
                                disabled={isRefunding}
                            >
                                {loadingRefundRow === row.key ? (
                                    <div className="spinner-border text-white" style={{ width: '1rem', height: '1rem' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Refund'
                                )}
                            </div>}
                        </div>
                    )}
                    {row.status?.toLowerCase() === "failed" && <div>failed</div>}
                    {row.status?.toLowerCase() === "refunded" && <div>refunded</div>}
                    {row.status?.toLowerCase() === "" && <div>{row.status}</div>}
                </div>
            </>
        );
    };

    const columns = [
        {
            name: 'Booking ID',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Event Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Mobile',
            selector: row => row.mobile,
            sortable: true
        },
        {
            name: 'Payment ID',
            selector: row => row.payment_id,
            sortable: false
        },
        {
            name: 'Payment Refund ID',
            selector: row => row.payment_refund_id,
            sortable: false
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Payment Status',
            selector: row => row.status,
            cell: statusHtmlCellRender,
            sortable: true
        },
    ];
    const data = eventBookingData?.map((val, i) => {
        // Ensure event_booking_dob is a valid Date object
        const date = new Date(val?.event_booking_dob);

        // Check if the date is valid
        const formattedDate = date instanceof Date && !isNaN(date)
            ? new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date)
            : ''; // Return empty string if the date is invalid

        return {
            key: val?.event_booking_id,
            id: i + 1,
            name: val?.event_name,
            email: val?.event_booking_email,
            mobile: val?.event_booking_contact,
            date: formattedDate,
            status: val?.payment_status,
            payment_id: val?.payment_id,
            event_status:val?.event_status,
            payment_refund_id:val?.payment_refund_id
        }
    });

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
                <title>Event Booking</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Event Booking List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={loading ? Array(5).fill({}) : data}
                            fixedHeader
                            pagination
                            customStyles={customStyles}
                        ></DataTable>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default EventBooking