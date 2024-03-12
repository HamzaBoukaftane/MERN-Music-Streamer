/*
* This JSX file contains the About
* page.
* file About.jsx
* Authors Hamza Boukaftane and Arman Lidder
* date     2  april 2023
* Modified 11 april 2023
*/
import React from "react";

export default function About() {
  return (
    <main id="main-area" className="flex-column">
      <section className="flex-column align-center">
        <h1>PolyPlay</h1>
        <p>
          Ce projet est un simple gestionnaire de listes de chansons (Playlists)
        </p>
        <p>
          Vous pouvez générer des playlists composés des chansons disponibles
          sur le service
        </p>
        <p>
          Vous pouvez utiliser les raccourcis suivants lorsqu'une chanson joue:
        </p>
        <ul>
          <li>Espace : jouer/pause</li>
          <li>N : prochaine chanson</li>
          <li>P : chansons précédante</li>
          <li>J : reculer de 5 secondes</li>
          <li>L : avancer de 5 secondes</li>
          <li>M : activer/fermer le son</li>
        </ul>
      </section>
    </main>
  );
}
