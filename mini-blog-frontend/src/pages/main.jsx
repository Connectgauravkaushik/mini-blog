import React from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { HeroSection } from "./HeroSection/HeroSection";
import AllBlogs from "./Blogcard/AllBlogs";

function MainLayout() {
  return (
    <>
           <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const App = () => {


  return (
    <div className="min-h-screen bg-linear-to-b from-white to-slate-50 text-slate-800 antialiased">
      <Header />

      <main>
        <HeroSection />
         <AllBlogs/>
       
   
      </main>
    </div>
  );
};

export default App;
