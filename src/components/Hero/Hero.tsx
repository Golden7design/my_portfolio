import React, { useEffect, useRef } from 'react'
import './Hero.css'
import { me } from './me'
import ParticlesCanvas from './ParticlesCanvas'
import { TechLogos } from '../techlogo/TechLogos'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const Hero = () => {
  const firstnameRef = useRef<HTMLSpanElement>(null)
  const lastnameRef = useRef<HTMLSpanElement>(null)
  const jobRef = useRef<HTMLHeadingElement>(null)
  const messageRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Split text avec GSAP
    const firstnameSplit = new SplitText(firstnameRef.current, { type: 'chars' })
    const lastnameSplit = new SplitText(lastnameRef.current, { type: 'chars' })
    const jobSplit = new SplitText(jobRef.current, { type: 'chars' })
    const messageSplit = new SplitText(messageRef.current, { type: 'chars' })

    // Configuration initiale
    gsap.set([firstnameSplit.chars, lastnameSplit.chars, jobSplit.chars, messageSplit.chars], {
      opacity: 0,
      yPercent: 120,
      rotationX: -90,
      transformOrigin: '50% 100%',
    })

    // Timeline principale
    const tl = gsap.timeline({ delay: 0.3 })

    // Animation du prénom (plus rapide et dynamique)
    tl.to(firstnameSplit.chars, {
      opacity: 1,
      yPercent: 0,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'expo.out',
    })

    // Animation du nom (légèrement décalé)
    tl.to(lastnameSplit.chars, {
      opacity: 1,
      yPercent: 0,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'expo.out',
    }, '-=0.8')

    // Animation du job
    tl.to(jobSplit.chars, {
      opacity: 1,
      yPercent: 0,
      rotationX: 0,
      duration: 1,
      stagger: 0.02,
      ease: 'power3.out',
    }, '-=0.9')

    // Animation du message
    tl.to(messageSplit.chars, {
      opacity: 1,
      yPercent: 0,
      rotationX: 0,
      duration: 1,
      stagger: 0.02,
      ease: 'power3.out',
    }, '-=0.8')

    return () => {
      firstnameSplit.revert()
      lastnameSplit.revert()
      jobSplit.revert()
      messageSplit.revert()
    }
  }, [])

  return (
    <section className='hero'>
      <ParticlesCanvas/>

      <div className="hero-container">
        <div className="presente">
          <h3 className='myjob' translate="no" ref={jobRef}>{me.job}</h3>
          <h4 className='mymessage' translate="no" ref={messageRef}>{me.message}</h4>          
        </div>
        <div className="hero-name">
          <h1>
            <span className='firstname' translate="no" ref={firstnameRef}>Nassir</span>
            <span className='lastname' translate="no" ref={lastnameRef}>&nbsp;GOUOMBA</span>
          </h1>
        </div>
      </div>

      <div className="links-content">
        <div className="bar-content">
          <div className="dot"></div>
          <div className="bar"></div>
          <div className="dot"></div>
        </div>
        <div className="links">
          <TechLogos.GitHub/>
          <TechLogos.LinkedIn/>
          <TechLogos.Whatsapp/>
        </div>
      </div>
    </section>
  )
}

export default Hero