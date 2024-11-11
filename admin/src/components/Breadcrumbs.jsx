import Breadcrumb from 'react-bootstrap/Breadcrumb';

function Breadcrumbs() {
  return (
    <Breadcrumb className='m-0'>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item active>Blogs</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default Breadcrumbs;