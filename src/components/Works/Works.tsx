"use client"
import React, { useEffect, useRef } from 'react'
import './Works.css'
import gsap from 'gsap'
import ReactLenis from 'lenis/react'
import ParallaxImage from './ParallaxImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { TransitionLink } from '../TransitionLink/TransitionLink'

const Works = () => {
  const link1Ref = useRef<HTMLDivElement>(null)
  const link2Ref = useRef<HTMLDivElement>(null)

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
      <div className='works'>
        <h1 id='works' >Works</h1>
        <div className="container-works">
          
          {/* Work 1 */}
          <div className="works1">
            <div className="works1-left">
              <div className="img-left">
                <ParallaxImage 
                  src='/assets/NashFoodDesk.avif'
                  alt='NashFood'
                  speed={0.2}
                />
              </div>
              
              <div className="work-desc">
                <p className='nashfood' ><span className='nash-name' >Nash. </span><span className='opa_desc' >Full-stack food ordering platform.</span></p>
                                   <TransitionLink href="/works/nashfood">
     <div className="link" ref={link1Ref}>
       <div className="pink1"></div>
       <span className="learn-more">learn more</span>
       <span className='button-arrow'>
         <FontAwesomeIcon icon={faArrowRight}/>
       </span>
     </div>
   </TransitionLink>
              </div>
            </div>
            
            <div className="works1-right">
              <ParallaxImage 
                src='/assets/NashfoodPhones.avif'
                alt='NashFood'
                speed={0.2}
              />        
            </div>
          </div>

          {/* Work 2 */}
          <div className="works1">

            <div className="works1-right">
              <ParallaxImage 
                src='/assets/PortPhones.avif'
                alt='NashFood'
                speed={0.2}
              />            
            </div>

            <div className="works1-left">
              <div className="img-left">
                <ParallaxImage 
                  src='/assets/PortDesk.avif'
                  alt='NashFood'
                  speed={0.2}
                />
              </div>
              
              <div className="work-desc">
                <p className='portfolio'><span className='port-name' >Nassir's Portfolio </span> <span className='opa_desc'   >My personal showcase.</span></p>
                   <TransitionLink href="/works/nashfood">
     <div className="link" ref={link2Ref}>
       <div className="pink1"></div>
       <span className="learn-more">learn more</span>
       <span className='button-arrow'>
         <FontAwesomeIcon icon={faArrowRight}/>
       </span>
     </div>
   </TransitionLink>
              </div>
            </div>
            

          </div>

        </div>
      </div>
    </ReactLenis>
  )
}

export default Works