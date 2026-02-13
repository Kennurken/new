import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [specialists, setSpecialists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('All');
  const [formData, setFormData] = useState({ name: '', profession: '', phone: '', lat: '', lon: '', image: '' });
  
  // 🔽 ЖАҢА: Статистиканы ашып-жабу үшін
  const [showStats, setShowStats] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const almatyPosition = [43.2220, 76.8512];

  // Статистиканы есептеу
  const totalSpecialists = specialists.length;
  const professionCounts = specialists.reduce((acc, usta) => {
    acc[usta.profession] = (acc[usta.profession] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    axios.get('http://localhost:5000/api/specialists')
      .then(res => setSpecialists(res.data))
      .catch(err => console.log("Сервер қосулы емес"));
  }, []);

  const filteredSpecialists = specialists.filter(usta => {
    const matchesSearch = usta.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProfession === 'All' || usta.profession === filterProfession;
    return matchesSearch && matchesFilter;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const findMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lon: pos.coords.longitude })),
      () => alert("Геолокация өшірулі")
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Өшіруді растайсыз ба?")) {
      try {
        await axios.delete(`http://localhost:5000/api/specialists/${id}`);
        setSpecialists(specialists.filter(u => u.id !== id));
      } catch (err) {
        setSpecialists(specialists.filter(u => u.id !== id));
      }
    }
  };

  function MapOnClick() {
    useMapEvents({ click(e) { setFormData(prev => ({ ...prev, lat: e.latlng.lat, lon: e.latlng.lng })); } });
    return null;
  }

  const handleSave = async () => {
    if (!formData.name || !formData.lat) return alert("Деректерді толтырыңыз!");
    try {
      const res = await axios.post('http://localhost:5000/api/specialists', formData);
      setSpecialists([...specialists, res.data]);
      setFormData({ name: '', profession: '', phone: '', lat: '', lon: '', image: '' });
      alert("Маман қосылды!");
    } catch (err) {
      setSpecialists([...specialists, { id: Date.now(), ...formData }]);
      setFormData({ name: '', profession: '', phone: '', lat: '', lon: '', image: '' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="glass-card login-box">
          <h2>USTA Admin</h2>
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="save-btn" onClick={() => password === 'admin123' ? setIsLoggedIn(true) : alert('Қате!')}>Кіру</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="glass-card compact-card">
          
          {/* 📊 ЖИНАЛМАЛЫ СТАТИСТИКА БӨЛІМІ */}
          <div className="stats-accordion" onClick={() => setShowStats(!showStats)}>
            <div className="stats-header-main">
              <span className="main-count">{totalSpecialists}</span>
              <span className="main-title">USTA Admin {showStats ? '▲' : '▼'}</span>
            </div>
          </div>

          {showStats && (
            <div className="stats-details">
              <div className="categories-grid">
                {Object.entries(professionCounts).map(([prof, count]) => (
                  <div key={prof} className="mini-badge">
                    <span className="b-name">{prof}</span>
                    <span className="b-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="divider" />

          {/* 🔍 ІЗДЕУ ЖОЛАҒЫ */}
          <div className="search-group">
            <input 
              className="search-input-small"
              placeholder="🔎 Іздеу..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <select className="select-small" value={filterProfession} onChange={(e) => setFilterProfession(e.target.value)}>
              <option value="All">Барлығы</option>
              <option value="Сантехник">Сантехник</option>
              <option value="Электрик">Электрик</option>
              <option value="Құрылысшы">Құрылысшы</option>
            </select>
          </div>

          {/* 📝 ЫҚШАМДАЛҒАН ФОРМА */}
          <div className="form-container-small">
            <h3 className="form-title">Жаңа маман</h3>
            <input placeholder="Аты-жөні" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            {/* Мамандықты таңдауға арналған Dropdown */}
<select 
  className="glass-select-input"
  value={formData.profession} 
  onChange={e => setFormData({...formData, profession: e.target.value})}
>
  <option value="" disabled>Мамандықты таңдаңыз</option>
  <option value="Сантехник">Сантехник</option>
  <option value="Электрик">Электрик</option>
  <option value="Құрылысшы">Құрылысшы</option>
  <option value="Тазалықшы">Тазалықшы</option>
  <option value="Жөндеуші">Жөндеуші</option>
</select>
            <input placeholder="Телефон" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            
            <div className="file-row">
              <label className="file-btn">
                🖼 Фото
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
              {formData.image && <span className="status-ok">✅</span>}
              <button className="loc-btn-small" onClick={findMyLocation}>📍 Орным</button>
            </div>

            <p className="coord-info" style={{ color: formData.lat ? '#00ff00' : '#ff4d4d' }}>
              {formData.lat ? `✅ Белгіленді` : "📍 Орын таңдаңыз"}
            </p>

            <button className="save-btn-small" onClick={handleSave}>САҚТАУ</button>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={almatyPosition} zoom={12}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapOnClick />
          {filteredSpecialists.map(usta => (
            <Marker key={usta.id} position={[usta.lat, usta.lon]}>
              <Popup>
                <div className="popup-content">
                  {usta.image && <img src={usta.image} alt="usta" className="popup-img" />}
                  <strong>{usta.name}</strong>
                  <p>{usta.profession}</p>
                  <button className="del-btn" onClick={() => handleDelete(usta.id)}>Өшіру</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;