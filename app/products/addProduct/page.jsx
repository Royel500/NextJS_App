'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function AddProducts({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  // Check if we're in edit mode
  useEffect(() => {
    if (params && params.id) {
      setIsEditMode(true);
      setProductId(params.id);
      // Fetch product data for editing
      fetchProductData(params.id);
    }
  }, [params]);

  const fetchProductData = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/iteams/${id}`);
      if (res.ok) {
        const product = await res.json();
        // Pre-fill form with product data
        document.querySelector('input[name="productName"]').value = product.productName || '';
        document.querySelector('textarea[name="productDescription"]').value = product.productDescription || '';
        document.querySelector('input[name="price"]').value = product.price || '';
        document.querySelector('input[name="category"]').value = product.category || '';
        document.querySelector('input[name="imageUrl"]').value = product.imageUrl || '';
        
        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: 'File too large',
          text: 'Please select an image smaller than 10MB',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async () => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey || apiKey === 'test-key-not-configured') {
        // Simulate upload for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'https://via.placeholder.com/300x300?text=Upload+Demo+Image';
      }
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.target;
    const productName = form.productName.value;
    const productDescription = form.productDescription.value;
    const price = form.price.value;
    const category = form.category.value;
    
    try {
      let imageUrl = form.imageUrl.value || '';
      
      // Try to upload image if a new file was selected
      if (imageFile && !useFallback) {
        try {
          imageUrl = await uploadImageToImgBB();
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          
          // Ask user if they want to use the URL fallback
          const result = await Swal.fire({
            title: 'Image Upload Failed',
            text: 'Would you like to use the image URL instead?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Yes, use URL',
            cancelButtonText: 'Cancel'
          });
          
          if (result.isConfirmed) {
            setUseFallback(true);
            setIsLoading(false);
            return;
          } else {
            throw new Error('Image upload cancelled');
          }
        }
      }

      const payload = { productName, productDescription, price, category, imageUrl };
      
      let res;
      if (isEditMode) {
        // Use PATCH method for editing
        res = await fetch(`http://localhost:3000/api/iteams/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          },
        });
      } else {
        // Use POST method for adding new product
        res = await fetch("http://localhost:3000/api/iteams", {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }

      if (res.ok) {
        // Fetch the updated products list
        const productsRes = await fetch("http://localhost:3000/api/iteams");
        const products = await productsRes.json();

        if (products.length >= 3 && !isEditMode) {
          await Swal.fire({
            title: 'Congrats!',
            text: 'You have successfully added 3 or more products!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          router.push('/');
        } else {
          await Swal.fire({
            title: isEditMode ? 'Updated!' : 'Success!',
            text: isEditMode ? 'Product updated successfully!' : 'Product added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          
          if (!isEditMode) {
            form.reset();
            setImagePreview(null);
          }
          
          router.push('/products');
        }
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const form = document.querySelector('form');
    form.reset();
    setImagePreview(null);
    setImageFile(null);
    setUseFallback(false);
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-10'>
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="card shadow-2xl bg-white">
          <div className="card-body space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {isEditMode ? 'Edit Product' : 'Add a Product'}
            </h2>

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
              <label className="label font-medium">Product Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="file-input file-input-bordered w-full" 
                disabled={useFallback}
              />
          
            </div>

            <div>
              <label className="label font-medium">Or Image URL</label>
              <input 
                type="url" 
                name='imageUrl' 
                className="input input-bordered w-full" 
                placeholder="https://example.com/image.jpg" 
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditMode ? 'Update Product' : 'Add Product'
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </button>
            </div> 

            <div className="text-center text-sm text-gray-500">
              <p>Note: Image upload requires a valid ImgBB API key.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}