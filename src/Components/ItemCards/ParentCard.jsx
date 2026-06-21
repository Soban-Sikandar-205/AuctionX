import React from 'react';

function ParentCard({ children }) {
  return (
    <div className="container mx-auto p-4">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}

export default ParentCard;
