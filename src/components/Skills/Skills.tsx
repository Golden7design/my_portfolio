import React, { useRef, useEffect } from 'react'
import './Skills.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const Skills: React.FC = () => {
  const skillsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
  if (!skillsRef.current) return

  const ctx = gsap.context(() => {
    const skills = skillsRef.current!

    const categoryEls = Array.from(
      skills.querySelectorAll<HTMLDivElement>('.skill-category')
    )
    const tagEls = Array.from(
      skills.querySelectorAll<HTMLDivElement>('.skill-tag')
    )

    // Normaliser les data-category
    categoryEls.forEach(el => {
      if (el.dataset.category) el.dataset.category = el.dataset.category.toLowerCase()
    })
    tagEls.forEach(el => {
      if (el.dataset.category) el.dataset.category = el.dataset.category.toLowerCase()
    })

    const categories = categoryEls.map(el => el.dataset.category || '')
    const stepDuration = 0.55

    // Activation visuelle
    const activate = (cat: string) => {
      categoryEls.forEach(el => {
        const isActive = el.dataset.category === cat
        gsap.to(el, {
          opacity: isActive ? 1 : 0.4,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      tagEls.forEach(el => {
        const isActive = el.dataset.category === cat
        gsap.to(el, {
          opacity: isActive ? 1 : 0.4,
          borderColor: `rgba(225,255,1,${isActive ? 1 : 0.6})`,
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    }

    // État initial déterministe
    gsap.set(categoryEls, { opacity: 0.4 })
    gsap.set(tagEls, {
      opacity: 0.4,
      borderColor: 'rgba(225,255,1,0.6)'
    })

    if (categories.length > 0) {
      activate(categories[0])
    }

    // Timeline scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: skills,
        start: 'top 8%',
        end: `+=${categories.length * stepDuration * 100}%`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      }
    })

    categories.forEach(cat => {
      tl.to({}, { duration: stepDuration }).call(() => activate(cat))
    })

    // Hover tags
    const enterHandlers = new Map<Element, EventListener>()
    const leaveHandlers = new Map<Element, EventListener>()

    tagEls.forEach(tag => {
      const span = tag.querySelector('span')

      const handleEnter = () => {
        const opacity = parseFloat(getComputedStyle(tag).opacity)
        const border = `rgba(225,255,1,${opacity})`

        gsap.killTweensOf([tag, span])

        gsap.to(tag, {
          scale: 1.08,
          borderColor: border,
          backgroundColor: 'rgba(255,255,255,0.05)',
          duration: 0.25,
          ease: 'back.out(1.5)'
        })

        if (span) {
          gsap.to(span, {
            y: -2,
            duration: 0.25,
            ease: 'back.out(1.5)'
          })
        }
      }

      const handleLeave = () => {
        const opacity = parseFloat(getComputedStyle(tag).opacity)
        const border = `rgba(225,255,1,${opacity})`

        gsap.to(tag, {
          scale: 1,
          borderColor: border,
          backgroundColor: 'transparent',
          duration: 0.25,
          ease: 'power2.out'
        })

        if (span) {
          gsap.to(span, {
            y: 0,
            duration: 0.25,
            ease: 'power2.out'
          })
        }
      }

      tag.addEventListener('mouseenter', handleEnter)
      tag.addEventListener('mouseleave', handleLeave)

      enterHandlers.set(tag, handleEnter)
      leaveHandlers.set(tag, handleLeave)
    })
  }, skillsRef)

  return () => {
    ctx.revert()
  }
}, [])


  return (
    <div className='skills' ref={skillsRef}>
      <h1>Skills</h1>
      <div className="skills-container">
      <div className="skill-left">
        <div className="skill-category" data-category="frontend" translate="no"><p>Frontend</p></div>
        <div className="skill-category" data-category="backend" ><p>Backend</p></div>
        <div className="skill-category" data-category="devops"><p>DevOps</p></div>
        <div className="skill-category" data-category="tools"><p>Tools</p></div>
      </div>

      <div className="skills-right">
        <div className="tech-list" translate="no">
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
          <div className="skill-tag" data-category="devops"><span>GitLab CI/CD</span></div> 
          <div className="skill-tag" data-category="tools"><span>Vs Code</span></div>
          <div className="skill-tag" data-category="backend"><span>MongoDB</span></div>
          <div className="skill-tag" data-category="frontend"><span>Tailwind CSS</span></div>
          <div className="skill-tag" data-category="tools"><span>Github</span></div>
          <div className="skill-tag" data-category="backend"><span>PostgresSQL</span></div>
          <div className="skill-tag" data-category="devops"><span>Terraform</span></div>
          <div className="skill-tag" data-category="backend"><span>TypeScript</span></div>
          <div className="skill-tag" data-category="frontend"><span>ThreeJS</span></div>
          <div className="skill-tag" data-category="devops"><span>AWS</span></div>
          <div className="skill-tag" data-category="devops"><span>Ansible</span></div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Skills