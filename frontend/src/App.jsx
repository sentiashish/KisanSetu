import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  ClipboardList,
  HelpCircle,
  Home,
  Sprout,
  UsersRound,
} from 'lucide-react'
import './App.css'

const navigation = [
  { to: '/', label: 'होम', icon: Home, end: true },
  { to: '/workers', label: 'कामगार', icon: UsersRound },
  { to: '/requests', label: 'अनुरोध', icon: ClipboardList },
  { to: '/help', label: 'मदद', icon: HelpCircle },
]

function Header() {
  return (
    <header className="app-header">
      <NavLink className="brand" to="/">
        <span className="brand-mark" aria-hidden="true"><Sprout size={23} /></span>
        <span>
          <strong>KisanSetu</strong>
          <small>किसान का साथी</small>
        </span>
      </NavLink>
      <button className="icon-button" type="button" aria-label="सूचनाएं">
        <Bell size={22} />
        <span className="notification-dot" aria-hidden="true" />
      </button>
    </header>
  )
}

function TabBar() {
  return (
    <nav className="tab-bar" aria-label="मुख्य मेनू">
      {navigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          className={({ isActive }) => `tab-link${isActive ? ' active' : ''}`}
          end={end}
          key={to}
          to={to}
        >
          <Icon size={22} strokeWidth={2.2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function PageIntro({ eyebrow, title, children }) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </div>
  )
}

function HomePage() {
  return (
    <>
      <PageIntro eyebrow="आज का काम" title="नमस्ते, किसान जी">
        <p className="intro-copy">अपने भरोसे के कामगार से जल्दी पूछें।</p>
      </PageIntro>
      <section className="hero-panel" aria-labelledby="hero-title">
        <div>
          <span className="panel-kicker">कामगार उपलब्धता</span>
          <h2 id="hero-title">आज किसकी जरूरत है?</h2>
          <p>अपने जाने-पहचाने कामगार को एक अनुरोध भेजें।</p>
          <NavLink className="primary-action" to="/requests/new">
            अनुरोध भेजें <ArrowRight size={19} />
          </NavLink>
        </div>
        <div className="hero-sun" aria-hidden="true"><Sprout size={52} /></div>
      </section>
      <section className="section-block" aria-labelledby="overview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">झलक</p>
            <h2 id="overview-title">आपका काम</h2>
          </div>
          <NavLink className="text-link" to="/requests">सब देखें <ArrowRight size={16} /></NavLink>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><span>कामगार</span><strong>0</strong><small>अभी जोड़ें</small></div>
          <div className="stat-card accent"><span>अनुरोध</span><strong>0</strong><small>कोई नया नहीं</small></div>
        </div>
      </section>
    </>
  )
}

function WorkersPage() {
  return (
    <>
      <PageIntro eyebrow="मेरी सूची" title="कामगार">
        <p className="intro-copy">अपने जाने-पहचाने कामगार यहां रखें।</p>
      </PageIntro>
      <div className="empty-state">
        <div className="empty-icon"><UsersRound size={30} /></div>
        <h2>अभी कोई कामगार नहीं</h2>
        <p>नाम और फोन नंबर से अपना पहला कामगार जोड़ें।</p>
        <button className="primary-action" type="button">कामगार जोड़ें <ArrowRight size={19} /></button>
      </div>
    </>
  )
}

function RequestsPage() {
  return (
    <>
      <PageIntro eyebrow="काम की खबर" title="अनुरोध">
        <p className="intro-copy">आपके भेजे अनुरोध और जवाब यहां दिखेंगे।</p>
      </PageIntro>
      <div className="empty-state compact">
        <div className="empty-icon"><ClipboardList size={30} /></div>
        <h2>अभी कोई अनुरोध नहीं</h2>
        <p>कामगार को उपलब्धता पूछने के लिए अनुरोध भेजें।</p>
        <NavLink className="primary-action" to="/requests/new">नया अनुरोध <ArrowRight size={19} /></NavLink>
      </div>
    </>
  )
}

function HelpPage() {
  return (
    <>
      <PageIntro eyebrow="साथ चाहिए?" title="मदद">
        <p className="intro-copy">KisanSetu को सरल और सुरक्षित तरीके से इस्तेमाल करें।</p>
      </PageIntro>
      <div className="help-list">
        <div><strong>कामगार</strong><span>सिर्फ अपने जाने-पहचाने कामगार जोड़ें।</span></div>
        <div><strong>अनुरोध</strong><span>हर काम के लिए एक उपलब्धता अनुरोध भेजें।</span></div>
        <div><strong>जवाब</strong><span>कामगार के असली जवाब का इंतजार करें।</span></div>
      </div>
    </>
  )
}

function PlaceholderPage() {
  return <div className="empty-state compact"><h2>यह पेज जल्द तैयार होगा</h2></div>
}

function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<WorkersPage />} path="/workers" />
          <Route element={<RequestsPage />} path="/requests" />
          <Route element={<PlaceholderPage />} path="/requests/new" />
          <Route element={<HelpPage />} path="/help" />
          <Route element={<PlaceholderPage />} path="*" />
        </Routes>
      </main>
      <TabBar />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
