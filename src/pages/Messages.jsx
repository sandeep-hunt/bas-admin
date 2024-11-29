import React, { useState, useEffect } from 'react'; 
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from 'react-bootstrap/esm/Container';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  

export default function Messages() {
    const [loading, setLoading] = useState(true);  
    const [messageData, setMessageData] = useState([]);

    
    const editHandler = async (id, newStatus) => {
        
        if(newStatus === ''){
            alert('need to select the value');
            return false
        }
    
        const updatedMessages = messageData.map(message => 
            message.message_id === id ? { ...message, message_status: newStatus } : message
        );
        setMessageData(updatedMessages);

        
        const token = localStorage.getItem('token');
        try {
          const response =  await axios.put(import.meta.env.VITE_BACKEND_API + `messages/update-message/${id}`, 
                { message_status: newStatus }, 
                { headers: { Authorization: token } }
            );
            alert(response?.data?.message);
        } catch (error) {
            alert(`Error: ${error.response.data.error || 'An unexpected error occurred.'}`);
            
        }
    };

    const handleDeleteHandler = async (messageId) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this message?')) {
            const response = await axios.delete(import.meta.env.VITE_BACKEND_API + `messages/delete-message/${messageId}`, {
                headers: { Authorization: token }
            });
            const get_response = await axios.get(import.meta.env.VITE_BACKEND_API + 'messages', {
                headers: { Authorization: token }
            });
            setMessageData(get_response?.data);
            alert(response?.data?.message);
        }
    };

    const tablelistrowdata = messageData?.map((message, i) => {
        return {
            key: message?.message_id,
            firstname: message?.message_firstname,
            lastname: message?.message_lastname,
            email: message?.message_email,
            mobile: message?.message_mobile,
            message: message?.message,
            status: (
                <select
                 className=' bg-[#FFFFFF] border border-gray-400 p-1 rounded  '
                    value={message?.message_status}
                    onChange={(e) => editHandler(message?.message_id, e.target.value)}
                >
                    <option value={''}>Select value</option>
                    <option value={0}>pending</option>
                    <option value={1}>approved</option>
                    <option value={2}>closed</option>
                </select>
            ),
        };
    });

    const columns = [
        {
            name: 'First Name',
            selector: row => row.firstname,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Last Name',
            selector: row => row.lastname,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Mobile',
            selector: row => row.mobile,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Message',
            selector: row => row.message,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Message Status',
            selector: row => row.status,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            cell: row => (
                <div className="flex gap-2">
                    <div className="btn btn-danger btn-sm" onClick={() => handleDeleteHandler(row?.key)}>
                        Delete
                    </div>
                </div>
            ),
        }
    ];

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'messages', {
                headers: { Authorization: token },
            });
            if (response?.data?.length !== 0) {
                setMessageData(response?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching Messages:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
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
            name: <Skeleton width={150} />,
            selector: () => <Skeleton width={150} />,
        },
        {
            name: <Skeleton width={100} />,
            selector: () => <Skeleton width={100} />,
        },
        {
            name: <Skeleton width={200} />,
            selector: () => <Skeleton width={200} />,
        },
        {
            name: <Skeleton width={100} />,
            cell: () => <Skeleton width={100} height={30} />,
        },
    ];

    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Message List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={ loading? Array(5).fill({}) :tablelistrowdata}
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
