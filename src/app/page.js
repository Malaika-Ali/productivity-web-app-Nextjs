"use client"
import Navbar from "../components/layout/dashboardLayout/Navbar.jsx";
import Sidebar from "../components/layout/dashboardLayout/Sidebar.jsx";
import Image from "next/image";
import Link from 'next/link'

export default function Home() {

  return (
    <>

      <Sidebar />
      <Navbar />
    </>
  );
}
