"use client"

import { useFrame } from "@react-three/fiber"
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

type AgentState = null | "listening" | "talking"

interface OrbProps {
  colors?: [string, string]
  seed?: number
  agentState?: AgentState
  size?: number
  clicked?: boolean
}

export const Orb = ({ colors = ["#93C5FD", "#DBEAFE"], agentState, clicked = false }: OrbProps) => {
  const meshRef = useRef<any>(null)
  const distortIntensity = agentState === "talking" ? 0.4 : agentState === "listening" ? 0.25 : 0.15
  const speed = agentState === "talking" ? 5 : agentState === "listening" ? 3 : 1
  
  // Colors based on click state
  const allColors = clicked ? [
    "#60A5FA", // light blue
    "#BFDBFE", // lighter blue
    "#FFFFFF", // white
    "#93C5FD", // sky blue
    "#DBEAFE", // very light blue
    "#FFFFFF", // white
  ] : [
    "#FFFFFF", // pure white
    "#F5F5F5", // off-white
    "#E8E8E8", // light gray
    "#FFFFFF", // pure white again
    "#FAFAFA", // off-white
    "#FFFFFF", // pure white again
  ]

  useFrame((state) => {
    if (meshRef.current) {
      // More pronounced rotation for bigger orb
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.1
      
      // Create dynamic color transitions
      const material = meshRef.current.material
      if (material) {
        const time = state.clock.elapsedTime
        
        // Use faster transitions for active states
        const transitionSpeed = agentState === "talking" ? 0.8 : agentState === "listening" ? 0.5 : 0.3
        
        // Cycle through light colors with smooth transitions
        const colorIndex1 = Math.floor(time * transitionSpeed) % allColors.length
        const colorIndex2 = (colorIndex1 + 1) % allColors.length
        const mixRatio = (time * transitionSpeed) % 1
        
        const color1 = new THREE.Color(allColors[colorIndex1])
        const color2 = new THREE.Color(allColors[colorIndex2])
        material.color.lerpColors(color1, color2, mixRatio)
        
        // Add extremely bright emissive glow effect for maximum visibility
        const pulseIntensity = agentState === "talking" ? 2.0 : agentState === "listening" ? 1.8 : 1.5
        const pulseSpeed = agentState === "talking" ? 3 : agentState === "listening" ? 2.5 : 2
        material.emissive.copy(material.color)
        material.emissive.multiplyScalar(pulseIntensity + Math.sin(time * pulseSpeed) * 0.8)
      }
    }
  })

  return (
    <Icosahedron ref={meshRef} args={[1, 1]}>
      <MeshDistortMaterial
        color={colors[0]}
        attach="material"
        distort={distortIntensity}
        speed={speed}
        roughness={0.1}
        metalness={0.8}
        emissive="#FFFFFF"
        emissiveIntensity={1.8}
      />
    </Icosahedron>
  )
}

export type { AgentState }
