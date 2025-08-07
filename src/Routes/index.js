import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pagelayout from '../layouts/PageLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Home/Login';
import Admin from '../pages/Home/Admin';

export const paths = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pagelayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path={'*'}element={<Notfoubd/>}/>
      </Routes>
    </BrowserRouter>
  );
};
