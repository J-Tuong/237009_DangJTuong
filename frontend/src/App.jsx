import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const initialForm = {
    foodId: '',
    name: '',
    category: '',
    cuisine: '',
    ingredients: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  // Lấy dữ liệu danh sách món ăn
  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_BASE}/api/foods?search=${encodeURIComponent(keyword)}` : `${API_BASE}/api/foods`;
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể kết nối đến máy chủ Backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleResetSearch = () => {
    setSearch('');
    fetchFoods('');
  };

  const handleViewDetail = async (id) => {
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/foods/${id}`);
      setSelectedFood(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể xem chi tiết món ăn');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price,
      quantity: food.quantity,
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/foods/${editingId}`, formData);
        setSuccess('Cập nhật thông tin món ăn thành công!');
      } else {
        await axios.post(`${API_BASE}/api/foods`, formData);
        setSuccess('Thêm món ăn mới thành công!');
      }
      setIsFormOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchFoods(search);
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa món: "${name}"?`)) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_BASE}/api/foods/${id}`);
      setSuccess('Đã xóa món ăn thành công!');
      fetchFoods(search);
      if (selectedFood?._id === id) setSelectedFood(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi xóa món ăn');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header bar */}
      <header className="app-header">
        <div>
          <h1 className="brand-title">Food Management System</h1>
          <p className="brand-subtitle">Học phần: Điện toán đám mây • Kiến trúc MERN Cloud Stack</p>
        </div>
        <div className="badge-student">
          Đặng J Tường • MSSV: 237009
        </div>
      </header>

      {/* Thông báo Alert */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* Toolbar: Tìm kiếm và nút Thêm */}
      <div className="toolbar-section">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên, loại món hoặc vùng miền (vd: pho, bun bo, nuoc)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">🔍 Tìm kiếm</button>
          {search && <button type="button" onClick={handleResetSearch} className="btn btn-secondary">Đặt lại</button>}
        </form>

        <button onClick={isFormOpen ? handleCancelForm : handleOpenAdd} className={`btn ${isFormOpen ? 'btn-secondary' : 'btn-primary'}`}>
          {isFormOpen ? '✕ Đóng biểu mẫu' : '＋ Thêm món ăn mới'}
        </button>
      </div>

      {/* Form Card (Hiển thị khi thêm / sửa) */}
      {isFormOpen && (
        <div className="form-card">
          <div className="form-header">
            <span>{editingId ? '✏️ Cập Nhật Thông Tin Món Ăn' : '＋ Nhập Thông Tin Món Ăn Mới'}</span>
            <button onClick={handleCancelForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Mã món (foodId) *</label>
              <input required name="foodId" value={formData.foodId} onChange={handleChange} disabled={!!editingId} placeholder="VD: F04" />
            </div>
            <div className="form-group">
              <label>Tên món ăn *</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="VD: Bún Chả Hà Nội" />
            </div>
            <div className="form-group">
              <label>Loại món *</label>
              <input required name="category" value={formData.category} onChange={handleChange} placeholder="Món nước, Món nướng..." />
            </div>
            <div className="form-group">
              <label>Ẩm thực / Vùng miền *</label>
              <input required name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="Miền Bắc, Miền Nam..." />
            </div>
            <div className="form-group">
              <label>Giá bán (VNĐ) *</label>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} placeholder="50000" />
            </div>
            <div className="form-group">
              <label>Số lượng tồn *</label>
              <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="100" />
            </div>
            <div className="form-group col-span-2">
              <label>Nguyên liệu chính (cách nhau bởi dấu phẩy)</label>
              <input name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="Thịt heo, bún tươi, nước mắm, rau thơm..." />
            </div>
            <div className="form-group col-span-2">
              <label>Đường dẫn hình ảnh (URL)</label>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
            </div>
            <div className="form-group col-full">
              <label>Mô tả món ăn</label>
              <textarea rows="2" name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả hương vị hoặc cách thưởng thức..." />
            </div>
            <div className="col-full" style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Lưu cập nhật' : 'Xác nhận tạo món'}
              </button>
              <button type="button" onClick={handleCancelForm} className="btn btn-secondary">
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Xem chi tiết */}
      {selectedFood && (
        <div className="modal-backdrop" onClick={() => setSelectedFood(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px' }}>Chi Tiết Món Ăn</h3>
              <button className="modal-close-btn" onClick={() => setSelectedFood(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedFood.imageUrl && (
                <img
                  src={selectedFood.imageUrl}
                  alt={selectedFood.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '14px' }}
                />
              )}
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{selectedFood.name}</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <span className="badge badge-id">{selectedFood.foodId}</span>
                <span className="badge badge-category">{selectedFood.category}</span>
                <span className="badge badge-cuisine">{selectedFood.cuisine}</span>
              </div>
              <p style={{ margin: '6px 0', fontSize: '14px' }}>
                <strong>Giá bán:</strong> <span className="price-text">{selectedFood.price?.toLocaleString()} VNĐ</span>
              </p>
              <p style={{ margin: '6px 0', fontSize: '14px' }}>
                <strong>Số lượng hiện có:</strong> {selectedFood.quantity} phần
              </p>
              <p style={{ margin: '6px 0', fontSize: '14px' }}>
                <strong>Nguyên liệu:</strong> {Array.isArray(selectedFood.ingredients) ? selectedFood.ingredients.join(', ') : 'Không có'}
              </p>
              <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                <strong>Mô tả:</strong> {selectedFood.description || 'Chưa cập nhật mô tả chi tiết cho món này.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bảng danh sách món ăn */}
      <div className="table-card">
        <div className="table-header-title">
          <span>Danh Sách Thực Đơn</span>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            {foods.length} món ăn
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên món ăn</th>
                <th>Phân loại</th>
                <th>Vùng miền</th>
                <th>Giá niêm yết</th>
                <th>Tồn kho</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Đang đồng bộ dữ liệu món ăn...
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Không có món ăn nào phù hợp với dữ liệu tìm kiếm.
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food._id}>
                    <td><span className="badge badge-id">{food.foodId}</span></td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{food.name}</td>
                    <td><span className="badge badge-category">{food.category}</span></td>
                    <td><span className="badge badge-cuisine">{food.cuisine}</span></td>
                    <td className="price-text">{food.price?.toLocaleString()} đ</td>
                    <td>{food.quantity}</td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <button onClick={() => handleViewDetail(food._id)} className="btn btn-secondary btn-sm" style={{ marginRight: '6px' }}>Xem</button>
                      <button onClick={() => handleEdit(food)} className="btn btn-secondary btn-sm" style={{ marginRight: '6px', color: '#d97706' }}>Sửa</button>
                      <button onClick={() => handleDelete(food._id, food.name)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }}>Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
