import React from 'react';

const loading = () => {
    return (
           <div className="flex justify-center items-center h-screen bg-white">
          <span className="loading loading-bars loading-md"></span>
<span className="loading loading-bars loading-lg"></span>
<span className="loading loading-bars loading-xl"></span>
        </div>
    );
};

export default loading;