import React, { useState } from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from 'react-bootstrap/esm/Container'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'

const Members = () => {
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'First Name',
            selector: row => row.firstname,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: row => row.lastname,
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
    const data = [
        {
            id: 1,
            firstname: 'arif',
            lastname: 'fdfsd',
            email: 'sdfghjk',
            mobile: 'dfghdjfdigjdfoigjdiofgbjdf',
            type: '26 march 2024',
            action: <>
                <Link className='btn btn-primary btn-sm' to="edit-member">Edit</Link>
                <Link className='btn btn-outline-danger btn-sm' to="/">Delete</Link>
            </>
        },
    ]

    const [records, setRecords]=useState(data);

    function handleFilter(event) {
        const newData = data.filter(row=> {
            return row.firstname.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setRecords(newData)
    }

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
                        <div className="d-flex justify-content-between mb-3">
                            <Link className='btn btn-primary' to="/add-member">Add Member</Link>
                            <input type="text" onChange={handleFilter} />
                        </div>
                        <DataTable
                            columns={columns}
                            data={records}
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

export default Members