"use client";
import Image from "next/image";
import Hero from '../components/hero';
import About from './about/page';
import Features from '../components/features';
import Booking from './../components/howItWorks';

export default function Home() {
  return (
    <>
    <Hero/>
    {/* <Register/> */}
    {/* <VerifyEmailPage/> */}
    <About/>
    <Features/>
    <Booking/>
    </>
  );
}
