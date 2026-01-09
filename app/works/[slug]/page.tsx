// app/works/[slug]/page.tsx
"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import './WorksDetails.css'
import ParallaxImage from '@/src/components/Works/ParallaxImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { TransitionLink } from '@/src/components/TransitionLink/TransitionLink'
import Navbar from '@/src/components/Navbar/Navbar'

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

// Configuration complète par projet (font + couleur)
const worksConfig: Record<string, { fontFamily: string; color: string }> = {
  'nashfood': {
    fontFamily: 'var(--font-dancing)',
    color: '#FF6B35'
  },
  'portfolio': {
    fontFamily: 'var(--font-clash-display)',
    color: '#D7FB61'
  },
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
      hero: '/assets/nashfood-det1.avif',
      desktop: '/assets/nashfood-det3.avif',
      mobile: '/assets/nashfood-det2.avif',
      details: [
        '/assets/NashFoodDesk.avif',
        '/assets/NashfoodPhones.avif',
      ]
    },
    link: 'https://nashfood.netlify.app',
    github: 'https://github.com/Golden7design/Nash_Food',
    challenge: 'Creating an intuitive food ordering experience that works seamlessly across all devices while maintaining fast load times and real-time updates.',
    solution: 'I designed a progressive web application (PWA) in Node.js and Express, combining server-side rendering for optimal SEO, optimistic interface updates for a smooth user experience, and enhanced security via middleware on each sensitive endpoint.',
    results: [
      '40% increase in conversion rate',
      '2.5s average page load time',
      '95% mobile satisfaction score'
    ]
  },
  'portfolio': {
    slug: 'portfolio',
    title: "Nassir's Portfolio",
    subtitle: 'My portfolio',
    description: 'Portfolio in a refined neo-brutalist style',
    year: '2026',
    role: 'Developer & UI/UX Designer',
    technologies: ['Next.js', 'ThreeJS', 'GSAP', 'CSS', 'WebGL', 'Github Action'],
    images: {
      hero: '/assets/port_img2.avif',
      desktop: '/assets/port_img3.avif',
      mobile: '/assets/PortPhones2.avif',
      details: [
        '/assets/NashFoodDesk.avif',
        '/assets/PortPhones2.avif',
      ]
    },
    link: 'https://nassir.vercel.app',
    github: 'https://github.com/Golden7design/my_portfolio.git',
    challenge: 'The challenge was to design a portfolio that balances strong visual identity, smooth interactions, and high performance, while clearly communicating my skills and problem-solving approach.',
    solution: "The solution was to build a performant, accessible, and animation-driven portfolio that communicates my value clearly while showcasing my technical and creative skills.",
    results: [
      '-',
      '-',
      '-'
    ]
  },
  // Ajoutez d'autres projets ici
}

const WorkDetail = () => {
  const params = useParams()
  const slug = params?.slug as string
  const work = worksData[slug]
  
  // Récupérer la config pour ce projet (fallback sur config par défaut)
  const config = worksConfig[slug] || {
    fontFamily: 'var(--font-dancing)',
    color: '#ffffff'
  }

  // Déterminer la font family selon le slug
  const titleFontFamily = slug === 'nashfood' 
    ? 'var(--font-dancing)' 
    : 'var(--font-clash-display)';

  if (!work) {
    return (
      <>
        <Navbar />
        <div className="work-not-found">
          <h1>Project not found</h1>
          <TransitionLink href="/#works">
            <span><FontAwesomeIcon icon={faArrowLeft}/> </span>
            <span>Back to works</span>
          </TransitionLink>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Ajouter la Navbar */}
      <Navbar />
      
      <div className="work-detail">
        {/* Hero Section */}
        <section className="hero-work-section">
          <div className="hero-work-content">
            <span className="work-year">{work.year}</span>
                       <h1 
              className="work-title" 
              style={{ 
                fontFamily: titleFontFamily
              }}
            >
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
                     <span>Visit Website</span> <span className='arrow-visite'> <FontAwesomeIcon icon={faArrowRight}/> </span>
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
          <TransitionLink href="/#works" className="back-link">
            <span><FontAwesomeIcon icon={faArrowLeft}/> </span> 
            <span>Back to works</span>
          </TransitionLink>
        </section>
      </div>
    </>
  )
}

export default WorkDetail