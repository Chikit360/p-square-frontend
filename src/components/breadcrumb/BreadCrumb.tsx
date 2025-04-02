import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRightIcon } from '../../icons';

// Import route definitions
import { authRoutes, protectedRoutes } from '../../constants/route'; // Update the path as needed

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Combine authRoutes and protectedRoutes into a single array for easy checking
  const allRoutes = [...authRoutes, ...protectedRoutes];

  // Function to check if the route exists
  const routeExists = (path: string) => {
    return allRoutes.some(route => route.path === path);
  };

  // Function to check if a route contains a dynamic segment like ":id"
  const hasDynamicSegment = (routePath: string) => {
    console.log("routePath",routePath)
    return /:[a-zA-Z0-9]+/.test(routePath); // Regex to check for :id pattern
  };

  return (
    <nav className="text-gray-600 text-sm mb-4">
      <Link to="/" className="text-blue-500">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const isValidRoute = routeExists(to); // Check if the route exists
        const currentRoute = allRoutes.find(route => to === route.path);
        
        // Check if the current route contains a dynamic segment (like /:id)
        const isDynamic = currentRoute ? hasDynamicSegment(currentRoute.path) : false;
        console.log(currentRoute, isDynamic)

        return (
          <span key={to} className="inline-flex items-center capitalize">
            <span className="mx-2"><ChevronRightIcon className='text-[10px]' /></span>
            {isLast ? (
              <span className={`text-gray-500 ${!isValidRoute ? 'text-gray-400' : ''}`}>
                {isDynamic ? 'ID' : value} {/* Hide ID for dynamic segments */}
              </span>
            ) : (
              isValidRoute ? (
                <Link to={to} className="text-blue-500">
                  {isDynamic ? 'ID' : value} {/* Hide ID for dynamic segments */}
                </Link>
              ) : (
                <span className="text-gray-400">{isDynamic ? 'ID' : value}</span> 
              )
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
