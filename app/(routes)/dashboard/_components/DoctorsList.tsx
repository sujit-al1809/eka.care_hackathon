"use client"
import { Button } from '@/components/ui/button'
import { AIDoctorAgents } from '@/shared/list'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoArrowForward } from 'react-icons/io5'

export type Doctor = {
  id: number
  specialist: string
  description: string
  image: string
  agentPrompt: string
  voiceId: string
  subscriptionRequired?: boolean
}

// Mapping for specialist routes
const specialistRoutes: { [key: string]: string } = {
  "General Physician": "/dashboard/specialists/general-physician",
  "Pediatrician": "/dashboard/specialists/pediatrician", 
  "Dermatologist": "/dashboard/specialists/dermatologist",
  "Psychologist": "/dashboard/specialists/psychologist",
  "Nutritionist": "/dashboard/specialists/nutritionist",
  "Cardiologist": "/dashboard/specialists/cardiologist",
  "ENT Specialist": "/dashboard/specialists/ent-specialist",
  "Orthopedic": "/dashboard/specialists/orthopedic",
  "Gynecologist": "/dashboard/specialists/gynecologist",
  "Dentist": "/dashboard/specialists/dentist"
}

function DoctorsList() {
  return (
    <div className='mt-10'>
      <h2 className="text-2xl font-bold">AI Specialist Doctors Agents</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
        {
          AIDoctorAgents.map((doctor: Doctor) => (
            <div
              key={doctor.id}
              className='border-2 border-gray-200 rounded-2xl p-4 hover:border-primary/40 transition-colors'
            >
              <Image src={doctor.image} alt={doctor.specialist} width={100} height={100} className='rounded-xl w-full h-[250px] object-cover' />
              <h2 className="font-bold mt-1">{doctor.specialist}</h2>
              <p className="line-clamp-2 text-sm text-gray-500">{doctor.description}</p>
              
              {/* Link to specialist page if route exists, otherwise show coming soon */}
              {specialistRoutes[doctor.specialist] ? (
                <Link href={specialistRoutes[doctor.specialist]}>
                  <Button className='bg-primary text-white mt-2 w-full hover:bg-primary/90'>
                    Start Consultation <IoArrowForward className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  className='mt-2 w-full cursor-not-allowed opacity-50'
                  disabled
                >
                  Coming Soon
                </Button>
              )}
              
              {doctor.subscriptionRequired && (
                <p className="text-xs text-orange-600 mt-1 text-center">Premium Feature</p>
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
