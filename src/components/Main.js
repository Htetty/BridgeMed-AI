import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from './Background';
import './Main.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);


const Main = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);

  const handleGoToDashboard = () => {
    navigate('/recordings');
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  
    if (error) {
      console.error('Login failed:', error.message);
    }
  };  

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight * 0.9);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    window.addEventListener('scroll', handleScroll);
    
    const sectionsToObserve = [aboutRef.current, featuresRef.current].filter(Boolean);
    sectionsToObserve.forEach(section => observer.observe(section));

    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      featureCards.forEach(card => observer.observe(card));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionsToObserve.forEach(section => {
        if (section) {
          observer.unobserve(section);
        }
      });
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll('.feature-card');
        featureCards.forEach(card => observer.unobserve(card));

      }
    };
  }, []);

  return (
    <div className="main-page">
      <Background />
      <header className={`main-header ${isSticky ? 'sticky' : ''}`}>
        <div className="logo">
          <span>BridgeMed-AI</span>
        </div>
        <nav className="main-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
        </nav>
        <div className="header-buttons">
        <button className="login-button" onClick={handleLogin}>Log in</button>

          <button className="try-now-button" onClick={handleGoToDashboard}>Try Now</button>
        </div>
      </header>

      <div id="home" className="hero-section">
        <p className="hero-subheading">AI-Powered Healthcare, Redefined.</p>
        <h1 className="hero-heading">Introducing BridgeMed-AI</h1>
        <div className="hero-buttons">
          <button className="try-button" onClick={handleGoToDashboard}>
            Try BridgeMed-AI <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <main className="page-content">
        <section id="about" className="content-section" ref={aboutRef}>
          <h2>About BridgeMed-AI</h2>
          <p>
            At the intersection of technology and healthcare, BridgeMed-AI is dedicated to revolutionizing patient care. Our platform leverages the power of artificial intelligence to provide accessible, reliable, and personalized medical information. We aim to empower both patients and healthcare professionals by bridging the communication gap and providing tools that enhance understanding and decision-making.
          </p>
        </section>

        <section id="features" className="content-section" ref={featuresRef}>
          <h2>Our Core Features</h2>
          <div className="features-grid">
            <div className="feature-card" style={{'--delay': '0s'}}>
              <h3>AI-Powered Diagnosis</h3>
              <p>Get instant, AI-driven insights into your symptoms. Our advanced algorithms analyze your information to provide potential diagnoses and recommend next steps.</p>
            </div>
            <div className="feature-card" style={{'--delay': '0.1s'}}>
              <h3>Appointment Scheduling</h3>
              <p>Seamlessly schedule appointments with top-rated doctors and specialists in your area. Our smart system helps you find the perfect match for your needs.</p>
            </div>
            <div className="feature-card" style={{'--delay': '0.2s'}}>
              <h3>Voice-to-Text Transcription</h3>
              <p>Never miss a detail from your doctor's visit. Our voice transcription service accurately records and transcribes your conversations for easy reference.</p>
            </div>
            <div className="feature-card" style={{'--delay': '0.3s'}}>
              <h3>3D Anatomical Visualization</h3>
              <p>Explore the human body like never before with our interactive 3D anatomical models. Understand your condition better with stunning, detailed visuals.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 BridgeMed-AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main; 