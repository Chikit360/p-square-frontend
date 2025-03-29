import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="text-gray-600 text-sm mb-4">
      <Link to="/" className="text-blue-500">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={to} className="inline-flex items-center">
            <span className="mx-2"><ChevronRightIcon className='text-[10px]'/></span>
            {isLast ? (
              <span className="text-gray-500">{value}</span>
            ) : (
              <Link to={to} className="text-blue-500">{value}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
