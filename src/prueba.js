// Componente de lista de audios donde redirigimos a la edición
import React from "react";
import { useHistory } from "react-router-dom";

const ListaDeAudios = () => {
  const history = useHistory();

  const handleEdit = (id) => {
    history.push(`/Proyecto/Interface/${id}`);
  };

  const audios = [
    { id_audio: 1, nombre: "Audio 1", audio: "audio1.mp4" },
    { id_audio: 2, nombre: "Audio 2", audio: "audio2.mp4" },
    { id_audio: 3, nombre: "Audio 3", audio: "audio3.mp4" },
  ];

  return (
    <div>
      <h2>Lista de Audios</h2>
      <ul>
        {audios.map((audio) => (
          <li key={audio.id_audio}>
            {audio.nombre}{" "}
            <button onClick={() => handleEdit(audio.id_audio)}>
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaDeAudios;
