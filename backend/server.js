const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Loi: Chua cau hinh bien moi truong MONGODB_URI');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Ket noi MongoDB Atlas thanh cong!'))
  .catch((err) => console.error('Loi ket noi MongoDB:', err.message));

// Schema và Model
const foodSchema = new mongoose.Schema({
  foodId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  cuisine: { type: String, required: true, trim: true },
  ingredients: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema, 'foods');

// Hàm hỗ trợ tìm kiếm tiếng Việt không dấu và có dấu
function createVietnameseRegex(text) {
  const map = {
    'a': '[aáàảãạăắằẳẵặâấầẩẫậ]',
    'e': '[eéèẻẽẹêếềểễệ]',
    'i': '[iíìỉĩị]',
    'o': '[oóòỏõọôốồổỗộơớờởỡợ]',
    'u': '[uúùủũụưứừửữự]',
    'y': '[yýỳỷỹỵ]',
    'd': '[dđ]'
  };
  const pattern = text.trim().split('').map(char => {
    const lower = char.toLowerCase();
    return map[lower] || char;
  }).join('');
  return new RegExp(pattern, 'i');
}

// 1. Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend dang hoat dong binh thuong',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// 2. Lấy danh sách món ăn & Tìm kiếm theo từ khóa (?search=...)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search && search.trim() !== '') {
      const regex = createVietnameseRegex(search);
      filter = {
        $or: [
          { name: regex },
          { category: regex },
          { cuisine: regex }
        ]
      };
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(foods);
  } catch (error) {
    return res.status(500).json({ error: 'Loi lay danh sach mon an', detail: error.message });
  }
});

// 3. Xem chi tiết món ăn theo ID
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Khong tim thay mon an' });
    }
    return res.status(200).json(food);
  } catch (error) {
    return res.status(400).json({ error: 'ID khong hop le', detail: error.message });
  }
});

// 4. Thêm món ăn mới (Chống trùng foodId và validate đầu vào)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    if (!foodId || !name || !category || !cuisine || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Vui long dien day du cac truong bat buoc' });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({ error: 'Gia ban va so luong phai la so khong am' });
    }

    const existingFood = await Food.findOne({ foodId: foodId.trim() });
    if (existingFood) {
      return res.status(409).json({ error: `Ma mon an '${foodId}' da ton tai` });
    }

    let parsedIngredients = [];
    if (Array.isArray(ingredients)) {
      parsedIngredients = ingredients;
    } else if (typeof ingredients === 'string') {
      parsedIngredients = ingredients.split(',').map(item => item.trim()).filter(Boolean);
    }

    const newFood = new Food({
      foodId: foodId.trim(),
      name: name.trim(),
      category: category.trim(),
      cuisine: cuisine.trim(),
      ingredients: parsedIngredients,
      price: Number(price),
      quantity: Number(quantity),
      description: description ? description.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : ''
    });

    const savedFood = await newFood.save();
    return res.status(201).json(savedFood);
  } catch (error) {
    return res.status(400).json({ error: 'Loi tao mon an', detail: error.message });
  }
});

// 5. Cập nhật thông tin món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    if (foodId) {
      const duplicate = await Food.findOne({ foodId: foodId.trim(), _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(409).json({ error: `Ma mon an '${foodId}' da bi trung voi mon an khac` });
      }
    }

    if ((price !== undefined && Number(price) < 0) || (quantity !== undefined && Number(quantity) < 0)) {
      return res.status(400).json({ error: 'Gia ban va so luong khong duoc nho hon 0' });
    }

    const updateData = { ...req.body };
    if (foodId) updateData.foodId = foodId.trim();
    if (name) updateData.name = name.trim();
    if (category) updateData.category = category.trim();
    if (cuisine) updateData.cuisine = cuisine.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (quantity !== undefined) updateData.quantity = Number(quantity);

    if (ingredients !== undefined) {
      if (Array.isArray(ingredients)) {
        updateData.ingredients = ingredients;
      } else if (typeof ingredients === 'string') {
        updateData.ingredients = ingredients.split(',').map(item => item.trim()).filter(Boolean);
      }
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updatedFood) {
      return res.status(404).json({ error: 'Khong tim thay mon an de cap nhat' });
    }

    return res.status(200).json(updatedFood);
  } catch (error) {
    return res.status(400).json({ error: 'Loi cap nhat mon an', detail: error.message });
  }
});

// 6. Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ error: 'Khong tim thay mon an de xoa' });
    }
    return res.status(200).json({ message: 'Xoa mon an thanh cong', deletedId: req.params.id });
  } catch (error) {
    return res.status(400).json({ error: 'ID khong hop le hoac loi he thong', detail: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server dang chay tai cong ${PORT}`);
});
