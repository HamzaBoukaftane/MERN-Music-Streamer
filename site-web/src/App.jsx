import { Routes, Route } from "react-router-dom";
import PlaylistProvider from "./contexts/PlaylistProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Playlist from "./pages/Playlist";
import "./assets/css/styles.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CreatePlaylist from "./pages/CreatePlaylist";

function App() {
  const routes = [
    { path: "/index", element: <Index /> },
    { path: "/about", element: <About /> },
    { path: "/playlist/:id", element: <Playlist /> },
    { path: "/create_playlist/:id", element: <CreatePlaylist /> },
    { path: "/create_playlist", element: <CreatePlaylist /> },
    { path: "/", element: <Index /> },
  ];

  return (
    <div id="container">
      <PlaylistProvider>
        <NavBar />
        <Routes>
          {routes.map((route, index) => (
            <Route key={route.id} path={route.path} element={route.element} />
          ))}
        </Routes>
        <Footer />
      </PlaylistProvider>
    </div>
  );
}

export default App;
