'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Pencil, Trash2, View, Star, Zap, Clock } from 'lucide-react'
import Swal from 'sweetalert2'
import Link from 'next/link'
import Image from "next/image";
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'

export default function Page() {
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: search & filter state
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const { data: session } = useSession();

const fetchProducts = async () => {
  try {
    setLoading(true);
    const res = await fetch('/api/items', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();

    // ✅ Sort newest first (assuming product.createdAt exists)
    const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setProducts(sorted);
  } catch (err) {
    console.error('Error fetching products:', err);
    Swal.fire('Error', 'Failed to load products.', 'error');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  // build unique categories from products (including "All")
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.category && p.category.trim() !== '') set.add(p.category.trim());
    });
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  // debounce query so filtering isn't too aggressive
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // filtered products based on category + debounced query
  const filteredProducts = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return products.filter(p => {
      const inCategory = selectedCategory === 'All' || (p.category === selectedCategory);
      if (!inCategory) return false;
      if (!q) return true;
      // search in productName, brand, category, tags
      const fields = [
        p.productName || '',
        p.brand || '',
        p.category || '',
        p.tags || ''
      ].join(' ').toLowerCase();
      return fields.includes(q);
    });
  }, [products, selectedCategory, debouncedQuery]);

  // suggestions for autocomplete (based on typed query, ignore category)
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(p => (p.productName || '').toLowerCase().includes(q))
      .slice(0, 6); // limit suggestions
  }, [products, query]);

  // close suggestions when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/items/${id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success')
          fetchProducts()
        } else {
          throw new Error('Delete failed')
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error')
      }
    }
  }

  const handleEditClick = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const updatedProduct = {
      productName: form.productName.value,
      productDescription: form.productDescription.value,
      price: parseFloat(form.regularPrice.value),
      category: form.category.value,
      imageUrl: form.imageUrl.value,
      regularPrice: parseFloat(form.regularPrice.value) || 0,
      todayPrice: parseFloat(form.todayPrice.value) || parseFloat(form.price.value),
      stockQuantity: parseInt(form.stockQuantity.value) || 0,
      brand: form.brand.value,
      sku: form.sku.value,
    }

    try {
      const res = await fetch(`/api/items/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });

      const data = await res.json();
      console.log("API response status:", res.status);
      console.log("API response data:", data);

      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }

      if (data && Object.keys(data).length > 0) {
        await Swal.fire({
          title: 'Updated!',
          text: 'Product updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        await Swal.fire({
          title: 'No Changes',
          text: 'No modifications were made to the product.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }

      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();

    } catch (error) {
      console.error(error)
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update product.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    }
  }

  const calculateDiscount = (regularPrice, todayPrice) => {
    const regular = parseFloat(regularPrice) || 0;
    const today = parseFloat(todayPrice) || 0;
    if (!regular || regular <= today) return 0;
    return Math.round(((regular - today) / regular) * 100);
  }

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    try {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      return createdDate > sevenDaysAgo;
    } catch (error) {
      console.error('Error parsing date:', createdAt, error);
      return false;
    }
  }

  const isLowStock = (stockQuantity) => {
    return stockQuantity > 0 && stockQuantity <= 5;
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

      {/* SEARCH + CATEGORY FILTER BAR */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1" ref={suggestionsRef}>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              type="search"
              placeholder="Search products, brands, tags..."
              className="input input-bordered w-full"
              aria-label="Search products"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-md shadow max-h-60 overflow-auto">
                {suggestions.map(s => (
                  <li
                    key={s._id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // navigate to product page
                      window.location.href = `/products/${s._id}`;
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.imageUrl || '/placeholder.jpg'} alt={s.productName} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <div className="font-semibold text-sm">{s.productName}</div>
                        <div className="text-xs text-gray-500">{s.brand || s.category}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Category select */}
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full"
              aria-label="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          <div className="flex gap-2">
            <button
              className="btn btn-outline"
              onClick={() => { setQuery(''); setSelectedCategory('All'); setShowSuggestions(false); }}
            >
              Clear
            </button>
            <div className="px-3 py-2 text-sm text-gray-600 flex items-center">
              <span className="font-medium mr-2">Results:</span> {filteredProducts.length}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">No products found.</p>
          <Link href="/products/addProduct" className="btn btn-primary mt-4">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
         xl:grid-cols-4 mx-auto">
          {filteredProducts.map((item) => {
            const discountPercent = calculateDiscount(item?.regularPrice, item?.todayPrice || item.price);
            const isNew = isNewProduct(item?.createdAt);
            const lowStock = isLowStock(item?.stockQuantity);

            return (
              <div key={item?._id} className="card bg-white shadow-xl relative group hover:shadow-2xl transition-all duration-300">
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white font-bold py-1 px-3 rounded-full z-10">
                    {discountPercent}% OFF
                  </div>
                )}

                {isNew && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded-full z-10 flex items-center">
                    <Zap size={12} className="mr-1" /> NEW
                  </div>
                )}

                {lowStock && (
                  <div className="absolute top-12 left-2 bg-amber-500 text-white font-bold py-1 px-2 rounded-full z-10 flex items-center">
                    <Clock size={14} className="mr-1" /> Low Stock
                  </div>
                )}

                <figure className="relative">
                  <img
                    src={item?.imageUrl || "https://i.ibb.co/NgmXvV1k/david-barros-fm-IXg-QUo-MZg-unsplash.jpg"}
                    alt={item?.productName}
                    className="h-60 min-w-75 transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-xl bg-red-500 px-4 py-2 rounded">OUT OF STOCK</span>
                    </div>
                  )}
                </figure>

                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title">{item.productName}</h2>
                    {item.isFeatured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>

                  {item.brand && (
                    <p className="text-sm font-bold text-gray-500">Brand: {item.brand}</p>
                  )}

                  <p className="line-clamp-2 text-gray-600">{item.productDescription}</p>

                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      {item.regularPrice > (item.todayPrice || item.price) ? (
                        <>
                          <span className="text-2xl font-bold text-green-700">
                            ${parseFloat(item.todayPrice || item.price)}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${parseFloat(item.regularPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">
                          ${parseFloat(item.todayPrice || item.price)}
                        </span>
                      )}
                    </div>

                    <div className='flex justify-between'>
                      <p>
                        {item.stockQuantity > 0 && (
                          <h5 className="text-sm text-gray-500 mt-1">In stock: {item.stockQuantity}</h5>
                        )}
                      </p>
                      <p>Total Sold :{item.totalSold || 0}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-primary">{item.category || 'Uncategorized'}</span>
                    {item.tags && item.tags.split(',').map((tag, index) => (
                      <span key={index} className="badge badge-outline">{tag.trim()}</span>
                    ))}
                  </div>
                </div>

         {/* action buttons: View always shown; Edit/Delete only for owner or admin */}
<div className="absolute top-8 right-2 flex flex-col space-y-2 transition">
  <Link href={`products/${item._id}`}>
    <button className="btn btn-sm btn-circle bg-blue-100 hover:bg-blue-200" title="View">
      <View className="w-4 h-4 text-blue-600" />
    </button>
  </Link>

  { /* compute permissions: owner OR admin */ }
  { session && (session.user?.email === item.businessEmail || session.user?.role === 'admin') && (
    <>
      <button
        onClick={() => handleEditClick(item)}
        className="btn btn-sm btn-circle bg-blue-100 hover:bg-blue-200"
        title="Edit"
      >
        <Pencil className="w-4 h-4 text-blue-600" />
      </button>
      <button
        onClick={() => handleDelete(item._id)}
        className="btn btn-sm btn-circle bg-red-100 hover:bg-red-200"
        title="Delete"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    </>
  )}
</div>

              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal (unchanged) */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Product Name</label>
                  <input 
                    name="productName" 
                    defaultValue={editingProduct.productName} 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Brand</label>
                  <input 
                    name="brand" 
                    defaultValue={editingProduct.brand || ''} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div>
                  <label className="label">Regular Price ($)</label>
                  <input 
                    name="regularPrice" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingProduct.regularPrice || ''} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div>
                  <label className="label">Today's Price ($)</label>
                  <input 
                    name="todayPrice" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingProduct.todayPrice || editingProduct.price} 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Stock Quantity</label>
                  <input 
                    name="stockQuantity" 
                    type="number" 
                    defaultValue={editingProduct.stockQuantity || 0} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input 
                    name="sku" 
                    defaultValue={editingProduct.sku || ''} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea 
                    name="productDescription" 
                    defaultValue={editingProduct.productDescription} 
                    className="textarea textarea-bordered w-full" 
                    required 
                    rows="3"
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input 
                    name="category" 
                    defaultValue={editingProduct.category} 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input 
                    name="imageUrl" 
                    defaultValue={editingProduct.imageUrl} 
                    className="input input-bordered w-full" 
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="submit" className="btn btn-success">Update Product</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
