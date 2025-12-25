import React, { useRef, useEffect } from 'react'
import './Skills.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Skills: React.FC = () => {
  const skillsRef = useRef<HTMLDivElement | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const skills = skillsRef.current
    if (!skills) return

    const categoryEls = Array.from(skills.querySelectorAll<HTMLDivElement>('.skill-category'))
    const tagEls = Array.from(skills.querySelectorAll<HTMLDivElement>('.skill-tag'))

    // Normaliser les data-category en minuscules
    categoryEls.forEach(el => { 
      if (el.dataset.category) el.dataset.category = el.dataset.category.toLowerCase() 
    })
    tagEls.forEach(el => { 
      if (el.dataset.category) el.dataset.category = el.dataset.category.toLowerCase() 
    })

    const categories = categoryEls.map(el => el.dataset.category || '')

    // ✅ Désactiver le pin sur mobile
    const isMobile = window.innerWidth < 1000
    const stepDuration = 0.7

    // Activation visuelle d'une catégorie
    const activate = (cat: string) => {
      categoryEls.forEach(el => {
        const is = el.dataset.category === cat
        gsap.to(el, { opacity: is ? 1 : 0.4, duration: 0.4, ease: 'power2.out' })
      })
      tagEls.forEach(el => {
        const is = el.dataset.category === cat
        gsap.to(el, { 
          opacity: is ? 1 : 0.4, 
          borderColor: `rgba(225, 255, 1,${is ? 1 : 0.6})`, 
          duration: 0.4, 
          ease: 'power2.out' 
        })
      })
    }

    // Initialisation
    gsap.set(categoryEls, { opacity: 0.4 })
    gsap.set(tagEls, { opacity: 0.4, borderColor: 'rgba(225, 255, 1,0.6)' })
    
    if (categories.length > 0) {
      const first = categories[0]
      gsap.set(categoryEls.filter(el => el.dataset.category === first), { opacity: 1 })
      gsap.set(tagEls.filter(el => el.dataset.category === first), { 
        opacity: 1, 
        borderColor: 'rgba(225, 255, 1,1)' 
      })
      activate(first)
    }

    // Timeline avec ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: skills,
        start: 'top top',
        end: `+=${categories.length * stepDuration * 100}%`,
        scrub: true,
        pin: !isMobile, // ✅ Désactiver le pin sur mobile
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    })

    scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger

    categories.forEach(cat => {
      tl.to({}, { duration: stepDuration }).call(() => activate(cat))
    })

    // Hover pour les tags (desktop uniquement)
    const enterHandlers = new Map<Element, EventListener>()
    const leaveHandlers = new Map<Element, EventListener>()

    if (!isMobile) {
      tagEls.forEach(tag => {
        const span = tag.querySelector('span')

        const handleEnter = () => {
          const currentOpacity = parseFloat(window.getComputedStyle(tag).opacity)
          const border = `rgba(225, 255, 1,${currentOpacity})`

          gsap.killTweensOf(tag)
          if (span) gsap.killTweensOf(span)

          gsap.to(tag, {
            scale: 1.08,
            borderColor: border,
            backgroundColor: 'rgba(255,255,255,0.05)',
            duration: 0.25,
            ease: 'back.out(1.5)'
          })
          if (span) {
            gsap.to(span, { y: -2, duration: 0.25, ease: 'back.out(1.5)' })
          }
        }

        const handleLeave = () => {
          const currentOpacity = parseFloat(window.getComputedStyle(tag).opacity)
          const border = `rgba(225, 255, 1,${currentOpacity})`
          gsap.to(tag, { 
            scale: 1, 
            borderColor: border, 
            backgroundColor: 'transparent', 
            duration: 0.25, 
            ease: 'power2.out' 
          })
          if (span) {
            gsap.to(span, { y: 0, duration: 0.25, ease: 'power2.out' })
          }
        }

        tag.addEventListener('mouseenter', handleEnter)
        tag.addEventListener('mouseleave', handleLeave)
        enterHandlers.set(tag, handleEnter)
        leaveHandlers.set(tag, handleLeave)
      })
    }

    // Cleanup complet
    return () => {
      tl.kill()
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
      
      tagEls.forEach(tag => {
        const enter = enterHandlers.get(tag)
        const leave = leaveHandlers.get(tag)
        if (enter) tag.removeEventListener('mouseenter', enter)
        if (leave) tag.removeEventListener('mouseleave', leave)
        gsap.killTweensOf(tag)
        const span = tag.querySelector('span')
        if (span) gsap.killTweensOf(span)
      })
      
      categoryEls.forEach(el => gsap.killTweensOf(el))
    }
  }, [])

  return (
    <div className='skills' ref={skillsRef}>
      <h1>Skills</h1>
      <div className="skills-container">
        <div className="skill-left">
          <div className="skill-category" data-category="frontend"><p>Frontend</p></div>
          <div className="skill-category" data-category="backend"><p>Backend</p></div>
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