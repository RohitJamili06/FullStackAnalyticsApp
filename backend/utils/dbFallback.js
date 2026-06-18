const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '../data');
const filePath = path.join(dataDir, 'fallback.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial mockup data (same as seed data)
const getInitialData = () => {
  // Hash default password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('AdminPass123!', salt);

  const users = [
    {
      _id: 'u1',
      name: 'Admin User',
      email: 'admin@fullstackinsight.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date('2025-06-01').toISOString(),
    },
  ];

  const customers = [
    { _id: 'c1', customerName: 'John Doe', email: 'john@example.com', city: 'New York', createdAt: new Date('2025-07-10').toISOString() },
    { _id: 'c2', customerName: 'Jane Smith', email: 'jane@example.com', city: 'San Francisco', createdAt: new Date('2025-08-15').toISOString() },
    { _id: 'c3', customerName: 'Robert Johnson', email: 'robert@example.com', city: 'Chicago', createdAt: new Date('2025-08-20').toISOString() },
    { _id: 'c4', customerName: 'Emily Davis', email: 'emily@example.com', city: 'Seattle', createdAt: new Date('2025-09-05').toISOString() },
    { _id: 'c5', customerName: 'Michael Brown', email: 'michael@example.com', city: 'Boston', createdAt: new Date('2025-09-12').toISOString() },
    { _id: 'c6', customerName: 'Sarah Miller', email: 'sarah@example.com', city: 'Los Angeles', createdAt: new Date('2025-10-01').toISOString() },
    { _id: 'c7', customerName: 'David Wilson', email: 'david@example.com', city: 'Austin', createdAt: new Date('2025-10-25').toISOString() },
    { _id: 'c8', customerName: 'James Taylor', email: 'james@example.com', city: 'Denver', createdAt: new Date('2025-11-04').toISOString() },
    { _id: 'c9', customerName: 'Patricia Anderson', email: 'patricia@example.com', city: 'New York', createdAt: new Date('2025-11-19').toISOString() },
    { _id: 'c10', customerName: 'Linda Thomas', email: 'linda@example.com', city: 'San Francisco', createdAt: new Date('2025-12-05').toISOString() },
    { _id: 'c11', customerName: 'Barbara Jackson', email: 'barbara@example.com', city: 'Chicago', createdAt: new Date('2025-12-18').toISOString() },
    { _id: 'c12', customerName: 'Elizabeth White', email: 'elizabeth@example.com', city: 'Seattle', createdAt: new Date('2026-01-08').toISOString() },
    { _id: 'c13', customerName: 'Jennifer Harris', email: 'jennifer@example.com', city: 'Boston', createdAt: new Date('2026-01-22').toISOString() },
    { _id: 'c14', customerName: 'Maria Martin', email: 'maria@example.com', city: 'Los Angeles', createdAt: new Date('2026-02-14').toISOString() },
    { _id: 'c15', customerName: 'Susan Thompson', email: 'susan@example.com', city: 'Austin', createdAt: new Date('2026-03-02').toISOString() },
    { _id: 'c16', customerName: 'Margaret Garcia', email: 'margaret@example.com', city: 'Denver', createdAt: new Date('2026-03-29').toISOString() },
    { _id: 'c17', customerName: 'Dorothy Martinez', email: 'dorothy@example.com', city: 'New York', createdAt: new Date('2026-04-11').toISOString() },
    { _id: 'c18', customerName: 'Lisa Robinson', email: 'lisa@example.com', city: 'San Francisco', createdAt: new Date('2026-05-06').toISOString() },
    { _id: 'c19', customerName: 'Nancy Clark', email: 'nancy@example.com', city: 'Chicago', createdAt: new Date('2026-05-23').toISOString() },
    { _id: 'c20', customerName: 'Karen Rodriguez', email: 'karen@example.com', city: 'Seattle', createdAt: new Date('2026-06-01').toISOString() },
    { _id: 'c21', customerName: 'Betty Lewis', email: 'betty@example.com', city: 'Boston', createdAt: new Date('2026-06-15').toISOString() },
  ];

  const sales = [
    // Electronics
    { _id: 's1', productName: 'Wireless Mouse', category: 'Electronics', quantity: 12, revenue: 300, saleDate: new Date('2025-07-05').toISOString() },
    { _id: 's2', productName: 'Mechanical Keyboard', category: 'Electronics', quantity: 5, revenue: 500, saleDate: new Date('2025-08-12').toISOString() },
    { _id: 's3', productName: 'HD Monitor 27"', category: 'Electronics', quantity: 3, revenue: 750, saleDate: new Date('2025-09-15').toISOString() },
    { _id: 's4', productName: 'Bluetooth Headphones', category: 'Electronics', quantity: 8, revenue: 800, saleDate: new Date('2025-10-22').toISOString() },
    { _id: 's5', productName: 'USB-C Hub Multiport', category: 'Electronics', quantity: 15, revenue: 600, saleDate: new Date('2025-11-05').toISOString() },
    { _id: 's6', productName: 'Smart Home Speaker', category: 'Electronics', quantity: 10, revenue: 1000, saleDate: new Date('2025-12-10').toISOString() },
    { _id: 's7', productName: 'Wireless Mouse', category: 'Electronics', quantity: 20, revenue: 500, saleDate: new Date('2026-01-15').toISOString() },
    { _id: 's8', productName: 'Mechanical Keyboard', category: 'Electronics', quantity: 6, revenue: 600, saleDate: new Date('2026-02-20').toISOString() },
    { _id: 's9', productName: 'HD Monitor 27"', category: 'Electronics', quantity: 4, revenue: 1000, saleDate: new Date('2026-03-18').toISOString() },
    { _id: 's10', productName: 'Bluetooth Headphones', category: 'Electronics', quantity: 10, revenue: 1000, saleDate: new Date('2026-04-22').toISOString() },

    // Clothing
    { _id: 's11', productName: 'Denim Jacket', category: 'Clothing', quantity: 4, revenue: 320, saleDate: new Date('2025-07-20').toISOString() },
    { _id: 's12', productName: 'Slim Fit Jeans', category: 'Clothing', quantity: 10, revenue: 500, saleDate: new Date('2025-08-25').toISOString() },
    { _id: 's13', productName: 'Leather Boots', category: 'Clothing', quantity: 3, revenue: 450, saleDate: new Date('2025-09-28').toISOString() },
    { _id: 's14', productName: 'Hooded Sweatshirt', category: 'Clothing', quantity: 12, revenue: 600, saleDate: new Date('2025-10-05').toISOString() },
    { _id: 's15', productName: 'Wool Scarf', category: 'Clothing', quantity: 20, revenue: 400, saleDate: new Date('2025-11-20').toISOString() },
    { _id: 's16', productName: 'Winter Parka', category: 'Clothing', quantity: 2, revenue: 400, saleDate: new Date('2025-12-18').toISOString() },
    { _id: 's17', productName: 'Slim Fit Jeans', category: 'Clothing', quantity: 15, revenue: 750, saleDate: new Date('2026-01-25').toISOString() },
    { _id: 's18', productName: 'Hooded Sweatshirt', category: 'Clothing', quantity: 18, revenue: 900, saleDate: new Date('2026-02-28').toISOString() },
    { _id: 's19', productName: 'Denim Jacket', category: 'Clothing', quantity: 8, revenue: 640, saleDate: new Date('2026-03-24').toISOString() },

    // Office Supplies
    { _id: 's20', productName: 'Ergonomic Desk Chair', category: 'Office Supplies', quantity: 2, revenue: 400, saleDate: new Date('2025-08-01').toISOString() },
    { _id: 's21', productName: 'Notebook Set (5-Pack)', category: 'Office Supplies', quantity: 25, revenue: 250, saleDate: new Date('2025-09-08').toISOString() },
    { _id: 's22', productName: 'Desk Organizer', category: 'Office Supplies', quantity: 18, revenue: 360, saleDate: new Date('2025-10-14').toISOString() },
    { _id: 's23', productName: 'Gel Pen Box (50pcs)', category: 'Office Supplies', quantity: 30, revenue: 450, saleDate: new Date('2025-11-12').toISOString() },
    { _id: 's24', productName: 'Ergonomic Desk Chair', category: 'Office Supplies', quantity: 5, revenue: 1000, saleDate: new Date('2026-02-15').toISOString() },
    { _id: 's25', productName: 'Notebook Set (5-Pack)', category: 'Office Supplies', quantity: 40, revenue: 400, saleDate: new Date('2026-04-05').toISOString() },

    // Home & Kitchen
    { _id: 's26', productName: 'Air Fryer XL', category: 'Home & Kitchen', quantity: 3, revenue: 360, saleDate: new Date('2025-07-28').toISOString() },
    { _id: 's27', productName: 'Coffee Maker (12-Cup)', category: 'Home & Kitchen', quantity: 5, revenue: 250, saleDate: new Date('2025-08-30').toISOString() },
    { _id: 's28', productName: 'Stainless Steel Pan', category: 'Home & Kitchen', quantity: 7, revenue: 560, saleDate: new Date('2025-09-20').toISOString() },
    { _id: 's29', productName: 'Digital Kitchen Scale', category: 'Home & Kitchen', quantity: 15, revenue: 300, saleDate: new Date('2025-10-30').toISOString() },
    { _id: 's30', productName: 'Air Fryer XL', category: 'Home & Kitchen', quantity: 6, revenue: 720, saleDate: new Date('2026-01-05').toISOString() },
    { _id: 's31', productName: 'Coffee Maker (12-Cup)', category: 'Home & Kitchen', quantity: 8, revenue: 400, saleDate: new Date('2026-03-05').toISOString() },

    // May 2026 Sales
    { _id: 's32', productName: 'Smart Home Speaker', category: 'Electronics', quantity: 8, revenue: 800, saleDate: new Date('2026-05-10').toISOString() },
    { _id: 's33', productName: 'Leather Boots', category: 'Clothing', quantity: 5, revenue: 750, saleDate: new Date('2026-05-15').toISOString() },
    { _id: 's34', productName: 'Stainless Steel Pan', category: 'Home & Kitchen', quantity: 10, revenue: 800, saleDate: new Date('2026-05-22').toISOString() },
    { _id: 's35', productName: 'Desk Organizer', category: 'Office Supplies', quantity: 15, revenue: 300, saleDate: new Date('2026-05-28').toISOString() },

    // June 2026 Sales
    { _id: 's36', productName: 'HD Monitor 27"', category: 'Electronics', quantity: 6, revenue: 1500, saleDate: new Date('2026-06-02').toISOString() },
    { _id: 's37', productName: 'Bluetooth Headphones', category: 'Electronics', quantity: 12, revenue: 1200, saleDate: new Date('2026-06-08').toISOString() },
    { _id: 's38', productName: 'Slim Fit Jeans', category: 'Clothing', quantity: 20, revenue: 1000, saleDate: new Date('2026-06-12').toISOString() },
    { _id: 's39', productName: 'Air Fryer XL', category: 'Home & Kitchen', quantity: 8, revenue: 960, saleDate: new Date('2026-06-14').toISOString() },
    { _id: 's40', productName: 'Notebook Set (5-Pack)', category: 'Office Supplies', quantity: 50, revenue: 500, saleDate: new Date('2026-06-17').toISOString() },
  ];

  return { users, customers, sales };
};

// Read Database
const readData = () => {
  if (!fs.existsSync(filePath)) {
    const initial = getInitialData();
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    const initial = getInitialData();
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
};

// Write Database
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User Operations
const findUserByEmail = (email) => {
  const db = readData();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  const db = readData();
  const user = db.users.find((u) => u._id === id);
  if (user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
  return null;
};

const createUser = (userData) => {
  const db = readData();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(userData.password, salt);

  const newUser = {
    _id: 'u_' + Math.random().toString(36).substr(2, 9),
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'admin',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeData(db);
  const { password, ...safeUser } = newUser;
  return safeUser;
};

// Sales Operations
const getSalesList = (params) => {
  const db = readData();
  let filtered = [...db.sales];

  const { search, category, startDate, endDate, sortBy, page = 1, limit = 10 } = params;

  if (search) {
    filtered = filtered.filter((s) => s.productName.toLowerCase().includes(search.toLowerCase()));
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (startDate || endDate) {
    filtered = filtered.filter((s) => {
      const sDate = new Date(s.saleDate);
      if (startDate && sDate < new Date(startDate)) return false;
      if (endDate) {
        const eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
        if (sDate > eDate) return false;
      }
      return true;
    });
  }

  // Sorting
  if (sortBy === 'revenue_desc') {
    filtered.sort((a, b) => b.revenue - a.revenue);
  } else if (sortBy === 'date_asc') {
    filtered.sort((a, b) => new Date(a.saleDate) - new Date(b.saleDate));
  } else {
    // Default date_desc
    filtered.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
  }

  // Pagination
  const total = filtered.length;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const paginated = filtered.slice(skip, skip + parseInt(limit));

  return {
    total,
    pages: Math.ceil(total / parseInt(limit)),
    data: paginated,
  };
};

const createSaleItem = (saleData) => {
  const db = readData();
  const newSale = {
    _id: 's_' + Math.random().toString(36).substr(2, 9),
    productName: saleData.productName,
    category: saleData.category,
    quantity: parseInt(saleData.quantity) || 1,
    revenue: parseFloat(saleData.revenue) || 0,
    saleDate: saleData.saleDate ? new Date(saleData.saleDate).toISOString() : new Date().toISOString(),
  };
  db.sales.push(newSale);
  writeData(db);
  return newSale;
};

const updateSaleItem = (id, saleData) => {
  const db = readData();
  const idx = db.sales.findIndex((s) => s._id === id);
  if (idx !== -1) {
    db.sales[idx] = {
      ...db.sales[idx],
      productName: saleData.productName || db.sales[idx].productName,
      category: saleData.category || db.sales[idx].category,
      quantity: saleData.quantity !== undefined ? parseInt(saleData.quantity) : db.sales[idx].quantity,
      revenue: saleData.revenue !== undefined ? parseFloat(saleData.revenue) : db.sales[idx].revenue,
      saleDate: saleData.saleDate ? new Date(saleData.saleDate).toISOString() : db.sales[idx].saleDate,
    };
    writeData(db);
    return db.sales[idx];
  }
  return null;
};

const deleteSaleItem = (id) => {
  const db = readData();
  const initialLen = db.sales.length;
  db.sales = db.sales.filter((s) => s._id !== id);
  writeData(db);
  return db.sales.length < initialLen;
};

// Customers Operations
const getCustomersList = (params) => {
  const db = readData();
  let filtered = [...db.customers];

  const { search, city, sortBy, page = 1, limit = 10 } = params;

  if (search) {
    filtered = filtered.filter((c) => c.customerName.toLowerCase().includes(search.toLowerCase()));
  }

  if (city && city !== 'All') {
    filtered = filtered.filter((c) => c.city.toLowerCase() === city.toLowerCase());
  }

  // Sorting
  if (sortBy === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const total = filtered.length;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const paginated = filtered.slice(skip, skip + parseInt(limit));

  return {
    total,
    pages: Math.ceil(total / parseInt(limit)),
    data: paginated,
  };
};

const createCustomerItem = (customerData) => {
  const db = readData();
  const newCustomer = {
    _id: 'c_' + Math.random().toString(36).substr(2, 9),
    customerName: customerData.customerName,
    email: customerData.email,
    city: customerData.city,
    createdAt: customerData.createdAt ? new Date(customerData.createdAt).toISOString() : new Date().toISOString(),
  };
  db.customers.push(newCustomer);
  writeData(db);
  return newCustomer;
};

const updateCustomerItem = (id, customerData) => {
  const db = readData();
  const idx = db.customers.findIndex((c) => c._id === id);
  if (idx !== -1) {
    db.customers[idx] = {
      ...db.customers[idx],
      customerName: customerData.customerName || db.customers[idx].customerName,
      email: customerData.email || db.customers[idx].email,
      city: customerData.city || db.customers[idx].city,
      createdAt: customerData.createdAt ? new Date(customerData.createdAt).toISOString() : db.customers[idx].createdAt,
    };
    writeData(db);
    return db.customers[idx];
  }
  return null;
};

const deleteCustomerItem = (id) => {
  const db = readData();
  const initialLen = db.customers.length;
  db.customers = db.customers.filter((c) => c._id !== id);
  writeData(db);
  return db.customers.length < initialLen;
};

// Analytics Operations
const getDashboardStats = () => {
  const db = readData();
  
  const totalRevenue = db.sales.reduce((sum, s) => sum + s.revenue, 0);
  const totalSales = db.sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalCustomers = db.customers.length;
  const averageOrderValue = db.sales.length > 0 ? totalRevenue / db.sales.length : 0;

  // Calculate growth
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth(); // 0-11

  // June 2026 is calendar month 5 (since Jan=0)
  // Let's filter sales for the latest month in data
  const currentMonthSales = db.sales.filter((s) => {
    const d = new Date(s.saleDate);
    return d.getFullYear() === 2026 && d.getMonth() === 5; // June 2026
  });
  
  const lastMonthSales = db.sales.filter((s) => {
    const d = new Date(s.saleDate);
    return d.getFullYear() === 2026 && d.getMonth() === 4; // May 2026
  });

  const currentMonthRevenue = currentMonthSales.reduce((sum, s) => sum + s.revenue, 0);
  const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + s.revenue, 0);

  let monthlyGrowth = 0;
  if (lastMonthRevenue > 0) {
    monthlyGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
  } else if (currentMonthRevenue > 0) {
    monthlyGrowth = 100;
  }

  return {
    totalRevenue,
    totalSales,
    totalCustomers,
    monthlyGrowth,
    averageOrderValue,
  };
};

const getRevenueTrendStats = () => {
  const db = readData();
  
  // Group by year and month
  const grouped = {};
  db.sales.forEach((s) => {
    const d = new Date(s.saleDate);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!grouped[key]) {
      grouped[key] = {
        _id: { year: d.getFullYear(), month: d.getMonth() + 1 },
        revenue: 0,
        quantity: 0,
      };
    }
    grouped[key].revenue += s.revenue;
    grouped[key].quantity += s.quantity;
  });

  return Object.values(grouped).sort((a, b) => {
    if (a._id.year !== b._id.year) return a._id.year - b._id.year;
    return a._id.month - b._id.month;
  });
};

const getSalesCategoryStats = () => {
  const db = readData();
  const grouped = {};
  db.sales.forEach((s) => {
    if (!grouped[s.category]) {
      grouped[s.category] = {
        _id: s.category,
        totalRevenue: 0,
        totalQuantity: 0,
        salesCount: 0,
      };
    }
    grouped[s.category].totalRevenue += s.revenue;
    grouped[s.category].totalQuantity += s.quantity;
    grouped[s.category].salesCount += 1;
  });

  return Object.values(grouped).sort((a, b) => b.totalRevenue - a.totalRevenue);
};

const getCustomerGrowthStats = () => {
  const db = readData();
  
  // Growth by month
  const growthGrouped = {};
  db.customers.forEach((c) => {
    const d = new Date(c.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!growthGrouped[key]) {
      growthGrouped[key] = {
        _id: { year: d.getFullYear(), month: d.getMonth() + 1 },
        count: 0,
      };
    }
    growthGrouped[key].count += 1;
  });

  const growth = Object.values(growthGrouped).sort((a, b) => {
    if (a._id.year !== b._id.year) return a._id.year - b._id.year;
    return a._id.month - b._id.month;
  });

  // Cities splits
  const citiesGrouped = {};
  db.customers.forEach((c) => {
    if (!citiesGrouped[c.city]) {
      citiesGrouped[c.city] = {
        _id: c.city,
        count: 0,
      };
    }
    citiesGrouped[c.city].count += 1;
  });

  const cities = Object.values(citiesGrouped).sort((a, b) => b.count - a.count);

  return { growth, cities };
};

const getProductLeaderboard = () => {
  const db = readData();
  const grouped = {};
  db.sales.forEach((s) => {
    if (!grouped[s.productName]) {
      grouped[s.productName] = {
        _id: s.productName,
        category: s.category,
        totalRevenue: 0,
        totalQuantity: 0,
        salesCount: 0,
      };
    }
    grouped[s.productName].totalRevenue += s.revenue;
    grouped[s.productName].totalQuantity += s.quantity;
    grouped[s.productName].salesCount += 1;
  });

  return Object.values(grouped)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getSalesList,
  createSaleItem,
  updateSaleItem,
  deleteSaleItem,
  getCustomersList,
  createCustomerItem,
  updateCustomerItem,
  deleteCustomerItem,
  getDashboardStats,
  getRevenueTrendStats,
  getSalesCategoryStats,
  getCustomerGrowthStats,
  getProductLeaderboard,
};
