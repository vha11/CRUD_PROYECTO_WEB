import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom"; // Para manejar parámetros en la URL
import { Form, Button, Container } from "react-bootstrap";

const EditarAudio = () => {
  const { id } = useParams(); 
  const history = useHistory();
  const [audio, setAudio] = useState("");
  const [archivo, setArchivo] = useState(null); 
  const [dragging, setDragging] = useState(false); 

  const audios = [
    { id_audio: 1, nombre: "Audio 1", audio: "audio1.mp4" },
    { id_audio: 2, nombre: "Audio 2", audio: "audio2.mp4" },
    { id_audio: 3, nombre: "Audio 3", audio: "audio3.mp4" },
  ];

  const [audioToEdit, setAudioToEdit] = useState(null);


  useEffect(() => {
    const foundAudio = audios.find((audio) => audio.id_audio === parseInt(id));
    if (foundAudio) {
      setAudioToEdit(foundAudio);
      setAudio(foundAudio.nombre);
      setArchivo(foundAudio.audio);
    } else {
      // Si no se encuentra el audio, redirigir o mostrar un mensaje
      history.push("/Proyecto"); // Redirigir a una lista de proyectos
    }
  }, [id, audios, history]);

  const handleInputChange = (e) => {
    setAudio(e.target.value);
  };

  
  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };


  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setArchivo(e.dataTransfer.files[0]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Si el archivo no se ha modificado, mantener el archivo original
    const updatedAudio = {
      ...audioToEdit,
      nombre: audio,
      audio: archivo ? archivo.name : audioToEdit.audio,
    };

    // Aquí actualizarías el estado global o los datos del servidor
    console.log("Audio actualizado: ", updatedAudio);

    // Redirigir a la lista de audios después de editar
    history.push("/Proyecto");

    // Limpiar los campos después de actualizar
    setAudio("");
    setArchivo(null);
  };

  return (
    <div className="page-background-Crear">
      <Container className="crear-audio-container-Crear">
        <div className="form-header-Crear">
          <h2>Convertidor de Audio a Texto</h2>
          <p>Sube un archivo de audio.</p>
        </div>
        {audioToEdit ? (
          <Form onSubmit={handleSubmit} className="crear-audio-form-Crear">
            <div
              className={`upload-area-Crear ${dragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Form.Label htmlFor="fileInput" className="upload-label-Crear">
                {archivo
                  ? `Archivo seleccionado: ${archivo.name}`
                  : "Arrastra y suelta tu archivo aquí, o haz clic para seleccionarlo"}
              </Form.Label>
              <input
                id="fileInput"
                type="file"
                accept="audio/*"
                className="file-input-Crear"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                variant="primary"
                className="choose-file-button-Crear"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Elegir archivo
                <span className="material-icons ButtonIcon">upload</span>
              </Button>
            </div>
            <Form.Group controlId="formAudio" className="input-group-Crear">
              <Form.Label>Nombre del audio: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese un nombre descriptivo"
                value={audio}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="submit-button-Crear">
              Actualizar Audio
            </Button>
          </Form>
        ) : (
          <p>Audio no encontrado</p>
        )}
      </Container>
    </div>
  );
};

export default EditarAudio;
