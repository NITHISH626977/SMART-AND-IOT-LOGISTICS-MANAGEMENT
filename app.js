
const { useState, useEffect, useRef } = React;


const VEHICLES = [
  { id:'TN-001', driver:'Rajan K.',   route:'Chennai → Coimbatore', status:'In Transit', lat:11.0168, lng:76.9558, progress:68,  load:'Electronics – 2.4T', temp:22, humid:55, fuel:74, speed:72, eta:'14:30',   assigned:true  },
  { id:'TN-002', driver:'Murugan S.', route:'Tiruppur → Salem',     status:'Delivered',  lat:11.6643, lng:78.1460, progress:100, load:'Textiles – 1.8T',    temp:26, humid:60, fuel:42, speed:0,  eta:'Arrived', assigned:false },
  { id:'TN-003', driver:'Selvi R.',   route:'Erode → Madurai',      status:'Loading',    lat:10.7905, lng:77.4980, progress:12,  load:'FMCG – 3.1T',        temp:24, humid:58, fuel:91, speed:0,  eta:'17:45',   assigned:true  },
  { id:'TN-004', driver:'Arjun P.',   route:'Coimbatore → Chennai', status:'In Transit', lat:11.5000, lng:77.9500, progress:45,  load:'Machinery – 4.0T',   temp:21, humid:52, fuel:63, speed:65, eta:'16:15',   assigned:true  },
  { id:'KA-001', driver:'Priya M.',   route:'Bengaluru → Mysuru',   status:'Delivered',  lat:12.3052, lng:76.6551, progress:100, load:'Pharma – 0.9T',      temp:18, humid:48, fuel:38, speed:0,  eta:'Arrived', assigned:false },
];

const SHIPMENTS = [
  { id:'SHP-2024-001', origin:'Chennai Warehouse',  dest:'Coimbatore Hub',      weight:'2.4T', type:'Electronics', driver:'Rajan K.',   vehicle:'TN-001', status:'In Transit', priority:'High',   date:'2024-01-15', cost:'₹8,400'  },
  { id:'SHP-2024-002', origin:'Tiruppur Factory',   dest:'Salem DC',            weight:'1.8T', type:'Textiles',    driver:'Murugan S.', vehicle:'TN-002', status:'Delivered',  priority:'Normal', date:'2024-01-15', cost:'₹5,200'  },
  { id:'SHP-2024-003', origin:'Erode Godown',       dest:'Madurai Port',        weight:'3.1T', type:'FMCG',        driver:'Selvi R.',   vehicle:'TN-003', status:'Loading',    priority:'High',   date:'2024-01-15', cost:'₹11,700' },
  { id:'SHP-2024-004', origin:'Coimbatore Hub',     dest:'Chennai Warehouse',   weight:'4.0T', type:'Machinery',   driver:'Arjun P.',   vehicle:'TN-004', status:'In Transit', priority:'Urgent', date:'2024-01-14', cost:'₹15,600' },
  { id:'SHP-2024-005', origin:'Bengaluru WH',       dest:'Mysuru DC',           weight:'0.9T', type:'Pharma',      driver:'Priya M.',   vehicle:'KA-001', status:'Delivered',  priority:'Normal', date:'2024-01-14', cost:'₹3,100'  },
  { id:'SHP-2024-006', origin:'Chennai Hub',        dest:'Trichy DC',           weight:'2.8T', type:'Auto Parts',  driver:'—',          vehicle:'—',      status:'Pending',    priority:'Normal', date:'2024-01-16', cost:'₹9,800'  },
];

const RETURN_LOADS = [
  { id:'RL-001', from:'Coimbatore Hub',    to:'Chennai Warehouse', weight:'2.1T', type:'Garments',   distance:'8 km',  reward:'₹4,200', available:'Now',  match:94 },
  { id:'RL-002', from:'Salem DC',          to:'Erode Godown',      weight:'1.5T', type:'Raw Cotton',  distance:'15 km', reward:'₹2,800', available:'1hr',  match:81 },
  { id:'RL-003', from:'Tiruppur Export',   to:'Chennai Port',      weight:'3.0T', type:'Knitwear',    distance:'22 km', reward:'₹6,500', available:'2hr',  match:76 },
  { id:'RL-004', from:'Mysuru Factory',    to:'Bengaluru Hub',     weight:'0.8T', type:'Coffee',      distance:'5 km',  reward:'₹1,900', available:'Now',  match:88 },
];

const COMPLETED_FOR_BACKHAUL = [
  { vehicle:'TN-002', driver:'Murugan S.', location:'Salem DC',  completedAt:'12:45', assignedReturn:null    },
  { vehicle:'KA-001', driver:'Priya M.',   location:'Mysuru DC', completedAt:'11:30', assignedReturn:'RL-004' },
];

const ALERTS_DATA = [
  { type:'warning', msg:'TN-002 completed delivery – Return load available nearby',   time:'5m ago'  },
  { type:'info',    msg:'TN-001 ETA updated: 14:30 (traffic rerouted)',               time:'12m ago' },
  { type:'success', msg:'KA-001 return backhaul assigned successfully',               time:'28m ago' },
];

const INITIAL_DRIVERS = [
  { id: 'DRV-001', name: 'Rajan K.', phone: '+91 9876543210', license: 'TN12 2010001234', experience: '5', status: 'Active' },
  { id: 'DRV-002', name: 'Murugan S.', phone: '+91 9876543211', license: 'TN34 2012005678', experience: '8', status: 'Active' },
  { id: 'DRV-003', name: 'Selvi R.', phone: '+91 9876543212', license: 'TN56 2015009012', experience: '4', status: 'On Leave' },
];

const INITIAL_TRUCKS = [
  { id: 'TN-001', model: 'Tata Signa 2821.T', capacity: '20T', fuelType: 'Diesel', status: 'Active', location: 'Chennai' },
  { id: 'TN-002', model: 'Ashok Leyland 1920', capacity: '12T', fuelType: 'Diesel', status: 'Maintenance', location: 'Salem' },
  { id: 'TN-003', model: 'Eicher Pro 3015', capacity: '10T', fuelType: 'CNG', status: 'Active', location: 'Erode' },
];

const INITIAL_ORDERS = [
  { id: 'ORD-1001', clientName: 'Reliance Retail', items: 'Groceries & Staples', weight: '4.5T', origin: 'Mumbai, MH', dest: 'Pune, MH', status: 'Pending Review', date: '2024-02-10' },
  { id: 'ORD-1002', clientName: 'TATA Croma', items: 'Consumer Electronics', weight: '2.1T', origin: 'Chennai, TN', dest: 'Bengaluru, KA', status: 'Approved', date: '2024-02-11' },
  { id: 'ORD-1003', clientName: 'Aditya Birla Fashion', items: 'Apparel', weight: '3.0T', origin: 'Tiruppur, TN', dest: 'Hyderabad, TS', status: 'Assigned', date: '2024-02-12' },
];

function Badge({ status }) {
  const colorMap = {
    'In Transit': 'blue',
    'Delivered':  'green',
    'Loading':    'amber',
    'Pending':    'grey',
    'Assigned':   'green',
    'Completed':  'cyan',
  };
  const iconMap = {
    'In Transit': '🚛',
    'Delivered':  '✅',
    'Loading':    '📦',
    'Pending':    '⏳',
    'Assigned':   '🔗',
    'Completed':  '🏁',
  };
  return (
    <span className={`badge ${colorMap[status] || 'grey'}`}>
      {iconMap[status] || '•'} {status}
    </span>
  );
}

function PriorityBadge({ p }) {
  const bg    = p === 'Urgent' ? '#fee2e2' : p === 'High' ? '#fef3c7' : '#dbeafe';
  const color = p === 'Urgent' ? '#ef4444' : p === 'High' ? '#d97706' : '#2563eb';
  return <span className="chip" style={{ background: bg, color }}>{p}</span>;
}

function AuthPage({ onLogin }) {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ email:'admin@logiflow.io', password:'demo123', name:'', role:'admin' });
  const [loading, setLoading] = useState(false);

  const roles = [
    { value:'admin',   label:'Admin'   },
    { value:'manager', label:'Manager' },
    { value:'driver',  label:'Driver'  },
  ];

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: form.name || 'Admin User', role: form.role, email: form.email });
    }, 900);
  };

  return (
    <div className="auth-bg">
      <div className="auth-grid" />
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🚛</div>
          <div>
            <h2>LogiFlow</h2>
            <span style={{ fontSize:11, color:'var(--grey-400)', fontFamily:'JetBrains Mono,monospace' }}>IoT Logistics v2.4</span>
          </div>
        </div>

        <h2 className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="auth-sub">{mode === 'login' ? 'Sign in to your logistics dashboard' : 'Join the LogiFlow platform'}</p>

        {mode === 'register' && (
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="John Doe" />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input className="form-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@company.com" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input className="form-input" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select className="form-select" name="role" value={form.role} onChange={handle}>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <button className="btn-primary" onClick={submit}>
          {loading ? 'Authenticating…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div className="auth-switch">
          {mode === 'login'
            ? <><span>Don't have an account? </span><a onClick={() => setMode('register')}>Register</a></>
            : <><span>Already have one? </span><a onClick={() => setMode('login')}>Sign in</a></>
          }
        </div>

        <div style={{ marginTop:16, padding:'10px 14px', background:'var(--blue-50)', borderRadius:'var(--radius-sm)', fontSize:12, color:'var(--blue-700)', textAlign:'center' }}>
          🔐 Demo: admin@logiflow.io / demo123
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { section:'Main', items:[
    { key:'home',      icon:'🏠', label:'Home'          },
    { key:'dashboard', icon:'📊', label:'Dashboard', badge:3 },
  ]},
  { section:'Operations', items:[
    { key:'orders',    icon:'📝', label:'Orders'                         },
    { key:'tracking',  icon:'📡', label:'Live Tracking'                  },
    { key:'shipments', icon:'📦', label:'Shipments'                      },
    { key:'backhaul',  icon:'🔄', label:'Backhaul Mgmt', badge:'New'     },
    { key:'fleet',     icon:'🚚', label:'Fleet Details'                  },
  ]},
  { section:'Insights', items:[
    { key:'analytics', icon:'📈', label:'Analytics' },
    { key:'settings',  icon:'⚙️', label:'Settings'  },
  ]},
];

function Sidebar({ page, onPage, user, onLogout, open, onClose }) {
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <div className={`overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚛</div>
          <div>
            <h2 style={{ fontSize:17, color:'white', fontFamily:'Syne,sans-serif' }}>LogiFlow</h2>
            <span>IoT Logistics</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(sec => (
            <div key={sec.section}>
              <div className="nav-section-label">{sec.section}</div>
              {sec.items.map(item => (
                <div
                  key={item.key}
                  className={`nav-item ${page === item.key ? 'active' : ''}`}
                  onClick={() => { onPage(item.key); onClose(); }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
            <button className="btn-logout" onClick={onLogout} title="Sign out">⎋</button>
          </div>
        </div>
      </div>
    </>
  );
}

const PAGE_META = {
  home:      { title:'Home',               sub:'System Overview'                        },
  dashboard: { title:'Dashboard',          sub:'Live monitoring & KPIs'                 },
  orders:    { title:'Order Management',   sub:'Client order requests & details'        },
  tracking:  { title:'Live Tracking',      sub:'Real-time vehicle & route monitoring'   },
  shipments: { title:'Shipments',          sub:'All shipment records & details'         },
  backhaul:  { title:'Backhaul Management',sub:'Return load optimization'               },
  analytics: { title:'Analytics',          sub:'Performance charts & reports'           },
  fleet:     { title:'Fleet Details',      sub:'Driver & Truck Management'              },
  settings:  { title:'System Settings',    sub:'Preferences & Configurations'           },
};

function TopBar({ page, setSidebarOpen, onPage }) {
  const meta = PAGE_META[page] || { title:'LogiFlow', sub:'' };
  const [openDrop, setOpenDrop] = useState(null);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Welcome! How can we assist you today?', time: '09:00 AM' }
  ]);
  const [msgInput, setMsgInput] = useState('');

  const toggleDrop = (d) => setOpenDrop(openDrop === d ? null : d);

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    const newMsg = { id: Date.now(), sender: 'user', text: msgInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newMsg]);
    setMsgInput('');
    
    setTimeout(() => {
      const reply = { id: Date.now(), sender: 'system', text: 'We have received your message. A coordinator will reply shortly.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="top-bar" style={{ position: 'relative' }}>
      <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
      <div className="top-bar-title">
        <h1>{meta.title}</h1>
        <p>{meta.sub}</p>
      </div>
      <div className="top-bar-actions">
        <span className="live-indicator"><span className="live-dot" />LIVE</span>
        
        {/* Messaging */}
        <div style={{ position: 'relative' }}>
          <div className="icon-btn" title="Messages" onClick={() => toggleDrop('msg')}>💬</div>
          {openDrop === 'msg' && (
            <div className="dropdown-panel" style={{ position: 'absolute', top: 45, right: 0, width: 320, background: 'white', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid var(--grey-200)', zIndex: 100, display: 'flex', flexDirection: 'column', height: 400 }}>
              <div style={{ padding: 12, borderBottom: '1px solid var(--grey-100)', fontWeight: 600, background: 'var(--blue-50)', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>Support Chat</div>
              <div style={{ padding: 12, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map(m => (
                  <div key={m.id} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ background: m.sender === 'user' ? 'var(--blue-600)' : 'var(--grey-100)', color: m.sender === 'user' ? 'white' : 'black', padding: '8px 12px', borderRadius: 8, fontSize: 13 }}>{m.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--grey-400)', marginTop: 4, textAlign: m.sender === 'user' ? 'right' : 'left' }}>{m.time}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, borderTop: '1px solid var(--grey-100)', display: 'flex', gap: 8 }}>
                <input type="text" className="form-input" placeholder="Type a message..." value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} style={{ flex: 1 }} />
                <button className="btn-sm primary" onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <div className="icon-btn" title="Notifications" onClick={() => toggleDrop('notif')}>🔔<span className="notif-dot" /></div>
          {openDrop === 'notif' && (
            <div className="dropdown-panel" style={{ position: 'absolute', top: 45, right: -40, width: 320, background: 'white', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid var(--grey-200)', zIndex: 100 }}>
              <div style={{ padding: 12, borderBottom: '1px solid var(--grey-100)', fontWeight: 600 }}>Recent Notifications</div>
              <div>
                {ALERTS_DATA.map((a, i) => (
                  <div key={i} style={{ padding: 12, borderBottom: '1px solid var(--grey-50)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span>{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}</span>
                    <div style={{ flex:1, fontSize: 13, color:'var(--grey-700)' }}>{a.msg}</div>
                    <span style={{ fontSize:11, color:'var(--grey-400)', whiteSpace:'nowrap' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="icon-btn" title="Settings" onClick={() => { onPage('settings'); setOpenDrop(null); }}>⚙️</div>
      </div>
    </div>
  );
}

function HomePage({ onPage }) {
  const features = [
    { icon:'📡', cls:'b1', title:'Real-Time IoT Tracking',       desc:'Monitor every vehicle with live GPS, temperature, humidity and fuel sensors.', route:'tracking' },
    { icon:'🔄', cls:'b2', title:'Smart Backhaul Optimization',  desc:'Detect empty return trips and auto-assign nearby loads to eliminate deadheads.', route:'backhaul' },
    { icon:'🗺️', cls:'b3', title:'Dynamic Route Planning',       desc:'AI-powered route recalculation avoiding traffic, weather, and toll congestion.', route:'tracking' },
    { icon:'📊', cls:'b4', title:'Advanced Analytics',           desc:'Comprehensive dashboards for delivery KPIs, delay patterns, and performance.', route:'analytics' },
    { icon:'🚛', cls:'b5', title:'Fleet Management',             desc:'Complete overview of trucks, drivers, assignment statuses, and assignments.', route:'fleet' },
    { icon:'🔐', cls:'b6', title:'System Settings',              desc:'Separate views for Admin, Manager, and configuration for custom permissions.', route:'settings' },
  ];

  const quickStats = [
    { icon:'🚛', label:'Active Vehicles',  val:'3', cls:'blue',  delta:'↑1 vs yesterday', route:'fleet' },
    { icon:'📦', label:'Shipments Today',  val:'6', cls:'green', delta:'2 pending',       route:'shipments' },
    { icon:'🔄', label:'Return Loads',     val:'4', cls:'cyan',  delta:'₹15,400 revenue', route:'backhaul' },
    { icon:'📥', label:'Orders Inbox',     val:'15',cls:'amber', delta:'Need AI matching',route:'orders' },
  ];

  const steps = [
    { icon:'📍', label:'Delivery Complete', sub:'IoT confirms arrival', route:'tracking' },
    { icon:'🔍', label:'Scan Nearby Loads', sub:'GPS radius search',    route:'orders' },
    { icon:'🤝', label:'Auto-Assign',       sub:'Best match selected',  route:'backhaul' },
    { icon:'🗺️', label:'Route Optimized',   sub:'Return trip planned',  route:'fleet' },
    { icon:'✅', label:'Loaded Return',     sub:'No deadhead km',       route:'dashboard' },
  ];

  return (
    <div className="page-content">
      {/* Hero */}
      <div className="home-hero">
        <div className="hero-badge">
          <span className="live-dot" style={{ background:'#86efac' }} />
          System Active – 5 Vehicles Online
        </div>
        <h1>Smart IoT-Based Logistics<br />Management System</h1>
        <p>Reduce operational costs, eliminate empty return trips, and gain complete visibility over your entire logistics network with real-time IoT intelligence.</p>
        <div style={{ marginTop:24, display:'flex', gap:12, flexWrap:'wrap' }}>
          <button className="btn-sm primary" style={{ background:'white', color:'var(--blue-700)' }} onClick={() => onPage('dashboard')}>→ Open Dashboard</button>
          <button className="btn-sm outline" style={{ borderColor:'rgba(255,255,255,0.3)', color:'white', background:'rgba(255,255,255,0.1)' }} onClick={() => onPage('backhaul')}>🔄 Backhaul Optimization</button>
        </div>
        <div className="floating-card" style={{ background:'rgba(255,255,255,0.95)' }}>
          <div style={{ fontSize:11, color:'var(--grey-500)', marginBottom:4 }}>BACKHAUL EFFICIENCY</div>
          <div style={{ fontSize:22, fontWeight:800, color:'var(--green-500)', fontFamily:'Syne,sans-serif' }}>78%</div>
          <div style={{ fontSize:11, color:'var(--grey-500)' }}>Loaded return trips ↑12%</div>
          <div className="route-line" style={{ width:'100%' }} />
          <div style={{ fontSize:11, color:'var(--grey-500)' }}>vs 66% last month</div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {quickStats.map((s, i) => (
          <div key={i} className="stat-card" style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform:'translateY(-3px)' } }} onClick={() => onPage(s.route)} title={`Go to ${s.label}`}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-delta up">{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="section-header">
        <div>
          <div className="section-title">System Capabilities</div>
          <div className="section-sub">Click a capability to visit the module</div>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom:24 }}>
        {features.map((f, i) => (
          <div key={i} className="feature-card" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => onPage(f.route)} title={`Open ${f.title}`}>
            <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
            <h3 style={{ fontSize:15, marginBottom:8, letterSpacing:'-0.2px' }}>{f.title}</h3>
            <p style={{ fontSize:13, color:'var(--grey-500)', lineHeight:1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Backhaul flow */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">How Return Backhaul Works</div>
        </div>
        <div className="step-flow">
          {steps.map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="step-box" style={{ cursor: 'pointer' }} onClick={() => onPage(s.route)} title={`Go to connected page`}>
                <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--grey-800)' }}>{s.label}</div>
                <div style={{ fontSize:11, color:'var(--grey-500)', marginTop:2 }}>{s.sub}</div>
              </div>
              {i < arr.length - 1 && <div className="step-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ onPage }) {
  const totalDelivered = SHIPMENTS.filter(s => s.status === 'Delivered').length;
  const inTransit      = SHIPMENTS.filter(s => s.status === 'In Transit').length;
  const pending        = SHIPMENTS.filter(s => s.status === 'Pending' || s.status === 'Loading').length;
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          datasets: [
            { label:'Revenue (₹ 000s)', data:[120, 150, 140, 180, 210, 175, 130], borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.1)', tension:0.4, fill:true },
            { label:'Deliveries', data:[45, 52, 48, 65, 75, 58, 40], borderColor:'#2563eb', backgroundColor:'transparent', tension:0.4, borderDash:[5,5] }
          ]
        },
        options: { 
          responsive:true, 
          maintainAspectRatio:false, 
          plugins:{ legend:{ position:'top' }}, 
          scales:{ x:{ grid:{ display:false }}, y:{ grid:{ color:'rgba(0,0,0,0.05)' }}}
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const kpiCards = [
    { icon:'✅', cls:'green', label:'Delivered Today',  val:totalDelivered,                                     delta:'↑33% vs avg'                           },
    { icon:'🚛', cls:'blue',  label:'In Transit',       val:inTransit,                                          delta:`${(inTransit / VEHICLES.length * 100).toFixed(0)}% of fleet` },
    { icon:'⏳', cls:'amber', label:'Pending',          val:pending,                                            delta:'2 loading'                             },
    { icon:'📊', cls:'cyan',  label:'On-Time Rate',     val:'87%',                                              delta:'↑5% this week'                         },
  ];

  return (
    <div className="page-content">
      
      {/* QUICK ACTIONS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn-sm primary" onClick={() => onPage('orders')} style={{ display:'flex', alignItems:'center', gap:8, fontSize: 13, padding: '8px 16px' }}>
          <span style={{ fontSize: 16 }}>📝</span> Create Order
        </button>
        <button className="btn-sm primary" onClick={() => onPage('tracking')} style={{ display:'flex', alignItems:'center', gap:8, fontSize: 13, padding: '8px 16px', background:'var(--blue-700)', borderColor:'var(--blue-800)' }}>
          <span style={{ fontSize: 16 }}>📍</span> Live Geo-Map
        </button>
        <button className="btn-sm primary" onClick={() => onPage('backhaul')} style={{ display:'flex', alignItems:'center', gap:8, fontSize: 13, padding: '8px 16px', background:'var(--teal-600)', borderColor:'var(--teal-700)' }}>
          <span style={{ fontSize: 16 }}>🤖</span> Run AI Auto-Assign
        </button>
        <button className="btn-sm outline" onClick={() => onPage('analytics')} style={{ display:'flex', alignItems:'center', gap:8, fontSize: 13, padding: '8px 16px', marginLeft: 'auto' }}>
          <span style={{ fontSize: 16 }}>📈</span> See Full Reports
        </button>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {kpiCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-delta up">{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom:24 }}>
        {/* REVENUE CHART */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Weekly Performance Snapshot</div>
              <div className="section-sub">Revenue vs Deliveries</div>
            </div>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-header">
            <div>
              <div className="section-title">System Alerts</div>
              <div className="section-sub">Prioritized notifications</div>
            </div>
            <button className="btn-sm outline" onClick={() => alert('All alerts dismissed')}>Clear All</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {ALERTS_DATA.map((a, i) => (
              <div key={i} className={`alert ${a.type === 'warning' ? 'warning' : a.type === 'success' ? 'success' : 'info'}`} style={{ marginBottom: 10 }}>
                <span>{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}</span>
                <div style={{ flex:1 }}>{a.msg}</div>
                <span style={{ fontSize:11, color:'var(--grey-400)', whiteSpace:'nowrap' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom:24 }}>
        {/* Fleet status */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Fleet Summary</div>
              <div className="section-sub">Live vehicle stats</div>
            </div>
            <button className="btn-sm outline" onClick={() => onPage('fleet')}>Manage →</button>
          </div>
          {VEHICLES.slice(0, 4).map(v => (
            <div key={v.id} className="vehicle-row">
              <div className="vehicle-icon">🚛</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className="vehicle-id">{v.id}</span>
                  <Badge status={v.status} />
                </div>
                <div className="vehicle-route">{v.route}</div>
                <div className="progress-bar" style={{ marginTop:6 }}>
                  <div className="progress-fill blue" style={{ width:`${v.progress}%` }} />
                </div>
              </div>
              <div style={{ textAlign:'right', fontSize:12 }}>
                <div className="text-mono" style={{ color:'var(--blue-600)', fontWeight:600 }}>{v.progress}%</div>
                <div style={{ color:'var(--grey-400)' }}>{v.eta}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Backhaul summary (Moved alongside Fleet) */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Backhaul & Return Loads</div>
              <div className="section-sub">Vehicles ready for assignment</div>
            </div>
            <button className="btn-sm primary" onClick={() => onPage('backhaul')}>View Dashboard →</button>
          </div>
          <div className="scrollable" style={{ maxHeight: 310 }}>
            {COMPLETED_FOR_BACKHAUL.map((c, i) => (
              <div key={i} style={{ background:'var(--grey-50)', borderRadius:'var(--radius-sm)', padding:14, border:'1px solid var(--grey-200)', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:c.assignedReturn ? 'var(--green-100)' : 'var(--amber-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
                    {c.assignedReturn ? '✅' : '⏳'}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, fontFamily:'JetBrains Mono,monospace' }}>{c.vehicle}</div>
                    <div style={{ fontSize:11, color:'var(--grey-500)' }}>{c.driver} · {c.location}</div>
                  </div>
                  <div style={{ marginLeft:'auto' }}><Badge status={c.assignedReturn ? 'Assigned' : 'Pending'} /></div>
                </div>
                <div style={{ fontSize:11, color:'var(--grey-500)' }}>
                  {c.assignedReturn ? `Return load: ${c.assignedReturn}` : 'Awaiting return load assignment'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function TrackingPage() {
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [selected, setSelected] = useState(vehicles[0]);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map('live-map', { zoomControl:true }).setView([11.1271, 78.6569], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(map);

    vehicles.forEach(v => {
      const color = v.status === 'In Transit' ? '#2563eb' : v.status === 'Delivered' ? '#10b981' : '#f59e0b';
      const icon  = L.divIcon({
        html:`<div style="width:36px;height:36px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">🚛</div>`,
        className:'',
        iconAnchor:[18, 18],
      });
      const marker = L.marker([v.lat, v.lng], { icon }).addTo(map).bindPopup(`<b>${v.id}</b><br>${v.driver}<br>${v.status}`);
      markersRef.current[v.id] = marker;
    });

    L.polyline(
      [[11.0168,76.9558],[11.2500,77.5000],[11.5000,78.0000],[11.6643,78.1460]],
      { color:'#3b82f6', weight:3, dashArray:'8,4', opacity:0.7 }
    ).addTo(map);

    mapInstance.current = map;
  }, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehs => {
        const updated = prevVehs.map(v => {
          if (v.status !== 'In Transit') return v;
          
          const newLat = v.lat + (Math.random() - 0.5) * 0.05;
          const newLng = v.lng + (Math.random() - 0.5) * 0.05;
          
          const newSpeed = Math.max(40, Math.min(85, v.speed + Math.floor((Math.random() - 0.5) * 10)));
          const newFuel = Math.max(10, v.fuel - 0.1);
          const newTemp = Number((v.temp + (Math.random() - 0.5)).toFixed(1));
          const newHumid = Math.max(30, Math.min(90, Math.floor(v.humid + (Math.random() - 0.5) * 3)));

          if (markersRef.current[v.id]) {
            markersRef.current[v.id].setLatLng([newLat, newLng]);
          }
          
          return { ...v, lat: newLat, lng: newLng, speed: newSpeed, fuel: Number(newFuel.toFixed(1)), temp: newTemp, humid: newHumid };
        });
        
        setSelected(currSel => updated.find(u => u.id === currSel.id));
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mapInstance.current) mapInstance.current.setView([selected.lat, selected.lng], 12, { animate:true });
  }, [selected.id]);

  const sensorRows = [
    { label:'Temperature', val:selected.temp,     unit:'°C',   icon:'🌡️' },
    { label:'Humidity',    val:selected.humid,    unit:'%',    icon:'💧' },
    { label:'Fuel Level',  val:selected.fuel,     unit:'%',    icon:'⛽' },
    { label:'Speed',       val:selected.speed,    unit:'km/h', icon:'⚡' },
    { label:'Progress',    val:selected.progress, unit:'%',    icon:'📍' },
    { label:'ETA',         val:selected.eta,      unit:'',     icon:'⏱️' },
  ];

  const timelineItems = [
    { label:'Shipment Dispatched',  sub:selected.origin || 'Origin Warehouse', time:'08:15', status:'done'                                     },
    { label:'Checkpoint A – Highway', sub:`Speed: ${selected.speed} km/h · Fuel: ${selected.fuel}%`, time:'10:30', status:'done'                                     },
    { label:'En Route',             sub:`Progress: ${selected.progress}%`,      time:'Now',   status: selected.progress === 100 ? 'done' : 'active' },
    { label:'Expected Delivery',    sub:selected.dest || 'Destination Hub',     time:selected.eta, status: selected.progress === 100 ? 'done' : 'pending' },
  ];

  return (
    <div className="page-content">
      <div className="grid-2-1" style={{ marginBottom:20 }}>
        {/* Map */}
        <div className="card" style={{ padding:0, overflow:'hidden', position:'relative' }}>
          <div id="live-map" />
          <div className="map-overlay">
            <div className="map-pill" style={{ background:'var(--green-50)', color:'var(--green-600)', border:'1px solid var(--green-200)' }}><span className="live-dot" style={{ background:'var(--green-500)' }} />Live IoT Stream Active</div>
            <div className="map-pill">🛰️ {vehicles.length} vehicles</div>
          </div>
        </div>

        {/* Vehicle list */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--grey-100)' }}>
            <div className="section-title">Fleet</div>
            <div className="section-sub">{vehicles.length} vehicles</div>
          </div>
          <div style={{ overflow:'auto', maxHeight:380 }}>
            {vehicles.map(v => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                style={{ padding:'14px 18px', cursor:'pointer', borderBottom:'1px solid var(--grey-100)', background: selected.id === v.id ? 'var(--blue-50)' : 'white', transition:'background .15s' }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{v.id}</span>
                  <Badge status={v.status} />
                </div>
                <div style={{ fontSize:12, color:'var(--grey-500)' }}>{v.driver}</div>
                <div style={{ fontSize:12, color:'var(--grey-600)', marginTop:2 }}>{v.route}</div>
                <div className="progress-bar" style={{ marginTop:6 }}>
                  <div className="progress-fill blue" style={{ width:`${v.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IoT Sensors */}
      {selected && (
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">IoT Sensors — {selected.id}</div>
              <div className="section-sub">{selected.driver} · {selected.load}</div>
            </div>
            <Badge status={selected.status} />
          </div>

          <div className="sensor-grid">
            {sensorRows.map((s, i) => (
              <div key={i} className="sensor-card">
                <div className="sensor-label">{s.icon} {s.label}</div>
                <div className="sensor-val">{s.val}</div>
                <div className="sensor-unit">{s.unit}</div>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Delivery Timeline</div>
            <div className="timeline">
              {timelineItems.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${t.status}`} />
                  <div style={{ marginLeft:8 }}>
                    <div className="timeline-time">{t.time}</div>
                    <div className="timeline-label">{t.label}</div>
                    <div className="timeline-sub">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShipmentsPage() {
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);

  const statuses = ['All', 'In Transit', 'Delivered', 'Loading', 'Pending'];
  const filtered = filter === 'All' ? SHIPMENTS : SHIPMENTS.filter(s => s.status === filter);

  /* Detail view */
  if (selected) {
    const detailRows = [
      ['Origin', selected.origin], ['Destination', selected.dest],
      ['Type', selected.type],     ['Weight', selected.weight],
      ['Driver', selected.driver], ['Vehicle', selected.vehicle],
      ['Date', selected.date],     ['Cost', selected.cost],
    ];

    const timelineItems = [
      { label:'Order Created',  sub:'System confirmed',          time:'06:00', status:'done'                                                                         },
      { label:'Loaded at Origin', sub:selected.origin,          time:'08:15', status:'done'                                                                         },
      { label:'In Transit',     sub:`Vehicle ${selected.vehicle}`, time:'09:00', status: selected.status==='Delivered'?'done': selected.status==='In Transit'?'active':'pending' },
      { label:'Delivered',      sub:selected.dest,              time: selected.status==='Delivered'?'12:45':'—', status: selected.status==='Delivered'?'done':'pending' },
    ];

    return (
      <div className="page-content">
        <button className="btn-sm outline" style={{ marginBottom:16 }} onClick={() => setSelected(null)}>← Back to Shipments</button>
        <div className="grid-2">
          {/* Details card */}
          <div className="card">
            <h2 style={{ fontSize:20, marginBottom:4 }}>{selected.id}</h2>
            <p style={{ color:'var(--grey-500)', fontSize:13, marginBottom:20 }}>Shipment Details</p>
            {detailRows.map(([k, v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--grey-100)', fontSize:13 }}>
                <span style={{ color:'var(--grey-500)', fontWeight:500 }}>{k}</span>
                <span style={{ color:'var(--grey-900)', fontWeight:600, fontFamily: (k==='Vehicle'||k==='Cost') ? 'JetBrains Mono,monospace' : 'inherit' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Badge status={selected.status} />
              <PriorityBadge p={selected.priority} />
            </div>
          </div>

          {/* Timeline card */}
          <div className="card">
            <div className="section-title" style={{ marginBottom:16 }}>Shipment Timeline</div>
            <div className="timeline">
              {timelineItems.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${t.status}`} />
                  <div style={{ marginLeft:8 }}>
                    <div className="timeline-time">{t.time}</div>
                    <div className="timeline-label">{t.label}</div>
                    <div className="timeline-sub">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            {selected.status === 'Delivered' && (
              <div className="alert success" style={{ marginTop:16 }}>✅ Delivery confirmed. Vehicle eligible for backhaul assignment.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* List view */
  return (
    <div className="page-content">
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">All Shipments</div>
            <div className="section-sub">{filtered.length} records</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {statuses.map(s => (
              <button key={s} className={`btn-sm ${filter === s ? 'primary' : 'outline'}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th><th>Origin → Destination</th><th>Type</th><th>Weight</th>
                <th>Driver</th><th>Status</th><th>Priority</th><th>Cost</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="text-mono" style={{ fontWeight:600, color:'var(--blue-600)' }}>{s.id}</td>
                  <td style={{ fontSize:12 }}>
                    <div style={{ fontWeight:500 }}>{s.origin}</div>
                    <div style={{ color:'var(--grey-400)' }}>→ {s.dest}</div>
                  </td>
                  <td><span className="chip">{s.type}</span></td>
                  <td className="text-mono">{s.weight}</td>
                  <td style={{ fontSize:13 }}>{s.driver}</td>
                  <td><Badge status={s.status} /></td>
                  <td><PriorityBadge p={s.priority} /></td>
                  <td className="text-mono" style={{ fontWeight:600 }}>{s.cost}</td>
                  <td><button className="btn-sm outline" onClick={() => setSelected(s)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const [tab, setTab] = useState('performance');
  const perfRef     = useRef(null);
  const delayRef    = useRef(null);
  const routeRef    = useRef(null);
  const backhaulRef = useRef(null);
  const chartInstances = useRef({});

  useEffect(() => {
    const destroy = (key) => {
      if (chartInstances.current[key]) {
        chartInstances.current[key].destroy();
        delete chartInstances.current[key];
      }
    };

    const timer = setTimeout(() => {
      if (tab === 'performance' && perfRef.current) {
        destroy('perf');
        chartInstances.current['perf'] = new Chart(perfRef.current, {
          type: 'bar',
          data: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
              { label:'On-Time', data:[12,18,14,20,16,22,19], backgroundColor:'rgba(37,99,235,0.8)', borderRadius:6 },
              { label:'Delayed', data:[2,3,4,2,3,1,2],        backgroundColor:'rgba(239,68,68,0.7)',  borderRadius:6 },
            ],
          },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' }}, scales:{ x:{ grid:{ display:false }}, y:{ grid:{ color:'rgba(0,0,0,0.05)' }}}},
        });
      }
      if (tab === 'delays' && delayRef.current) {
        destroy('delay');
        chartInstances.current['delay'] = new Chart(delayRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Traffic','Weather','Loading','Mechanical','Other'],
            datasets: [{ data:[35,20,25,12,8], backgroundColor:['#3b82f6','#06b6d4','#f59e0b','#ef4444','#8b5cf6'], borderWidth:0 }],
          },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right' }}, cutout:'65%' },
        });
      }
      if (tab === 'routes' && routeRef.current) {
        destroy('route');
        chartInstances.current['route'] = new Chart(routeRef.current, {
          type: 'line',
          data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            datasets: [{ label:'Route Efficiency %', data:[72,75,74,80,83,87], borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,0.08)', tension:0.4, fill:true, pointBackgroundColor:'#2563eb' }],
          },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' }}, scales:{ y:{ min:60, max:100, grid:{ color:'rgba(0,0,0,0.05)' }}, x:{ grid:{ display:false }}}},
        });
      }
      if (tab === 'backhaul' && backhaulRef.current) {
        destroy('bh');
        chartInstances.current['bh'] = new Chart(backhaulRef.current, {
          type: 'bar',
          data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            datasets: [
              { label:'Loaded Returns', data:[55,60,62,68,72,78], backgroundColor:'rgba(16,185,129,0.8)', borderRadius:6 },
              { label:'Empty Returns',  data:[45,40,38,32,28,22], backgroundColor:'rgba(239,68,68,0.4)',   borderRadius:6 },
            ],
          },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' }}, scales:{ x:{ stacked:true, grid:{ display:false }}, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }}}},
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      Object.values(chartInstances.current).forEach(c => c && c.destroy());
      chartInstances.current = {};
    };
  }, [tab]);

  const kpiCards = [
    { icon:'📦', cls:'blue',  label:'Total Shipments', val:'156', delta:'↑23 vs last month'                },
    { icon:'✅', cls:'green', label:'On-Time Rate',    val:'87%', delta:'↑5% improvement'                  },
    { icon:'🔄', cls:'cyan',  label:'Backhaul Rate',   val:'78%', delta:'↑12% empty trips reduced'         },
    { icon:'⚡', cls:'amber', label:'Route Efficiency',val:'91%', delta:'↑4% optimized routes'             },
  ];

  const tabsMeta = [
    { key:'performance', label:'📊 Delivery Performance' },
    { key:'delays',      label:'⚠️ Delay Analysis'       },
    { key:'routes',      label:'🗺️ Route Efficiency'     },
    { key:'backhaul',    label:'🔄 Backhaul Efficiency'  },
  ];

  const chartDescriptions = {
    performance: 'Weekly delivery performance comparing on-time completions vs delays across all vehicles.',
    delays:      'Breakdown of delay causes. Traffic remains the primary factor; mitigation via dynamic rerouting in progress.',
    routes:      'Route efficiency trend showing improvement from intelligent backhaul and route optimization algorithms.',
    backhaul:    'Loaded vs empty return trips by month. The backhaul optimization system reduced empty returns by 34% since January.',
  };

  const vehiclePerf = [
    { v:'TN-001', d:'Rajan K.',   del:28, ot:89, bh:80, score:91 },
    { v:'TN-002', d:'Murugan S.', del:24, ot:87, bh:75, score:88 },
    { v:'TN-003', d:'Selvi R.',   del:31, ot:92, bh:83, score:94 },
    { v:'TN-004', d:'Arjun P.',   del:19, ot:84, bh:68, score:85 },
    { v:'KA-001', d:'Priya M.',   del:22, ot:90, bh:77, score:90 },
  ];

  return (
    <div className="page-content">
      <div className="grid-4" style={{ marginBottom:24 }}>
        {kpiCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-delta up">{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="tabs">
          {tabsMeta.map(t => (
            <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
        <div className="chart-wrap">
          {tab === 'performance' && <canvas ref={perfRef}     />}
          {tab === 'delays'      && <canvas ref={delayRef}    />}
          {tab === 'routes'      && <canvas ref={routeRef}    />}
          {tab === 'backhaul'    && <canvas ref={backhaulRef} />}
        </div>
        <div className="divider" />
        <div style={{ fontSize:13, color:'var(--grey-500)' }}>{chartDescriptions[tab]}</div>
      </div>

      {/* Vehicle performance table */}
      <div className="card" style={{ marginTop:20 }}>
        <div className="section-title" style={{ marginBottom:16 }}>Vehicle Performance Summary</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Vehicle</th><th>Driver</th><th>Deliveries</th><th>On-Time %</th><th>Backhaul %</th><th>Efficiency Score</th></tr>
            </thead>
            <tbody>
              {vehiclePerf.map(r => (
                <tr key={r.v}>
                  <td className="text-mono" style={{ fontWeight:700, color:'var(--blue-600)' }}>{r.v}</td>
                  <td>{r.d}</td>
                  <td style={{ fontWeight:600 }}>{r.del}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="progress-bar" style={{ width:60, display:'inline-block' }}>
                        <div className="progress-fill green" style={{ width:`${r.ot}%` }} />
                      </div>
                      <span style={{ fontSize:12 }}>{r.ot}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="progress-bar" style={{ width:60, display:'inline-block' }}>
                        <div className="progress-fill blue" style={{ width:`${r.bh}%` }} />
                      </div>
                      <span style={{ fontSize:12 }}>{r.bh}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: r.score >= 90 ? 'var(--green-100)' : 'var(--blue-100)', color: r.score >= 90 ? 'var(--green-500)' : 'var(--blue-600)' }}>
                      {r.score}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BackhaulPage() {
  const [assignments, setAssignments] = useState({});
  const [optimizing, setOptimizing]   = useState(null);
  const [tab, setTab]                 = useState('completed');

  const completedVehicles = VEHICLES.filter(v => v.status === 'Delivered');

  const assign = (vehicleId, loadId, loadData) => {
    setOptimizing(vehicleId);
    setTimeout(() => {
      setAssignments(a => ({ ...a, [vehicleId]: { ...loadData, id: loadId } }));
      setOptimizing(null);
    }, 1500);
  };

  const totalRevenue = Object.values(assignments).reduce((s, r) => s + parseInt(r.reward.replace(/[^0-9]/g, '')), 0);

  const tabsMeta = [
    { key:'completed', label:'✅ Completed Deliveries'  },
    { key:'loads',     label:'📦 Available Return Loads' },
    { key:'assigned',  label:'🔗 Assignments'            },
  ];

  return (
    <div className="page-content">
      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { icon:'🚛', cls:'green', label:'Completed Deliveries',   val:completedVehicles.length        },
          { icon:'📦', cls:'blue',  label:'Available Return Loads', val:RETURN_LOADS.length             },
          { icon:'🔗', cls:'cyan',  label:'Assigned Returns',       val:Object.keys(assignments).length },
          { icon:'💰', cls:'amber', label:'Revenue Recovered',      val: Object.keys(assignments).length > 0 ? `₹${totalRevenue.toLocaleString()}` : '₹0' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert info">
        🤖 <b>AI Engine Active:</b> Scanning for optimal return load matches based on vehicle location, weight capacity, and route alignment.
      </div>

      <div className="tabs">
        {tabsMeta.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* ── Completed deliveries tab ── */}
      {tab === 'completed' && (
        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Vehicles Ready for Backhaul</div>
              <div className="section-sub">These vehicles completed delivery and are awaiting return load assignment</div>
            </div>
          </div>
          <div className="grid-2">
            {completedVehicles.map(v => {
              const assigned     = assignments[v.id];
              const isOptimizing = optimizing === v.id;

              return (
                <div key={v.id} className={`bh-card ${assigned ? 'assigned' : ''}`}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background: assigned ? 'var(--green-100)' : 'var(--blue-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🚛</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, fontFamily:'JetBrains Mono,monospace', color:'var(--blue-700)' }}>{v.id}</div>
                      <div style={{ fontSize:12, color:'var(--grey-500)' }}>{v.driver}</div>
                    </div>
                    <Badge status={assigned ? 'Assigned' : 'Pending'} />
                  </div>

                  <div style={{ fontSize:12, color:'var(--grey-600)', marginBottom:8 }}>📍 Current location: <b>{v.location || 'Salem DC'}</b></div>
                  <div style={{ fontSize:12, color:'var(--grey-600)', marginBottom:12 }}>🏋️ Capacity: <b>3.5T available</b> · ⛽ Fuel: <b>{v.fuel}%</b></div>

                  {assigned ? (
                    <div style={{ background:'var(--green-100)', borderRadius:'var(--radius-sm)', padding:'10px 12px', fontSize:12 }}>
                      <div style={{ fontWeight:600, color:'var(--green-500)', marginBottom:4 }}>✅ Return Load Assigned</div>
                      <div style={{ color:'#065f46' }}>{assigned.from} → {assigned.to}</div>
                      <div style={{ color:'#065f46' }}>{assigned.type} · {assigned.weight} · {assigned.reward}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:'var(--grey-700)', marginBottom:8 }}>Best Matches Nearby:</div>
                      {RETURN_LOADS.slice(0, 2).map(rl => (
                        <div key={rl.id} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, background:'var(--grey-50)', padding:'8px 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--grey-200)' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:12, fontWeight:600 }}>{rl.from} → {rl.to}</div>
                            <div style={{ fontSize:11, color:'var(--grey-500)' }}>{rl.type} · {rl.weight} · {rl.distance} away</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontSize:12, fontWeight:700, color:'var(--green-500)' }}>{rl.reward}</div>
                            <div style={{ fontSize:11, color:'var(--blue-500)' }}>{rl.match}% match</div>
                          </div>
                          <button className="btn-sm success" style={{ fontSize:11, padding:'5px 10px' }} onClick={() => assign(v.id, rl.id, rl)} disabled={isOptimizing}>
                            {isOptimizing ? '…' : 'Assign'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Available loads tab ── */}
      {tab === 'loads' && (
        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Available Return Loads</div>
              <div className="section-sub">Nearby pickup orders waiting for assignment</div>
            </div>
          </div>
          <div className="grid-2">
            {RETURN_LOADS.map(rl => (
              <div key={rl.id} className="bh-card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <span className="text-mono" style={{ fontSize:13, fontWeight:700, color:'var(--blue-600)' }}>{rl.id}</span>
                  <span style={{ background:'var(--green-100)', color:'var(--green-500)', fontSize:11, padding:'3px 10px', borderRadius:10, fontWeight:700 }}>{rl.match}% match</span>
                </div>
                <div className="bh-route">
                  <div className="bh-route-from">
                    <div style={{ fontSize:10, color:'var(--grey-400)', marginBottom:2 }}>FROM</div>
                    <b style={{ fontSize:12 }}>{rl.from}</b>
                  </div>
                  <div className="bh-route-arrow">→</div>
                  <div className="bh-route-to">
                    <div style={{ fontSize:10, color:'var(--grey-400)', marginBottom:2 }}>TO</div>
                    <b style={{ fontSize:12 }}>{rl.to}</b>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                  <span className="chip">📦 {rl.type}</span>
                  <span className="chip">🏋️ {rl.weight}</span>
                  <span className="chip">📍 {rl.distance}</span>
                  <span className="chip">⏰ {rl.available}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:700, color:'var(--green-500)', fontSize:16, fontFamily:'JetBrains Mono,monospace' }}>{rl.reward}</span>
                  <button className="btn-sm primary" onClick={() => {
                    const v = completedVehicles.find(v => !assignments[v.id]);
                    if (v) assign(v.id, rl.id, rl);
                  }}>Auto-Assign</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Assignments tab ── */}
      {tab === 'assigned' && (
        <div>
          <div className="section-header">
            <div className="section-title">Assignment Summary</div>
          </div>

          {Object.keys(assignments).length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🔄</div>
                <div style={{ fontSize:15, fontWeight:600 }}>No assignments yet</div>
                <div style={{ fontSize:13, color:'var(--grey-400)', marginTop:4 }}>Assign return loads from the Completed Deliveries tab</div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Vehicle</th><th>Return Load</th><th>Route</th><th>Type</th><th>Revenue</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(assignments).map(([vId, rl]) => (
                      <tr key={vId}>
                        <td className="text-mono" style={{ fontWeight:700, color:'var(--blue-600)' }}>{vId}</td>
                        <td className="text-mono">{rl.id}</td>
                        <td style={{ fontSize:12 }}>
                          <div style={{ fontWeight:500 }}>{rl.from}</div>
                          <div style={{ color:'var(--grey-400)' }}>→ {rl.to}</div>
                        </td>
                        <td><span className="chip">{rl.type}</span></td>
                        <td style={{ fontWeight:700, color:'var(--green-500)', fontFamily:'JetBrains Mono,monospace' }}>{rl.reward}</td>
                        <td><Badge status="Assigned" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divider" />
              <div style={{ display:'flex', gap:24, justifyContent:'flex-end' }}>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--grey-500)' }}>Total Revenue Recovered</div>
                  <div style={{ fontSize:22, fontWeight:800, color:'var(--green-500)', fontFamily:'Syne,sans-serif' }}>₹{totalRevenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization info */}
          <div className="card" style={{ marginTop:16, background:'linear-gradient(135deg,var(--blue-900),var(--blue-700))', color:'white' }}>
            <div style={{ fontSize:17, fontFamily:'Syne,sans-serif', fontWeight:700, marginBottom:8 }}>🤖 Route Optimization Engine</div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.6, marginBottom:16 }}>
              The LogiFlow optimization engine uses real-time GPS data, load weight matching, and route distance analysis to find the most profitable return loads for each completed vehicle — minimizing deadhead kilometers and maximizing revenue per trip.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {[
                { label:'Avg Savings/Trip', val:'₹3,200' },
                { label:'Deadhead Reduced', val:'34%'    },
                { label:'CO₂ Saved',        val:'1.2T/mo'},
              ].map((s, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.1)', padding:'10px 16px', borderRadius:'var(--radius-sm)' }}>
                  <div style={{ fontSize:18, fontWeight:800, fontFamily:'Syne,sans-serif' }}>{s.val}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function FleetPage() {
  const [tab, setTab] = useState('drivers');
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);

  const [showDriverForm, setShowDriverForm] = useState(false);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', license: '', experience: '', status: 'Active' });

  const [showTruckForm, setShowTruckForm] = useState(false);
  const [truckForm, setTruckForm] = useState({ model: '', capacity: '', fuelType: 'Diesel', status: 'Active', location: '' });

  const handleAddDriver = () => {
    const newId = `DRV-00${drivers.length + 1}`;
    setDrivers([...drivers, { ...driverForm, id: newId }]);
    setShowDriverForm(false);
    setDriverForm({ name: '', phone: '', license: '', experience: '', status: 'Active' });
  };

  const handleAddTruck = () => {
    const newId = `TRK-${trucks.length + 100}`;
    setTrucks([...trucks, { ...truckForm, id: newId }]);
    setShowTruckForm(false);
    setTruckForm({ model: '', capacity: '', fuelType: 'Diesel', status: 'Active', location: '' });
  };

  return (
    <div className="page-content">
      <div className="card">
        <div className="tabs" style={{ marginBottom: 20 }}>
          <button className={`tab-btn ${tab === 'drivers' ? 'active' : ''}`} onClick={() => setTab('drivers')}>👨‍✈️ Drivers</button>
          <button className={`tab-btn ${tab === 'trucks' ? 'active' : ''}`} onClick={() => setTab('trucks')}>🚛 Trucks</button>
        </div>

        {tab === 'drivers' && (
          <div>
            <div className="section-header">
              <div className="section-title">Driver Information</div>
              <button className="btn-sm primary" onClick={() => setShowDriverForm(!showDriverForm)}>+ Add Driver</button>
            </div>
            
            {showDriverForm && (
              <div style={{ background: 'var(--blue-50)', padding: 16, borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>New Driver Registration</div>
                <div className="grid-2" style={{ gap: 12 }}>
                  <input className="form-input" placeholder="Full Name" value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} />
                  <input className="form-input" placeholder="Phone Number" value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value})} />
                  <input className="form-input" placeholder="License Number" value={driverForm.license} onChange={e => setDriverForm({...driverForm, license: e.target.value})} />
                  <input className="form-input" placeholder="Experience (yrs)" type="number" value={driverForm.experience} onChange={e => setDriverForm({...driverForm, experience: e.target.value})} />
                  <select className="form-select" value={driverForm.status} onChange={e => setDriverForm({...driverForm, status: e.target.value})}>
                    <option>Active</option><option>On Leave</option><option>Inactive</option>
                  </select>
                </div>
                <button className="btn-sm primary" style={{ marginTop: 12 }} onClick={handleAddDriver}>Save Driver</button>
              </div>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Driver ID</th><th>Name</th><th>Phone Info</th><th>License</th><th>Experience</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {drivers.map(d => (
                    <tr key={d.id}>
                      <td className="text-mono" style={{ fontWeight:700, color:'var(--blue-600)' }}>{d.id}</td>
                      <td style={{ fontWeight:600 }}>{d.name}</td>
                      <td>{d.phone}</td>
                      <td className="text-mono">{d.license}</td>
                      <td>{d.experience} yrs</td>
                      <td><Badge status={d.status === 'Active' ? 'Delivered' : 'Pending'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'trucks' && (
          <div>
            <div className="section-header">
              <div className="section-title">Truck Fleet Information</div>
              <button className="btn-sm primary" onClick={() => setShowTruckForm(!showTruckForm)}>+ Add Truck</button>
            </div>

            {showTruckForm && (
              <div style={{ background: 'var(--amber-50)', padding: 16, borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>New Truck Detail</div>
                <div className="grid-2" style={{ gap: 12 }}>
                  <input className="form-input" placeholder="Model (e.g. Tata Signa)" value={truckForm.model} onChange={e => setTruckForm({...truckForm, model: e.target.value})} />
                  <input className="form-input" placeholder="Capacity (e.g. 20T)" value={truckForm.capacity} onChange={e => setTruckForm({...truckForm, capacity: e.target.value})} />
                  <input className="form-input" placeholder="Current Location" value={truckForm.location} onChange={e => setTruckForm({...truckForm, location: e.target.value})} />
                  <select className="form-select" value={truckForm.fuelType} onChange={e => setTruckForm({...truckForm, fuelType: e.target.value})}>
                    <option>Diesel</option><option>CNG</option><option>Electric</option>
                  </select>
                  <select className="form-select" value={truckForm.status} onChange={e => setTruckForm({...truckForm, status: e.target.value})}>
                    <option>Active</option><option>Maintenance</option><option>Inactive</option>
                  </select>
                </div>
                <button className="btn-sm primary" style={{ marginTop: 12 }} onClick={handleAddTruck}>Save Truck</button>
              </div>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Truck ID</th><th>Make & Model</th><th>Capacity</th><th>Fuel Type</th><th>Location</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {trucks.map(t => (
                    <tr key={t.id}>
                      <td className="text-mono" style={{ fontWeight:700, color:'var(--blue-600)' }}>{t.id}</td>
                      <td style={{ fontWeight:600 }}>{t.model}</td>
                      <td><span className="chip">{t.capacity}</span></td>
                      <td>{t.fuelType}</td>
                      <td>{t.location}</td>
                      <td><Badge status={t.status === 'Active' ? 'In Transit' : 'Pending'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: '', items: '', weight: '', origin: '', dest: '', status: 'Pending Review', date: new Date().toISOString().split('T')[0] });
  const [optimizingOrder, setOptimizingOrder] = useState(null);

  const handleAddOrder = () => {
    const newId = `ORD-${orders.length + 1001}`;
    setOrders([{ ...form, id: newId }, ...orders]);
    setShowForm(false);
    setForm({ clientName: '', items: '', weight: '', origin: '', dest: '', status: 'Pending Review', date: new Date().toISOString().split('T')[0] });
  };

  const handleAutoAssign = (orderId) => {
    setOptimizingOrder(orderId);
    setTimeout(() => {
      // Find an active truck from the INITIAL_TRUCKS set pseudo-randomly
      const activeTrucks = INITIAL_TRUCKS.filter(t => t.status === 'Active');
      const assignedTruck = activeTrucks.length > 0 ? activeTrucks[Math.floor(Math.random() * activeTrucks.length)].id : 'TRK-105';
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Assigned', assignedTo: assignedTruck } : o));
      setOptimizingOrder(null);
    }, 1500); // 1.5s simulated AI matching delay
  };

  return (
    <div className="page-content">
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Order Management</div>
            <div className="section-sub">{orders.length} total orders</div>
          </div>
          <button className="btn-sm primary" onClick={() => setShowForm(!showForm)}>+ Add Order</button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--blue-50)', padding: 16, borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>New Order Request</div>
            <div className="grid-2" style={{ gap: 12 }}>
              <input className="form-input" placeholder="Client / Customer Name" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} />
              <input className="form-input" placeholder="Items Description" value={form.items} onChange={e => setForm({...form, items: e.target.value})} />
              <input className="form-input" placeholder="Weight/Volume (e.g. 5T)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
              <input className="form-input" placeholder="Origin Address" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} />
              <input className="form-input" placeholder="Destination Address" value={form.dest} onChange={e => setForm({...form, dest: e.target.value})} />
              <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option>Pending Review</option><option>Approved</option><option>Assigned</option>
              </select>
            </div>
            <button className="btn-sm primary" style={{ marginTop: 12 }} onClick={handleAddOrder}>Save Order</button>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Client</th><th>Items &amp; Weight</th><th>Route (Origin → Dest)</th><th>Date</th><th style={{ width: 220 }}>Status &amp; Assignment</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="text-mono" style={{ fontWeight:700, color:'var(--blue-600)' }}>{o.id}</td>
                  <td style={{ fontWeight:600 }}>{o.clientName}</td>
                  <td>
                    <div>{o.items}</div>
                    <div style={{ fontSize:12, color:'var(--grey-500)' }}>{o.weight}</div>
                  </td>
                  <td style={{ fontSize:12 }}>
                    <div style={{ fontWeight:500 }}>{o.origin}</div>
                    <div style={{ color:'var(--grey-400)' }}>→ {o.dest}</div>
                  </td>
                  <td className="text-mono" style={{ fontSize:12 }}>{o.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
                      <Badge status={o.status === 'Pending Review' ? 'Pending' : o.status === 'Approved' ? 'Loading' : 'Assigned'} />
                      
                      {o.status !== 'Assigned' ? (
                        <button 
                          className="btn-sm primary" 
                          style={{ padding: '6px 12px', minWidth: 105, display: 'flex', justifyContent: 'center' }}
                          onClick={() => handleAutoAssign(o.id)}
                          disabled={optimizingOrder === o.id}
                        >
                          {optimizingOrder === o.id ? 'Scanning...' : 'Auto-Assign'}
                        </button>
                      ) : (
                        <span className="chip" style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-200)', minWidth: 105, display: 'flex', justifyContent: 'center' }}>
                          🚛 {o.assignedTo || 'TRK-101'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@logiflow.io', role: 'System Administrator' });
  const [toggles, setToggles] = useState({ emailNotif: true, smsNotif: false, darkMode: false, autoAssign: true });

  const handleToggle = (key) => setToggles(t => ({ ...t, [key]: !t[key] }));

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Profile Settings</div>
        <div className="grid-3" style={{ gap: 16 }}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input className="form-input" value={profile.role} disabled />
          </div>
        </div>
        <button className="btn-sm primary" onClick={() => alert('Profile saved successfully!')}>Save Profile</button>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>System Preferences</div>
          
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--grey-100)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Enable Dark Mode</div>
              <div style={{ fontSize: 12, color: 'var(--grey-500)' }}>Switch to a dark color theme (Mock Toggle)</div>
            </div>
            <label style={{ position:'relative', display:'inline-block', width:40, height:24 }}>
              <input type="checkbox" checked={toggles.darkMode} onChange={() => handleToggle('darkMode')} style={{ opacity:0, width:0, height:0 }} />
              <span style={{ position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0, backgroundColor: toggles.darkMode ? 'var(--blue-600)' : 'var(--grey-300)', borderRadius:24, transition:'.4s' }}>
                <span style={{ position:'absolute', height:18, width:18, left: toggles.darkMode ? 18 : 3, bottom:3, backgroundColor:'white', transition:'.4s', borderRadius:'50%' }} />
              </span>
            </label>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--grey-100)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Email Notifications</div>
              <div style={{ fontSize: 12, color: 'var(--grey-500)' }}>Receive daily reports via email</div>
            </div>
            <label style={{ position:'relative', display:'inline-block', width:40, height:24 }}>
              <input type="checkbox" checked={toggles.emailNotif} onChange={() => handleToggle('emailNotif')} style={{ opacity:0, width:0, height:0 }} />
              <span style={{ position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0, backgroundColor: toggles.emailNotif ? 'var(--blue-600)' : 'var(--grey-300)', borderRadius:24, transition:'.4s' }}>
                <span style={{ position:'absolute', height:18, width:18, left: toggles.emailNotif ? 18 : 3, bottom:3, backgroundColor:'white', transition:'.4s', borderRadius:'50%' }} />
              </span>
            </label>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--grey-100)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>SMS Alerts</div>
              <div style={{ fontSize: 12, color: 'var(--grey-500)' }}>Receive urgent alerts via SMS</div>
            </div>
            <label style={{ position:'relative', display:'inline-block', width:40, height:24 }}>
              <input type="checkbox" checked={toggles.smsNotif} onChange={() => handleToggle('smsNotif')} style={{ opacity:0, width:0, height:0 }} />
              <span style={{ position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0, backgroundColor: toggles.smsNotif ? 'var(--blue-600)' : 'var(--grey-300)', borderRadius:24, transition:'.4s' }}>
                <span style={{ position:'absolute', height:18, width:18, left: toggles.smsNotif ? 18 : 3, bottom:3, backgroundColor:'white', transition:'.4s', borderRadius:'50%' }} />
              </span>
            </label>
          </div>
          
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0' }}>
            <div>
              <div style={{ fontWeight: 600 }}>AI Auto-Assign Backhauls</div>
              <div style={{ fontSize: 12, color: 'var(--grey-500)' }}>Automatically assign return trips based on match score</div>
            </div>
            <label style={{ position:'relative', display:'inline-block', width:40, height:24 }}>
              <input type="checkbox" checked={toggles.autoAssign} onChange={() => handleToggle('autoAssign')} style={{ opacity:0, width:0, height:0 }} />
              <span style={{ position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0, backgroundColor: toggles.autoAssign ? 'var(--blue-600)' : 'var(--grey-300)', borderRadius:24, transition:'.4s' }}>
                <span style={{ position:'absolute', height:18, width:18, left: toggles.autoAssign ? 18 : 3, bottom:3, backgroundColor:'white', transition:'.4s', borderRadius:'50%' }} />
              </span>
            </label>
          </div>

        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Security & API</div>
          <div className="form-group">
            <label>Current Password</label>
            <input className="form-input" type="password" value="********" readOnly />
          </div>
          <button className="btn-sm outline" style={{ marginBottom: 20 }}>Change Password</button>
          
          <div className="form-group" style={{ marginTop: 10 }}>
            <label>LogiFlow API Key</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" value="lf_pub_8x92nd91n2" readOnly style={{ flex: 1, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, background: 'var(--grey-50)' }} />
              <button className="btn-sm outline">Regenerate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser]               = useState(null);
  const [page, setPage]               = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <AuthPage onLogin={setUser} />;

  const PAGE_MAP = {
    home:      <HomePage      onPage={setPage} />,
    dashboard: <DashboardPage onPage={setPage} />,
    orders:    <OrdersPage    />,
    tracking:  <TrackingPage  />,
    shipments: <ShipmentsPage />,
    analytics: <AnalyticsPage />,
    backhaul:  <BackhaulPage  />,
    fleet:     <FleetPage     />,
    settings:  <SettingsPage  />,
  };

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        onPage={setPage}
        user={user}
        onLogout={() => setUser(null)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <TopBar page={page} setSidebarOpen={setSidebarOpen} onPage={setPage} />

        {PAGE_MAP[page] || (
          <div className="page-content">
            <div className="empty-state">
              <div className="empty-state-icon">🚧</div>
              <div>Page not found</div>
            </div>
          </div>
        )}

        <footer style={{ borderTop:'1px solid var(--grey-200)', padding:'16px 28px', background:'white', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'var(--grey-400)' }}>© 2024 LogiFlow — Smart IoT Logistics Management System</div>
          <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--grey-400)' }}>
            <span>📧 support@logiflow.io</span>
            <span>📞 +91 422-4000000</span>
            <span>📍 Tiruppur, TN</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
