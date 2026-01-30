"use client"
import dynamic from 'next/dynamic'

const GeneralPhysicianAgent = dynamic(
  () => import('./GeneralPhysicianAgent'),
  { ssr: false }
)

export default function GeneralPhysicianPage() {
  return <GeneralPhysicianAgent />
}