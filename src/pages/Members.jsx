import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from 'react-bootstrap/esm/Container'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 
import axios from 'axios'

const Members = () => {

    const [messageData,setMessageDate]=useState([]);
    const [loading,setLoading]=useState(true);


    const fetchData = async () => {
        try {
              const token = localStorage.getItem('token');

          axios.get(import.meta.env.VITE_BACKEND_API + 'members', {
                    headers: { Authorization: token }
                })
                .then(response => {
                               if( response?.data?.length !== 0 ){
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


    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true
        },
        {
            name: ' Name',
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
            name: 'Type',
            selector: row => row.type,
            sortable: true
        },
        {
            name: 'Action',
            selector: row => row.action,
            sortable: true
        }
    ];
    const tableListData = messageData?.map((message,index)=>{
        return {
            key:message?.member_id,
            id: index+1,
            name: message?.name,
            email: message?.email,
            mobile: message?.mobile,
            type: message?.member_type,
            action: <div className='flex gap-2'>
                <Link className='btn btn-primary btn-sm' to={`edit-member/${message?.member_id}`}>Edit</Link>
                <div className='btn btn-outline-danger btn-sm'  onClick={()=>{handleDeleteHandler(message?.member_id)}}>Delete</div>
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

  const handleDeleteHandler = async(categoryId) => {
    const token = localStorage.getItem('token');
         
    if (window.confirm('Are you sure you want to delete this category?')) {
       
        const response = await  axios.delete(import.meta.env.VITE_BACKEND_API + `members/delete-member/${categoryId}`, {
            headers: { Authorization: token }
        });
        const get_response = await  axios.get(import.meta.env.VITE_BACKEND_API + 'members',{
            headers: { Authorization: token }
        });
        setMessageDate(get_response?.data);
        alert(response?.data?.message);
    }
};
    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Members List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-end mb-3">
                            <Link className='btn btn-primary' to="/add-member">Add Member</Link>
                            {/* <input type="text" onChange={handleFilter} /> */}
                        </div>
                        <DataTable
                            columns={ loading ?  skeletonColumns : columns }
                            data={ loading ? skeletonTableData : tableListData }
                            pagination
                            customStyles={customStyles}
                        ></DataTable>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default Members