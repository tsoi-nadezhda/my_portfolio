import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Workflow from './components/Workflow';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AiAssistant from './components/AiAssistant';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Workflow />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AiAssistant />
    </LanguageProvider>
  );
}

export default App;
