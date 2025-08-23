'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import Swal from 'sweetalert2'

export default function AddProducts() {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const productName = form.productName.value;
    const productDescription = form.productDescription.value;
    const price = form.price.value;
    const category = form.category.value;
    const imageUrl = form.imageUrl.value;

    const payload = { productName, productDescription, price, category, imageUrl };
       const res = await fetch("http://localhost:3000/api/iteams", {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
    // Fetch the updated products list
    const productsRes = await fetch("http://localhost:3000/api/iteams");
    const products = await productsRes.json();

    if (products.length >= 3) {
      await Swal.fire({
        title: 'Congrats!',
        text: 'You have successfully added 3 or more products!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      router.push('/');
    } else {
      await Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      form.reset();
      router.push('/products');
    }
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-10'>
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="card shadow-2xl bg-white">
          <div className="card-body space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">Add a Product</h2>

            <div>
              <label className="label font-medium">Product Name</label>
              <input type="text" name='productName' className="input input-bordered w-full" placeholder="Enter product name" required />
            </div>

            <div>
              <label className="label font-medium">Description</label>
              <textarea name='productDescription' className="textarea textarea-bordered w-full" placeholder="Product description" required></textarea>
            </div>

            <div>
              <label className="label font-medium">Price ($)</label>
              <input type="number" name='price' className="input input-bordered w-full" placeholder="Enter price" required />
            </div>

            <div>
              <label className="label font-medium">Category</label>
              <input type="text" name='category' className="input input-bordered w-full" placeholder="e.g., Electronics, Clothing" required />
            </div>

            <div>
              <label className="label font-medium">Image URL</label>
              <input type="url" name='imageUrl' className="input input-bordered w-full" placeholder="https://example.com/image.jpg" />
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-full">Add Product</button>
            </div> 
          </div>
        </form>
      </div>
    </div>
  )
}
