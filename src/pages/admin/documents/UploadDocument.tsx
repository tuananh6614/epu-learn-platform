import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Category } from '../../../types/document';

const UploadDocument = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get<Category[]>('/api/documents/categories');
      console.log('Categories response:', response.data);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Invalid categories data:', response.data);
        toast.error('Dữ liệu danh mục không hợp lệ');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching categories:', error.response?.data);
        toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách danh mục');
      } else {
        console.error('Error fetching categories:', error);
        toast.error('Lỗi không xác định khi lấy danh sách danh mục');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category_id', categoryId);
      if (file) {
        formData.append('file', file);
      }

      await axios.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Tải lên tài liệu thành công');
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi tải lên tài liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Đăng tải tài liệu mới</h2>
      <p className="text-gray-600 mb-6">Điền thông tin và đăng tải tài liệu vào cơ sở dữ liệu</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề tài liệu"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Danh mục
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Giá (VNĐ)
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ví dụ: 150000"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả nội dung tài liệu"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tệp tin
          </label>
          <input
            type="file"
            className="mt-1 block w-full"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Đang tải lên...' : 'Đăng tài liệu'}
        </button>
      </form>
    </div>
  );
};

export default UploadDocument; 