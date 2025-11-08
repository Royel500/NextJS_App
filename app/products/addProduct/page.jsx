'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react';

export default function AddProducts() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
const [selectedCategoryDropdown, setSelectedCategoryDropdown] = useState('All')

  const { data: session, status } = useSession();
  const emaill = session?.user?.email;
  // const name = session?.user?.name;
  // const role = session?.user?.role;
  // const userId = session?.user?.id;

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty Products",
  "Sports & Outdoors",
  "Toys & Games",
  "Automotive",
  "Books & Stationery",
  "Health & Wellness",
  "Pet Supplies",
  "Jewelry & Accessories",
  "Groceries",
  "Furniture",
  "Baby Products",
  "Tools & Hardware"
];


  const [formData, setFormData] = useState({
    businessEmail : emaill,
    productName: '',
    productDescription: '',
    price: '',
    category: '',
    imageUrl: '',
    brand: '',
    stockQuantity: '',
    regularPrice: '',
    todayPrice: '',
    discountValue: '',
    discountType: 'percentage',
     totalSold: 0,
    sku: '',
    weight: '',
    dimensions: '',
     createdAt: new Date().toISOString(), 
    colors: '',
    sizes: '',
    tags: '',
    isFeatured: false,
    isActive: true,
    lowStockThreshold: '5'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire('File too large', 'Please select an image smaller than 10MB', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

const uploadImageToImgBB = async () => {
  if (!imageFile) return null;

  const form = new FormData();
  form.append('image', imageFile);

  try {
    const apiKey = process.env.NEXT_PUBLIC_PHOTO_KEY;

    if (!apiKey) {
      console.warn('No ImgBB API key found. Using placeholder image.');
      return 'https://i.postimg.cc/CK4zTp1b/The-Royel-s-Logo-img.jpg';
    }

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: form,
    });

    const data = await res.json();
    if (data.success) return data.data.url;

    throw new Error(data.error?.message || 'Image upload failed');
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Prioritize the manual URL input
    let imageUrl = formData.imageUrl?.trim();

    // If no URL provided, try uploading the selected file
    if (!imageUrl && imageFile) {
      try {
        imageUrl = await uploadImageToImgBB();
      } catch (uploadError) {
        const result = await Swal.fire({
          title: 'Image Upload Failed',
          text: 'Would you like to use the image URL instead?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Yes, use URL',
          cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed && formData.imageUrl) {
          imageUrl = formData.imageUrl;
        } else {
          throw new Error('Image upload cancelled');
        }
      }
    }

    // fallback placeholder if nothing provided
    if (!imageUrl) {
      imageUrl = 'https://i.ibb.co/NgmXvV1k/david-barros-fm-IXg-QUo-MZg-unsplash.jpg';
    }
const finalCategory = (selectedCategoryDropdown && selectedCategoryDropdown !== 'All')
  ? selectedCategoryDropdown
  : (formData.category || '').trim()
    const payload = { ...formData, category: finalCategory, imageUrl };

    const res = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Failed to save product');

    Swal.fire('Success!', 'Product added successfully!', 'success');

    // reset form
    // handleReset();
    // router.push('/products');
  } catch (error) {
    Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
  } finally {
    setIsLoading(false);
  }
};


  const handleReset = () => {
    setFormData({
      businessEmail : emaill,
      productName: '',
      productDescription: '',
      price: '',
      category: '',
      imageUrl: '',
      brand: '',
      stockQuantity: '',
      regularPrice: '',
      todayPrice: '',
      discountValue: '',
      discountType: 'percentage',
       totalSold: 0,
      sku: '',
      weight: '',
      dimensions: '',
      colors: '',
      sizes: '',
      tags: '',
      isFeatured: false,
      isActive: true,
      lowStockThreshold: '5'
    });
    setImagePreview(null);
    setImageFile(null);
    setUseFallback(false);
  };


  
  // Calculate discount percentage if both regular price and today's price are provided
  const calculateDiscount = () => {
    if (formData.regularPrice && formData.todayPrice) {
      const regular = parseFloat(formData.regularPrice);
      const today = parseFloat(formData.todayPrice);
      if (regular > today) {
        return Math.round(((regular - today) / regular) * 100);
      }
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();

  return (
  <div className='min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-10'>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="card shadow-2xl bg-white">
          <div className="card-body space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">Add a Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="label font-medium">Product Name *</label>
                  <input 
                    type="text" 
                    name="productName" 
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    placeholder="Enter product name" 
                    required 
                  />
                </div>

                <div>
                  <label className="label font-medium">Description *</label>
                  <textarea 
                    name="productDescription" 
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full" 
                    placeholder="Product description" 
                    required
                  ></textarea>
                </div>



  <div>
  <label className="label font-medium">Category *</label>

  {/* Dropdown — user can pick an existing category */}
  <select
    className="select select-bordered w-full mb-2"
    value={selectedCategoryDropdown}
    onChange={(e) => {
      const val = e.target.value
      setSelectedCategoryDropdown(val)

      // if user picks a dropdown value, clear manual category text to avoid conflict
      if (val !== 'All') {
        setFormData(prev => ({ ...prev, category: val }))
      } else {
        // if they pick 'All' (meaning no dropdown), keep manual value as is
        setFormData(prev => ({ ...prev, category: '' }))
      }
    }}
  >
    {/* keep 'All' or 'Select' as neutral option */}
    <option value="All">Select category (or type below)</option>
    {categories.filter(c => c !== 'All').map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>

  {/* Manual input — disabled when dropdown is used */}
  <input
    type="text"
    name="category"
    value={formData.category}
    onChange={(e) => {
      const v = e.target.value
      // manual typing clears dropdown selection (so manual wins)
      if (v && selectedCategoryDropdown !== 'All') {
        setSelectedCategoryDropdown('All')
      }
      setFormData(prev => ({ ...prev, category: v }))
    }}
    className="input input-bordered w-full"
    placeholder="Type a category (or pick above)"
    required
    disabled={selectedCategoryDropdown !== 'All' && !!selectedCategoryDropdown}
  />
  <p className="text-xs text-gray-500 mt-1">
    Choose from the dropdown or type a new category — only one is allowed.
  </p>
</div>


                <div>
                  <label className="label font-medium">Brand</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    placeholder="Brand name" 
                  />
                </div>

                <div>
                  <label className="label font-medium">SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    placeholder="Stock Keeping Unit" 
                  />
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Pricing & Stock</h3>
                
                <div>
                  <label className="label font-medium">Regular Price ($)</label>
                  <input 
                    type="number" 
                    name="regularPrice" 
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Original price" 
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="label font-medium">Today's Price ($) *</label>
                  <input 
                    type="number" 
                    name="todayPrice" 
                    value={formData.todayPrice}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Current selling price" 
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                {discountPercentage > 0 && (
                  <div className="bg-amber-100 p-2 rounded">
                    <span className="font-medium">Discount: {discountPercentage}% off</span>
                  </div>
                )}

                <div>
                  <label className="label font-medium">Stock Quantity *</label>
                  <input 
                    type="number" 
                    name="stockQuantity" 
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Available items" 
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="label font-medium">Low Stock Threshold</label>
                  <input 
                    type="number" 
                    name="lowStockThreshold" 
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Alert when stock reaches this level" 
                    min="1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="isFeatured" 
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary" 
                  />
                  <label className="label font-medium">Feature this product</label>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary" 
                  />
                  <label className="label font-medium">Product is active</label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Details</h3>
                
                <div>
                  <label className="label font-medium">Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Product weight" 
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="label font-medium">Dimensions (LxWxH)</label>
                  <input 
                    type="text" 
                    name="dimensions" 
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="e.g., 10x5x2" 
                  />
                </div>

                <div>
                  <label className="label font-medium">Available Colors</label>
                  <input 
                    type="text" 
                    name="colors" 
                    value={formData.colors}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Comma separated colors" 
                  />
                </div>

                <div>
                  <label className="label font-medium">Available Sizes</label>
                  <input 
                    type="text" 
                    name="sizes" 
                    value={formData.sizes}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Comma separated sizes" 
                  />
                </div>

                <div>
                  <label className="label font-medium">Tags</label>
                  <input 
                    type="text" 
                    name="tags" 
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Comma separated tags" 
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Product Image</h3>
                
                <div>
                  <label className="label font-medium">Upload Image</label>
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
                    name="imageUrl" 
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <label className="label font-medium">Image Preview</label>
                    <div className="border rounded p-2 flex justify-center">
                 {imagePreview && (
                <div className="mt-4">
                  <label className="label font-medium">Image Preview</label>
                  <div className="relative w-40 h-40 border rounded p-2 flex justify-center items-center bg-white">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

                    </div>
                  </div>
                )}
              </div>
            </div>

              <div className="flex gap-2 mt-6">
              <button type="submit" className="btn btn-primary flex-1" disabled={isLoading}>
                {isLoading ? <><span className="loading loading-spinner"></span> Adding...</> : 'Add Product'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isLoading}>Reset</button>
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