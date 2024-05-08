declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}

import 'react';
import prisma from '../lib/prisma';
import Head from "next/head";
import { useState } from 'react';

export const getServerSideProps = async ({ req }) => {
  const score = await prisma.score.findMany({
  })
  return { props: {score} }
}

export default ({ score }) => {

  const [sortedBy, setSortedBy] = useState(null); // Estado para almacenar el criterio de ordenación
  const [ascending, setAscending] = useState(true); // Estado para almacenar el sentido de la ordenación
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda  ************

  // Función para ordenar los scores según el criterio seleccionado
  const sortScores = (criteria) => {
    if (sortedBy === criteria) {
      setAscending(!ascending); // Si ya estamos ordenando por el mismo criterio, cambia el sentido de la ordenación
    } else {
      setSortedBy(criteria); // Establece el nuevo criterio de ordenación
      setAscending(true); // Establece el sentido de la ordenación a ascendente por defecto
    }
  };

  // Función para comparar los scores según el criterio de ordenación
  const compareScores = (a, b) => {
    if (a[sortedBy] < b[sortedBy]) {
      return ascending ? -1 : 1; // Si el sentido de la ordenación es ascendente, devuelve -1; si no, devuelve 1
    }
    if (a[sortedBy] > b[sortedBy]) {
      return ascending ? 1 : -1; // Si el sentido de la ordenación es ascendente, devuelve 1; si no, devuelve -1
    }
    return 0;
  };

  // Función para filtrar los scores por nombre
  const filteredScores = score.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>EARTH INTRUDERS SCOREBOARD</title>
        <meta name="title" content="Lista de mejores partidas de Earth Intruders" />
        <meta
          name="description"
          content="Lista de mejores partidas de Earth Intruders"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Lista de mejores partidas de Earth Intruders" />
        <meta
          property="og:description"
          content="Lista de mejores partidas de Earth Intruders"
        />
      </Head>
      <div className="w-full text-center bg-blue-800 flex flex-wrap items-center">
        <div className="text-3xl w-1/2 text-white mx-2 md:mx-auto py-10">
          Scoreboard Earth Intruders
        </div>

        {/* Botones para ordenar por diferentes criterios */}
        <button onClick={() => sortScores('id')}>Ordenar por ID</button>
        <button onClick={() => sortScores('puntuacion')}>Ordenar por Puntuación</button>
        <button onClick={() => sortScores('duracion')}>Ordenar por Duración</button>
        
        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-gray-200 py-10">
        {score.sort(compareScores).map(({id, name, puntuacion, duracion, date}) => ( //la queremos en date o tiempo de partida
          <div
            className="flex bg-white shadow-lg rounded-lg mx-2 md:mx-auto mb-10 max-w-2xl"
            key={id}
          >
            <div className="flex items-start px-4 py-6">
              <div className="">
                <div className="inline items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 -mt-1">
                    {id}
                  </h2>
                  <small className="text-sm text-gray-700 object-right">
                    Id: {id}
                  </small>
                  <small className="ml-3 text-gray-700 text-sm">
                    Name: {name}
                  </small>
                  <small className="ml-3 text-gray-700 text-sm">
                    Puntuacion: {puntuacion}
                  </small>
                  <small className="ml-3 text-gray-700 text-sm">
                    Duracion: {duracion}
                  </small>
                  <small className="ml-3 text-gray-700 text-sm">
                    Date: {date.toString().substring(0,10)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};