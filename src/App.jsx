import React from "react";
import Home from "./Home";
import { MyProvider } from "./Context";
import { Route, Routes } from "react-router-dom";
import About from "./Components/About";
import Contact from "./Components/Contact";
function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={
          <MyProvider>
            <Home />
          </MyProvider>
        } />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    </>
  );
}

export default App;