import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';

function Breadcrumbs({ pageName, pageName1 }) {
  return (
    <Breadcrumb className="m-0">
      <Breadcrumb.Item><Link to="/dashboard">Home</Link></Breadcrumb.Item>
      {pageName && (
        <Breadcrumb.Item className="text-capitalize">
          <Link to={pageName1 ? `/${pageName}` : '#'}>{pageName}</Link>
        </Breadcrumb.Item>
      )}
      {pageName1 && <Breadcrumb.Item active>{pageName1}</Breadcrumb.Item>}
    </Breadcrumb>
  );
}

export default Breadcrumbs;
