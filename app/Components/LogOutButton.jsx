'use client';
import { signOut } from 'next-auth/react';
import React from 'react';
import Swal from 'sweetalert2';

export default function LogOutButton() {
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have successfully logged out.',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
        }).then(() => signOut({ callbackUrl: '/' }));
      }
    });
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        onClick={handleLogout}
      >
        LogOut
      </button>
    </div>
  );
}
