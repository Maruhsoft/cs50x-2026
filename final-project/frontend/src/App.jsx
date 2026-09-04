import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains',
    unitOfMeasurement: 'Mudu',
    newPrice: '',
    market: 'Wuse Market',
    vendorName: ''
  });

  const API_URL = 'http://localhost:5000/api/products';

  // Fetch all commodity records
  const fetchMarketIndex = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Could not connect to the price server.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketIndex();
  }, []);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit New Price Report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.newPrice) {
      alert('Please fill out the Item Name and Price fields.');
      return;
    }

    try {
      await axios.post(API_URL, formData);
      alert('Price report submitted successfully!');
      // Reset form fields except structural selectors
      setFormData({
        ...formData,
        name: '',
        newPrice: '',
        vendorName: ''
      });
      fetchMarketIndex(); // Refresh prices
    } catch (err) {
      alert('Error submitting price data.');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #0066cc', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0066cc' }}>Abuja Markets ₦</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Crowd-Sourced Commodity Price & Vendor Tracker</p>
      </header>

      {error && <div style={{ background: '#ffcccc', padding: '10px', borderRadius: '5px', marginBottom: '20px', color: '#990000' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* Left Side: Report Form */}
        <div>
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.2rem', color: '#0066cc' }}>Report New Price</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Commodity Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. White Beans, Yam, Garri" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Grains">Grains</option>
                  <option value="Tubers">Tubers</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Oils">Oils</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Unit of Measurement:</label>
                <input type="text" name="unitOfMeasurement" value={formData.unitOfMeasurement} onChange={handleChange} placeholder="e.g. Mudu, Paint Bucket, Tuber" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (₦):</label>
                <input type="number" name="newPrice" value={formData.newPrice} onChange={handleChange} placeholder="Current Cost in Naira" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Market Location:</label>
                <select name="market" value={formData.market} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Wuse Market">Wuse Market</option>
                  <option value="Utako Market">Utako Market</option>
                  <option value="Garki Market">Garki Market</option>
                  <option value="Mararaba Market">Mararaba Market</option>
                  <option value="Bwari Market">Bwari Market</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vendor / Stall Number:</label>
                <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="e.g. Stall 14, Block B" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '10px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Report</button>
            </form>
          </div>
        </div>

        {/* Right Side: Price Board */}
        <div>
          <h2 style={{ marginTop: 0, fontSize: '1.4rem' }}>Live Commodity Indexes</h2>
          {loading ? (
            <p>Loading market data configurations...</p>
          ) : products.length === 0 ? (
            <p style={{ color: '#666' }}>No entries logged yet. Be the first to report a market price index on the left!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {products.map((item) => (
                <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>{item.name}</h3>
                    <span style={{ background: '#e6f2ff', color: '#0066cc', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.category}</span>
                  </div>
                  <p style={{ margin: '5px 0' }}><strong>Average Price:</strong> <span style={{ fontSize: '1.2rem', color: '#228b22', fontWeight: 'bold' }}>₦{item.averagePrice.toLocaleString()}</span> per {item.unitOfMeasurement}</p>
                  
                  <div style={{ marginTop: '10px', background: '#fafafa', padding: '10px', borderRadius: '4px', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#555' }}>Recent Activity Logs:</p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                      {item.priceHistory.slice(-2).reverse().map((log, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                          ₦{log.price.toLocaleString()} at <strong>{log.market}</strong> ({log.vendorName})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
