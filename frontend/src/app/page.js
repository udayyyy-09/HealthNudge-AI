"use client";
import Image from "next/image";
import Hero from '../components/hero';
import About from './about/page';
import Features from '../components/features';
import Booking from './../components/howItWorks';
import MacbookScrollDemo from './../components/scroll';
export default function Home() {
  return (
    <>
    <Hero/>
    <MacbookScrollDemo/>
    <About/>
    <Features/>
    <Booking/>
    </>
  );
}
