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
  const [formData, setFormData] = useState({
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
        setFormData({
          productName: product.productName || '',
          productDescription: product.productDescription || '',
          price: product.price || '',
          category: product.category || '',
          imageUrl: product.imageUrl || '',
          brand: product.brand || '',
          stockQuantity: product.stockQuantity || '',
          regularPrice: product.regularPrice || '',
          todayPrice: product.todayPrice || '',
          discountValue: product.discountValue || '',
          discountType: product.discountType || 'percentage',
          sku: product.sku || '',
          weight: product.weight || '',
          dimensions: product.dimensions || '',
          colors: product.colors || '',
          sizes: product.sizes || '',
          tags: product.tags || '',
          isFeatured: product.isFeatured || false,
          isActive: product.isActive !== undefined ? product.isActive : true,
          lowStockThreshold: product.lowStockThreshold || '5'
        });
        
        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

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
    
    try {
      let imageUrl = formData.imageUrl || '';
      
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

      const payload = { ...formData, imageUrl };
      
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
            setFormData({
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
    setFormData({
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
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {isEditMode ? 'Edit Product' : 'Add a Product'}
            </h2>

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
                  <input 
                    type="text" 
                    name="category" 
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    placeholder="e.g., Electronics, Clothing" 
                    required 
                  />
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
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="max-h-40 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
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