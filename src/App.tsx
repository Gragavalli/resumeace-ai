import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Builder from './pages/Builder'
import Analysis from './pages/Analysis'
import About from './pages/About'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import { ResumeProvider } from './context/ResumeContext'

export default function App() {
  return (
    <ResumeProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ResumeProvider>
  )
}
