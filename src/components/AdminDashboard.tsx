import React from 'react';
import { 
  Sliders, Plus, Edit2, Trash2, CheckCircle, Clock, Search, Tag, 
  AlertCircle, DollarSign, Package, MessageSquare, PlusCircle, ArrowLeft, Save, X 
} from 'lucide-react';
import { Product, Category, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  onAddProduct: (prod: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (cat: Omit<Category, 'id' | 'slug'>) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
}

export default function AdminDashboard({
  products,
  categories,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateOrderStatus,
  onDeleteOrder
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'products' | 'categories' | 'inquiries'>('products');
  const [productSearch, setProductSearch] = React.useState('');
  const [inquirySearch, setInquirySearch] = React.useState('');

  // Editing or adding states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  // New product form inputs
  const [formName, setFormName] = React.useState('');
  const [formBrand, setFormBrand] = React.useState('');
  const [formDesc, setFormDesc] = React.useState('');
  const [formPrice, setFormPrice] = React.useState(0);
  const [formOrigPrice, setFormOrigPrice] = React.useState(0);
  const [formCategory, setFormCategory] = React.useState('');
  const [formSizes, setFormSizes] = React.useState<string[]>(['S', 'M', 'L']);
  const [formColors, setFormColors] = React.useState<string[]>(['Standard']);
  const [formInventory, setFormInventory] = React.useState(10);
  const [formFeatured, setFormFeatured] = React.useState(false);
  const [formImages, setFormImages] = React.useState<string[]>([
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
  ]);
  const [formTags, setFormTags] = React.useState<string[]>([]);

  // Persistent Saved Uploads State
  const [savedUploadedImages, setSavedUploadedImages] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ethioshein_uploaded_images_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveToUploadedLibrary = (imgUrl: string) => {
    if (!imgUrl) return;
    setSavedUploadedImages((prev) => {
      if (prev.includes(imgUrl)) return prev;
      const updated = [imgUrl, ...prev];
      try {
        localStorage.setItem('ethioshein_uploaded_images_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to store in localStorage', e);
      }
      return updated;
    });
  };

  const removeFromUploadedLibrary = (imgUrl: string) => {
    setSavedUploadedImages((prev) => {
      const updated = prev.filter(i => i !== imgUrl);
      try {
        localStorage.setItem('ethioshein_uploaded_images_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to store in localStorage', e);
      }
      return updated;
    });
  };

  // Combine saved uploads and product catalog images into a unified Media Library
  const catalogMediaLibrary = React.useMemo(() => {
    const list: string[] = [...savedUploadedImages];
    products.forEach(p => {
      p.images.forEach(img => {
        if (!list.includes(img)) list.push(img);
      });
    });
    return list;
  }, [savedUploadedImages, products]);

  // Category addition state
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatDesc, setNewCatDesc] = React.useState('');
  const [newCatImage, setNewCatImage] = React.useState('https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400');

  // Input lists temporary strings
  const [sizeInput, setSizeInput] = React.useState('');
  const [colorInput, setColorInput] = React.useState('');
  const [imageInput, setImageInput] = React.useState('');
  const [tagInput, setTagInput] = React.useState('');

  // Calculated Stats Metrics
  const lowStockProducts = products.filter(p => p.inventory <= 4);
  const totalSimulatedRevenue = orders
    .filter(o => o.status === 'completed' || o.status === 'contacted')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  // Load editing product info
  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormDesc(prod.description);
    setFormPrice(prod.price);
    setFormOrigPrice(prod.originalPrice || 0);
    setFormCategory(prod.categoryId);
    setFormSizes(prod.sizes);
    setFormColors(prod.colors);
    setFormInventory(prod.inventory);
    setFormFeatured(prod.featured);
    setFormImages(prod.images);
    setFormTags(prod.tags);
    setIsFormOpen(true);
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('EthioShein');
    setFormDesc('');
    setFormPrice(1500);
    setFormOrigPrice(0);
    setFormCategory(categories[0]?.id || '');
    setFormSizes(['S', 'M', 'L']);
    setFormColors(['Off-White', 'Classic Black']);
    setFormInventory(10);
    setFormFeatured(false);
    setFormImages([
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80'
    ]);
    setFormTags(['Trendy']);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCategory || formPrice <= 0) {
      alert('Please fill out required fields.');
      return;
    }

    const payload = {
      name: formName,
      brand: formBrand,
      description: formDesc,
      price: formPrice,
      originalPrice: formOrigPrice > 0 ? formOrigPrice : undefined,
      categoryId: formCategory,
      sizes: formSizes,
      colors: formColors,
      inventory: formInventory,
      featured: formFeatured,
      images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800'],
      tags: formTags,
      rating: 5.0,
      reviewsCount: 0
    };

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...payload
      });
    } else {
      onAddProduct(payload);
    }

    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddCategory({
      name: newCatName,
      description: newCatDesc,
      image: newCatImage
    });

    setNewCatName('');
    setNewCatDesc('');
  };

  // List management helpers
  const handleAddListItem = (
    type: 'sizes' | 'colors' | 'images' | 'tags',
    val: string,
    setVal: (v: string) => void
  ) => {
    if (!val.trim()) return;
    if (type === 'sizes' && !formSizes.includes(val)) setFormSizes([...formSizes, val]);
    if (type === 'colors' && !formColors.includes(val)) setFormColors([...formColors, val]);
    if (type === 'images' && !formImages.includes(val)) setFormImages([...formImages, val]);
    if (type === 'tags' && !formTags.includes(val)) setFormTags([...formTags, val]);
    setVal('');
  };

  const handleRemoveListItem = (
    type: 'sizes' | 'colors' | 'images' | 'tags',
    index: number
  ) => {
    if (type === 'sizes') setFormSizes(formSizes.filter((_, i) => i !== index));
    if (type === 'colors') setFormColors(formColors.filter((_, i) => i !== index));
    if (type === 'images') setFormImages(formImages.filter((_, i) => i !== index));
    if (type === 'tags') setFormTags(formTags.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-portal">
      
      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-ivory-dark pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-fraunces font-bold text-espresso">EthioShein Admin Panel</h1>
          <p className="text-sm text-espresso-soft mt-1">Manage products, categories, stock, and live customer messaging inquiries.</p>
        </div>
        <div className="flex space-x-2">
          {!isFormOpen && activeTab === 'products' && (
            <button
              onClick={handleOpenAddForm}
              className="bg-espresso hover:bg-terracotta text-ivory font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
              id="admin-add-product-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI METRICS SHELF */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="admin-kpis">
        <div className="bg-white p-5 rounded-2xl border border-ivory-dark shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-ochre-soft text-espresso rounded-xl">
            <Package className="w-6 h-6 text-espresso" />
          </div>
          <div>
            <span className="text-[10px] text-espresso-soft font-bold uppercase tracking-widest block">Products</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-espresso">{products.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-dark shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-terracotta/10 text-terracotta rounded-xl">
            <AlertCircle className="w-6 h-6 text-terracotta animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-espresso-soft font-bold uppercase tracking-widest block">Low Stock</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-terracotta">
              {lowStockProducts.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-dark shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-ochre/10 text-ochre rounded-xl">
            <MessageSquare className="w-6 h-6 text-espresso" />
          </div>
          <div>
            <span className="text-[10px] text-espresso-soft font-bold uppercase tracking-widest block">Inquiries Logged</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-espresso">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-dark shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-forest/10 text-forest rounded-xl">
            <DollarSign className="w-6 h-6 text-forest" />
          </div>
          <div>
            <span className="text-[10px] text-espresso-soft font-bold uppercase tracking-widest block">Simulated Sales</span>
            <span className="text-lg sm:text-xl font-mono font-bold text-forest">{totalSimulatedRevenue.toLocaleString()} ETB</span>
          </div>
        </div>
      </div>

      {/* ADMIN EDITING FORM OVERLAY CARD */}
      {isFormOpen ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 mb-8 animate-scaleUp" id="product-form-stage">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-black text-black">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Fashion Item'}
            </h3>
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
              className="text-gray-400 hover:text-black hover:bg-gray-50 p-1.5 rounded-lg border border-transparent transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Field 1: Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Product Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Traditional Golden Netela"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              {/* Field 2: Brand */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Brand Name</label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="e.g. Shiro Meda Elite"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Field 3: Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Classification Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden"
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Field 4: Inventory */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Stock Inventory Count *</label>
                <input
                  type="number"
                  value={formInventory}
                  onChange={(e) => setFormInventory(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden"
                  min="0"
                  required
                />
              </div>

              {/* Field 5: Sale Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Sales Price (ETB) *</label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden animate-pulse"
                  min="1"
                  required
                />
              </div>

              {/* Field 6: Original/Compare Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Compare Price (ETB - Leave 0 for no discount)</label>
                <input
                  type="number"
                  value={formOrigPrice}
                  onChange={(e) => setFormOrigPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden"
                  min="0"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Item Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                placeholder="Write catalog material details, washing guides, local delivery features..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-hidden"
              ></textarea>
            </div>

            {/* Lists Management Forms (Sizes, Colors, Images, Tags) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
              
              {/* Sizes list builder */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Available Sizes</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder="Add e.g. M, L, XL, 39, 40"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddListItem('sizes', sizeInput, setSizeInput)}
                    className="bg-black hover:bg-gray-800 text-white px-3.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formSizes.map((s, idx) => (
                    <span key={s} className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center space-x-1 border border-gray-200">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveListItem('sizes', idx)} className="text-red-500 font-bold hover:text-red-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors list builder */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Available Colors</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="Add e.g. Cream White, Gold, Jet Black"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddListItem('colors', colorInput, setColorInput)}
                    className="bg-black hover:bg-gray-800 text-white px-3.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formColors.map((c, idx) => (
                    <span key={c} className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center space-x-1 border border-gray-200">
                      <span>{c}</span>
                      <button type="button" onClick={() => handleRemoveListItem('colors', idx)} className="text-red-500 font-bold hover:text-red-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images URL builder */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 block">Product Images (URLs or Local Files)</label>
                
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Add Unsplash image URL..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageInput.trim()) {
                        const url = imageInput.trim();
                        if (!formImages.includes(url)) {
                          setFormImages([...formImages, url]);
                        }
                        saveToUploadedLibrary(url);
                        setImageInput('');
                      }
                    }}
                    className="bg-black hover:bg-gray-800 text-white px-3.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                  >
                    Add URL
                  </button>
                </div>

                {/* Local File Selector */}
                <div className="flex items-center justify-between border border-dashed border-gray-250 rounded-xl p-3 bg-gray-50 hover:bg-gray-100/50 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-700 block">Upload from local computer</span>
                    <span className="text-[10px] text-gray-400 block">Supports JPEG, PNG, WEBP (Max 2MB, saved locally)</span>
                  </div>
                  <label className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer shadow-xs shrink-0 transition-all">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert('Image is too large. Please select an image under 2MB.');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              const dataUrl = reader.result;
                              setFormImages(prev => prev.includes(dataUrl) ? prev : [...prev, dataUrl]);
                              saveToUploadedLibrary(dataUrl);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Media Library / Uploaded Images Quick Selector */}
                {catalogMediaLibrary.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">Uploaded & Library Images ({catalogMediaLibrary.length})</span>
                      <span className="text-[10px] text-gray-400">Click thumbnail to add/remove</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50/50">
                      {catalogMediaLibrary.map((img, idx) => {
                        const isSelected = formImages.includes(img);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isSelected) {
                                setFormImages(formImages.filter(i => i !== img));
                              } else {
                                setFormImages([...formImages, img]);
                              }
                            }}
                            className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              isSelected ? 'border-black ring-2 ring-black/20' : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                            }`}
                            title={isSelected ? 'Click to remove from product' : 'Click to add to product'}
                          >
                            <img src={img} alt={`Library ${idx}`} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-black text-white p-0.5 rounded-full shadow-xs">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Current Selected Product Images List */}
                <div className="space-y-1.5 max-h-28 overflow-y-auto pt-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Selected Images for Product ({formImages.length})</span>
                  {formImages.map((img, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-150 p-1.5 rounded-lg text-xs font-mono text-gray-500 space-x-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img src={img} alt="" className="w-6 h-6 rounded object-cover shrink-0 border border-gray-200" />
                        <span className="truncate max-w-xs">{img}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveListItem('images', idx)} className="text-red-500 hover:text-red-700 font-bold px-2 cursor-pointer">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags builder */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Catalog tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add e.g. Wedding, Traditional, Chiffon"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddListItem('tags', tagInput, setTagInput)}
                    className="bg-black hover:bg-gray-800 text-white px-3.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formTags.map((t, idx) => (
                    <span key={t} className="bg-gray-50 text-gray-600 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm border border-gray-100 flex items-center space-x-1">
                      <span>{t}</span>
                      <button type="button" onClick={() => handleRemoveListItem('tags', idx)} className="text-red-500 hover:text-red-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="w-4.5 h-4.5 text-black focus:ring-0 rounded-sm border-gray-300"
                id="form-is-featured"
              />
              <label htmlFor="form-is-featured" className="text-xs font-bold text-gray-700 cursor-pointer">
                Feature on Homepage Slider Carousel
              </label>
            </div>

            {/* Action footer */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-150 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* STANDARD TABBED CONSOLE PANELS */
        <div className="bg-white rounded-3xl border border-ivory-dark shadow-xs overflow-hidden" id="admin-main-stage">
          
          {/* Tabs Menu bar */}
          <div className="bg-ivory/60 border-b border-ivory-dark px-6 py-1 flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-espresso-soft hover:text-espresso'
              }`}
            >
              Catalog Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-espresso-soft hover:text-espresso'
              }`}
            >
              Categories & Brands ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`py-4 px-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-espresso-soft hover:text-espresso'
              }`}
            >
              Inquiry Inbox ({orders.length})
            </button>
          </div>

          {/* TAB CONTENT BLOCK */}
          <div className="p-6">
            
            {/* TAB A: PRODUCTS CATALOG LIST */}
            {activeTab === 'products' && (
              <div className="space-y-6" id="panel-products">
                {/* Search / Filter Strip */}
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search catalog items..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                  <div className="absolute right-3.5 top-3 text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <th className="p-4">Item Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {products
                        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50/50" id={`admin-prod-row-${prod.id}`}>
                            {/* Image & Title */}
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-150">
                                  <img src={prod.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-gray-900 truncate max-w-xs">{prod.name}</h5>
                                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{prod.brand}</span>
                                </div>
                              </div>
                            </td>
                            {/* Category name */}
                            <td className="p-4">
                              <span className="text-xs bg-gray-100 border border-gray-150 text-gray-600 px-2 py-1 rounded-md font-medium">
                                {categories.find(c => c.id === prod.categoryId)?.name || prod.categoryId}
                              </span>
                            </td>
                            {/* Stock Indicator */}
                            <td className="p-4">
                              {prod.inventory === 0 ? (
                                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">Out of Stock</span>
                              ) : prod.inventory <= 4 ? (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                                  Low Stock ({prod.inventory})
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-gray-600 font-mono">
                                  {prod.inventory} Units
                                </span>
                              )}
                            </td>
                            {/* Price */}
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-mono font-bold text-black">{prod.price.toLocaleString()} ETB</span>
                                {prod.originalPrice && (
                                  <span className="font-mono text-[10px] text-gray-400 line-through">{prod.originalPrice.toLocaleString()} ETB</span>
                                )}
                              </div>
                            </td>
                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditClick(prod)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-black rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                      onDeleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB B: CATEGORIES & BRANDS */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="panel-categories">
                
                {/* Addition Form Block */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-black text-black text-sm uppercase tracking-wider mb-4">Add Classification Category</h4>
                  <form onSubmit={handleAddCategorySubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Category Title *</label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Traditional Jewelry"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-black"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700">Display Image URL or File</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newCatImage}
                          onChange={(e) => setNewCatImage(e.target.value)}
                          placeholder="Paste Image URL..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                        />
                        <div className="flex items-center justify-between border border-dashed border-gray-200 rounded-xl p-2.5 bg-white">
                          <span className="text-[11px] font-medium text-gray-500">Upload local image</span>
                          <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                            <span>Browse File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    alert('Image is too large. Please select an image under 2MB.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      const dataUrl = reader.result;
                                      setNewCatImage(dataUrl);
                                      saveToUploadedLibrary(dataUrl);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Short description</label>
                      <textarea
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        rows={2}
                        placeholder="Describe the fashion collection..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Save Category
                    </button>
                  </form>
                </div>

                {/* List block */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">Active Category Classifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center space-x-3 shadow-xs justify-between group">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-150">
                            <img src={cat.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-gray-900 truncate text-sm">{cat.name}</h5>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{cat.description}</p>
                          </div>
                        </div>

                        {/* Prevent deleting base seed categories for safety */}
                        {categories.length > 3 && (
                          <button
                            onClick={() => {
                              if(confirm(`Delete category "${cat.name}"? Products inside will lose classification.`)) {
                                onDeleteCategory(cat.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB C: INQUIRIES & LOGGED ORDERS */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6" id="panel-inquiries">
                
                {/* Search Bar */}
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search logs by customer name or phone..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                  <div className="absolute right-3.5 top-3 text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                </div>

                {/* Inquiry cards list */}
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border border-dashed border-gray-250 rounded-2xl">
                      No customer checkout inquiries have been logged yet.
                    </div>
                  ) : (
                    orders
                      .filter(o => o.customerName.toLowerCase().includes(inquirySearch.toLowerCase()) || o.customerPhone.includes(inquirySearch))
                      .map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs hover:border-gray-300 transition-all space-y-4"
                          id={`inquiry-card-${order.id}`}
                        >
                          {/* Card Header Info */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-50 pb-3 gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-black text-sm bg-gray-100 text-black px-2.5 py-1 rounded-md">
                                {order.id}
                              </span>
                              <span className="text-xs text-gray-400 font-mono">
                                {new Date(order.date).toLocaleString()}
                              </span>
                            </div>

                            {/* Action selector status */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-1">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-hidden cursor-pointer ${
                                  order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  order.status === 'contacted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                  'bg-gray-50 text-gray-500 border-gray-200'
                                }`}
                              >
                                <option value="pending">Pending Review</option>
                                <option value="contacted">Customer Contacted</option>
                                <option value="completed">Delivery Completed</option>
                                <option value="canceled">Canceled</option>
                              </select>

                              {/* Delete log */}
                              <button
                                onClick={() => {
                                  if (confirm('Permanently delete this order record?')) {
                                    onDeleteOrder(order.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                title="Delete Log Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Customer Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Customer Name</span>
                              <span className="text-sm font-bold text-black">{order.customerName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Phone Contact</span>
                              <a 
                                href={`tel:${order.customerPhone}`}
                                className="text-sm font-bold text-sky-600 hover:underline flex items-center space-x-1"
                              >
                                <span>{order.customerPhone}</span>
                              </a>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Delivery Destination</span>
                              <span className="text-sm font-bold text-gray-700">{order.customerCity}</span>
                            </div>
                          </div>

                          {/* Items Breakdown list */}
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Order Items Breakdown</span>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between text-xs">
                                  <div className="min-w-0">
                                    <span className="font-bold text-gray-800">{item.productName}</span>
                                    <span className="text-gray-400 ml-1.5">({item.size} / {item.color})</span>
                                  </div>
                                  <span className="font-mono text-gray-500 font-semibold">
                                    x{item.quantity} — {(item.price * item.quantity).toLocaleString()} ETB
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Subtotal */}
                            <div className="border-t border-gray-200 mt-3 pt-2.5 flex justify-between items-baseline text-sm">
                              <span className="font-black text-black">Grand Total Amount:</span>
                              <span className="font-mono font-black text-black text-base">{order.totalAmount.toLocaleString()} ETB</span>
                            </div>
                          </div>

                          {/* Referral notes / actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="text-gray-500">
                              {order.notes ? (
                                <p><strong>Special Request:</strong> "{order.notes}"</p>
                              ) : (
                                <p className="italic text-gray-400">No special requests provided.</p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="text-[10px] text-gray-400 uppercase font-semibold">Checkout Channel:</span>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                order.channel === 'telegram' ? 'bg-sky-50 text-sky-700' :
                                order.channel === 'whatsapp' ? 'bg-green-50 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.channel}
                              </span>
                            </div>
                          </div>

                        </div>
                      ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
