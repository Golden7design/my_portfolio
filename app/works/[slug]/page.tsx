// app/works/[slug]/page.tsx
"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import './WorksDetails.css'
import ParallaxImage from '@/src/components/Works/ParallaxImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// Types
interface Work {
  slug: string
  title: string
  subtitle: string
  description: string
  year: string
  role: string
  technologies: string[]
  images: {
    hero: string
    desktop: string
    mobile: string
    details: string[]
  }
  link?: string
  github?: string
  challenge: string
  solution: string
  results: string[]
}

// Définir les font-family spécifiques par projet
const worksFontFamily: Record<string, string> = {
  'nashfood': '"Dancing Script", cursive', // Ou la font que vous voulez
  'Portfolio': 'var(--font-clash-display)',
  // Ajoutez vos projets ici
}

// Database de vos projets
const worksData: Record<string, Work> = {
  'nashfood': {
    slug: 'nashfood',
    title: 'Nash.',
    subtitle: 'Food Ordering Platform',
    description: 'A modern food ordering website with seamless user experience and real-time order tracking.',
    year: '2025',
    role: 'Full-Stack Developer & UI/UX Designer',
    technologies: ['React.js', 'Firebase', 'Express', 'CSS', 'Node.js', 'MongoDB'],
    images: {
      hero: '/assets/NashFoodDesk.png',
      desktop: '/assets/NashFoodDesk.png',
      mobile: '/assets/NashfoodPhones.jpg',
      details: [
        '/assets/NashFoodDesk.png',
        '/assets/NashfoodPhones.jpg',
      ]
    },
    link: 'https://nashfood.com',
    github: 'https://github.com/yourusername/nashfood',
    challenge: 'Creating an intuitive food ordering experience that works seamlessly across all devices while maintaining fast load times and real-time updates.',
    solution: 'Implemented a progressive web app with optimistic UI updates, server-side rendering for SEO, and WebSocket connections for real-time order tracking.',
    results: [
      '40% increase in conversion rate',
      '2.5s average page load time',
      '95% mobile satisfaction score'
    ]
  },
  // Ajoutez d'autres projets ici
}

const WorkDetail = () => {
  const params = useParams()
  const slug = params?.slug as string
  const work = worksData[slug]
  
  // Récupérer la font-family pour ce projet (fallback sur clash-display)
  const titleFontFamily = worksFontFamily[slug] || '"Dancing Script", cursive'

  if (!work) {
    return (
      <div className="work-not-found">
        <h1>Project not found</h1>
        <a href="/#works"><span><FontAwesomeIcon icon={faArrowLeft}/> </span> <span>Back to works</span></a>
      </div>
    )
  }

  return (
    <div className="work-detail">
      {/* Hero Section */}
      <section className="hero-work-section">
        <div className="hero-work-content">
          <span className="work-year">{work.year}</span>
          <h1 className="work-title" style={{ fontFamily: titleFontFamily }}>
            {work.title}
          </h1>
          <p className="work-subtitle">{work.subtitle}</p>
          <div className="work-meta">
            <span>{work.role}</span>
          </div>
        </div>
        <div className="hero-work-image">
          <ParallaxImage 
            src={work.images.hero}
            alt={work.title}
            speed={0.3}
          />
        </div>
      </section>

      {/* Overview */}
      <section className="overview-section">
        <div className="section-content">
          <h2>Overview</h2>
          <p className="large-text">{work.description}</p>
          
          <div className="tech-stack">
            <h3>Technologies</h3>
            <div className="tech-tags">
              {work.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          {(work.link || work.github) && (
            <div className="project-links">
              {work.link && (
                <a href={work.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                   <span>Visit Websites</span> <span> <FontAwesomeIcon icon={faArrowRight}/> </span>
                </a>
              )}
              {work.github && (
                <a href={work.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  View Code
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="challenge-section">
        <div className="section-content">
          <div className="challenge-grid">
            <div className="challenge-item">
              <h3>Challenge</h3>
              <p>{work.challenge}</p>
            </div>
            <div className="challenge-item">
              <h3>Solution</h3>
              <p>{work.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="showcase-section">
        <div className="showcase-grid">
          <div className="showcase-item large">
            <ParallaxImage 
              src={work.images.desktop}
              alt={`${work.title} desktop`}
              speed={0.2}
            />
          </div>
          <div className="showcase-item">
            <ParallaxImage 
              src={work.images.mobile}
              alt={`${work.title} mobile`}
              speed={0.15}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="results-section">
        <div className="section-content">
          <h2>Results</h2>
          <div className="results-grid">
            {work.results.map((result, index) => (
              <div key={index} className="result-item">
                <span className="result-number">{String(index + 1).padStart(2, '0')}</span>
                <p>{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="navigation-section">
        <a href="/#works" className="back-link">
          <span><FontAwesomeIcon icon={faArrowLeft}/> </span> <span>Back to works</span>
        </a>
      </section>
    </div>
  )
}

export default WorkDetail