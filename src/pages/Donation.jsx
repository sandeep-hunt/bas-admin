import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from 'react-bootstrap/esm/Container';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import styles for skeleton
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';




const Donation = () => {
  

    const [loading, setLoading] = useState(true);  // Loading state
    const [donationData,setDonationData]= useState([]);

  

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
        };
    });
    
    const  donerTypeHtmlCellRender = (row)=>{

        if(parseInt(row.donation_freq) === 1){
            return <div> Monthly</div>

        }
        if(parseInt(row.donation_freq) === 2){
            return <div> Yearly</div>

        }
        if(parseInt(row.donation_freq) === 0){
            return <div>One Time</div>
        }

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
            cell:donerTypeHtmlCellRender,
            sortable: true,
            wrap: true,
        },
        {
            name:'Doner Receipt',
            selector: row => row.donate_receipt_no,
            sortable: true,
            wrap: true,
        }
        ,{
            name: 'Doner Moblie',
            selector: row => row.doner_mobile,
            sortable: true,
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
                               if( response?.data?.length !== 0 ){
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

    
 

    return (
        <React.Fragment>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Donation List</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div className="mt-3">
                       
                        <DataTable
                            columns={loading ? skeletonColumns : columns}
                            data={tablelistrowdata}
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

export default Donation;