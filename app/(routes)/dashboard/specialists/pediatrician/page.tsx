"use client"
import dynamic from 'next/dynamic'

const PediatricianAgent = dynamic(
  () => import('./PediatricianAgent'),
  { ssr: false }
)

export default function PediatricianPage() {
  return <PediatricianAgent />
}