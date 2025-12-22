"use client"
import React, { useEffect, useRef } from 'react'
import './Works.css'
import gsap from 'gsap'
import ReactLenis from 'lenis/react'
import ParallaxImage from './ParallaxImage'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Works = () => {
  const worksRef = useRef<HTMLDivElement>(null)
  const link1Ref = useRef<HTMLDivElement>(null)
  const link2Ref = useRef<HTMLDivElement>(null)

  // Gestion du changement de background
  useEffect(() => {
    const handleScroll = () => {
      if (!worksRef.current) return

      const rect = worksRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      let progress = 0
      
      if (rect.top <= 0) {
        progress = 1
      } else if (rect.top < windowHeight) {
        progress = 1 - (rect.top / windowHeight)
      }

      if (progress > 0.3) {
        document.body.classList.add('works-active')
      } else {
        document.body.classList.remove('works-active')
      }

      if (worksRef.current) {
        const titleOpacity = Math.min(progress * 2, 1)
        worksRef.current.style.setProperty('--title-opacity', titleOpacity.toString())
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('works-active')
    }
  }, [])

  // Animation GSAP pour les boutons
  useEffect(() => {
    const setupButtonAnimation = (linkElement: HTMLDivElement | null) => {
      if (!linkElement) return

      const pink = linkElement.querySelector(".pink1")
      if (!pink) return

      const hoverTL = gsap.timeline({ paused: true })

      hoverTL.to(pink, {
        width: "calc(100% + 1.3em)", 
        ease: "power2.out",
        duration: 0.4
      })

      hoverTL.to(pink, {
        width: "2em", 
        left: "calc(100% - 1.45em)",
        ease: "power3.inOut", 
        duration: 0.35
      })

      const handleMouseEnter = () => {
        hoverTL.restart()
      }

      const handleMouseLeave = () => {
        hoverTL.reverse()
      }

      linkElement.addEventListener("mouseenter", handleMouseEnter)
      linkElement.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        linkElement.removeEventListener("mouseenter", handleMouseEnter)
        linkElement.removeEventListener("mouseleave", handleMouseLeave)
      }
    }

    const cleanup1 = setupButtonAnimation(link1Ref.current)
    const cleanup2 = setupButtonAnimation(link2Ref.current)

    return () => {
      cleanup1?.()
      cleanup2?.()
    }
  }, [])

  return (
    <ReactLenis>
      <div className='works' ref={worksRef}>
        <h1 id='works' >Works</h1>
        <div className="container-works">
          
          {/* Work 1 */}
          <div className="works1">
            <div className="works1-left">
              <div className="img-left">
                <ParallaxImage 
                  src='/assets/NashFoodDesk.png'
                  alt='NashFood'
                  speed={0.2}
                />
              </div>
              
              <div className="work-desc">
                <p><span>Nash. </span>is a food ordering website</p>
                <Link href="/works/nashfood">
                  <div className="link" ref={link1Ref}>
                    <div className="pink1"></div>
                    <span className="learn-more">learn more</span>
                    <span className='button-arrow'>
                      <FontAwesomeIcon icon={faArrowRight}/>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="works1-right">
              <ParallaxImage 
                src='/assets/NashfoodPhones.jpg'
                alt='NashFood'
                speed={0.2}
              />        
            </div>
          </div>

          {/* Work 2 */}
          <div className="works1">
            <div className="works1-left">
              <div className="img-left">
                <ParallaxImage 
                  src='/assets/NashFoodDesk.png'
                  alt='NashFood'
                  speed={0.2}
                />
              </div>
              
              <div className="work-desc">
                <p><span>Nash. </span>is a food ordering website</p>
                <Link href="/works/nashfood">
                  <div className="link" ref={link2Ref}>
                    <div className="pink1"></div>
                    <span className="learn-more">learn more</span>
                    <span className='button-arrow'>
                      <FontAwesomeIcon icon={faArrowRight}/>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="works1-right">
              <ParallaxImage 
                src='/assets/NashfoodPhones.jpg'
                alt='NashFood'
                speed={0.2}
              />            
            </div>
          </div>

        </div>
      </div>
    </ReactLenis>
  )
}

export default Works