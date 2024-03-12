/*
* This JSX file contains the Footer
* component.
* file Footer.jsx
* Authors Hamza Boukaftane and Arman Lidder
* date     2  april 2023
* Modified 11 april 2023
*/

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Player from "./Player";

export default function Footer() {
  function loadPlayer(pathname) {
    if (pathname.startsWith("/playlist")) {
      return <Player />;
    } else {
      return (
        <div>
          <p>
            Choisir une playlist à travers la
            <NavLink to="/index"> Bibliothèque</NavLink> pour la faire jouer
          </p>
        </div>
      );
    }
  }
  return (
    <footer id="playing-bar">
      {loadPlayer(useLocation().pathname)}
      <div id="creators">
        <p>Hamza Boukaftane.e1 2183376</p>
        <p>Arman Lidder.e2 2174916</p>
      </div>
    </footer>
  );
}
