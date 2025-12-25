import React, { useRef, useEffect } from 'react'
import './Skills.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Skills: React.FC = () => {
  const skillsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const skills = skillsRef.current
      if (!skills) return
    const categoryEls = Array.from(skills.querySelectorAll<HTMLDivElement>('.skill-category'))
    const tagEls = Array.from(skills.querySelectorAll<HTMLDivElement>('.skill-tag'))

    // Normaliser les data-category en minuscules pour éviter les différences de casse
    categoryEls.forEach(el => { if (el.dataset.category) el.dataset.category = el.dataset.category.toLowerCase() })
    tagEls.forEach(el => { if (el.dataset.category) el.dataset.category = el.dataset.category.toLowerCase() })

    const categories = categoryEls.map(el => el.dataset.category || '')

    const stepDuration = 0.7 // seconds of scroll per category (adjustable)

    // Activation visuelle d'une catégorie
    const activate = (cat: string) => {
      categoryEls.forEach(el => {
        const is = el.dataset.category === cat
        gsap.to(el, { opacity: is ? 1 : 0.4, duration: 0.4, ease: 'power2.out' })
      })
      tagEls.forEach(el => {
        const is = el.dataset.category === cat
        gsap.to(el, { opacity: is ? 1 : 0.4, borderColor: `rgba(225, 255, 1,${is ? 1 : 0.6})`, duration: 0.4, ease: 'power2.out' })
      })
    }

    // Initialisation : forcer un état deterministe (tout à 0.6 puis première catégorie à 1)
    gsap.set(categoryEls, { opacity: 0.4 })
    gsap.set(tagEls, { opacity: 0.4, borderColor: 'rgba(225, 255, 1,0.6)' })
    if (categories.length > 0) {
      const first = categories[0]
      gsap.set(categoryEls.filter(el => el.dataset.category === first), { opacity: 1 })
      gsap.set(tagEls.filter(el => el.dataset.category === first), { opacity: 1, borderColor: 'rgba(225, 255, 1,1)' })
      // appel initial pour consistance (maintient le comportement existant)
      activate(first)
    }

    // Timeline contrôlée par le scroll : chaque étape dure `stepDuration`
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: skills,
        start: 'top top',
        end: `+=${categories.length * stepDuration * 100}%`, // étend le scroll en fonction du nombre de catégories
        scrub: true,
        pin: true
      }
    })

    categories.forEach(cat => {
      // on ajoute une portion de timeline pour l'intervalle, puis on appelle activate
      tl.to({}, { duration: stepDuration }).call(() => activate(cat))
    })

    // Hover amélioré pour les tags
    const enterHandlers = new Map<Element, EventListener>()
    const leaveHandlers = new Map<Element, EventListener>()

    tagEls.forEach(tag => {
      const span = tag.querySelector('span')

      const handleEnter = () => {
        const currentOpacity = parseFloat(window.getComputedStyle(tag).opacity)
        // border alpha matches text opacity
        const border = `rgba(225, 255, 1,${currentOpacity})`

        gsap.killTweensOf(tag)
        gsap.killTweensOf(span)

        gsap.to(tag, {
          scale: 1.08,
          borderColor: border,
          backgroundColor: 'rgba(255,255,255,0.05)',
          duration: 0.25,
          ease: 'back.out(1.5)'
        })
        if (span) gsap.to(span, { y: -2, duration: 0.25, ease: 'back.out(1.5)' })
      }

      const handleLeave = () => {
        const currentOpacity = parseFloat(window.getComputedStyle(tag).opacity)
        const border = `rgba(225, 255, 1,${currentOpacity})`
        gsap.to(tag, { scale: 1, borderColor: border, backgroundColor: 'transparent', duration: 0.25, ease: 'power2.out' })
        if (span) gsap.to(span, { y: 0, duration: 0.25, ease: 'power2.out' })
      }

      tag.addEventListener('mouseenter', handleEnter)
      tag.addEventListener('mouseleave', handleLeave)
      enterHandlers.set(tag, handleEnter)
      leaveHandlers.set(tag, handleLeave)
    })

    // Cleanup
    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(s => s.kill())
      tagEls.forEach(tag => {
        const enter = enterHandlers.get(tag)
        const leave = leaveHandlers.get(tag)
        if (enter) tag.removeEventListener('mouseenter', enter)
        if (leave) tag.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return (
    <div className='skills' ref={skillsRef}>
      <h1>Skills</h1>
      <div className="skills-container">
      <div className="skill-left">
        <div className="skill-category" data-category="frontend" ><p>Frontend</p></div>
        <div className="skill-category" data-category="backend" ><p>Backend</p></div>
        <div className="skill-category" data-category="devops"><p>DevOps & CI/CD</p></div>
        <div className="skill-category" data-category="tools"><p>Tools</p></div>
      </div>

      <div className="skills-right">
        <div className="tech-list">
          <div className="skill-tag" data-category="frontend"><span>React JS</span></div>
          <div className="skill-tag" data-category="backend"><span>Express</span></div>
          <div className="skill-tag" data-category="devops"><span>Jenkins</span></div>
          <div className="skill-tag" data-category="frontend"><span>Next JS</span></div>
          <div className="skill-tag" data-category="tools"><span>Git</span></div>
          <div className="skill-tag" data-category="devops"><span>Github Action</span></div>
          <div className="skill-tag" data-category="backend"><span>Node JS</span></div>
          <div className="skill-tag" data-category="tools"><span>Figma</span></div>
          <div className="skill-tag" data-category="devops"><span>Docker</span></div>          
          <div className="skill-tag" data-category="frontend"><span>GSAP</span></div>
          <div className="skill-tag" data-category="backend"><span>PHP</span></div>
          <div className="skill-tag" data-category="tools"><span>Vs Code</span></div>
          <div className="skill-tag" data-category="devops"><span>GitLab CI/CD</span></div> 
          <div className="skill-tag" data-category="backend"><span>MongoDB</span></div>
          <div className="skill-tag" data-category="frontend"><span>Tailwind CSS</span></div>
          <div className="skill-tag" data-category="tools"><span>Github</span></div>
          <div className="skill-tag" data-category="backend"><span>PostgresSQL</span></div>
          <div className="skill-tag" data-category="backend"><span>TypeScript</span></div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Skills