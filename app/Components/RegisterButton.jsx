'use client';
import Link from 'next/link';
import React from 'react';
import Swal from 'sweetalert2';

export default function RegisterButton() {
  const handleClick = (e) => {
    e.preventDefault(); // prevent default link immediately
    Swal.fire({
      title: 'Redirecting to Register!',
      icon: 'info',
      timer: 1000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = '/register'; // redirect after SweetAlert
    });
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
    >
      Register
    </button>
  );
}
