"use client"
import dynamic from 'next/dynamic'

const DermatologistAgent = dynamic(
  () => import('./DermatologistAgent'),
  { ssr: false }
)

export default function DermatologistPage() {
  return <DermatologistAgent />
}