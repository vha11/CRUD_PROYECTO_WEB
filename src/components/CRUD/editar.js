import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";  

const EditarAudio = () => {
  const { id } = useParams(); 
  const history = useHistory();
  const [audio, setAudio] = useState(""); 
  const [archivo, setArchivo] = useState(null); 
  const [dragging, setDragging] = useState(false); 
  const [audioToEdit, setAudioToEdit] = useState(null);  


  useEffect(() => {
    axios
      .get(`http://localhost:5000/audios/${id}`)  
      .then((response) => {
        setAudioToEdit(response.data);  
        setAudio(response.data.nombre);  
        setArchivo(response.data.audio); 
      })
      .catch((error) => {
        console.error("Error al obtener el audio:", error);
        history.push("/Proyecto");  // Redirigir a la lista de audios si no se encuentra
      });
  }, [id, history]);

  // Maneja el cambio en el campo de texto del nombre
  const handleInputChange = (e) => {
    setAudio(e.target.value);
  };

  // Maneja la carga del archivo
  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  // Maneja el estado del arrastre del archivo
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

  // Maneja el envío del formulario (actualización del audio)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear FormData para enviar tanto el nombre como el archivo
    const formData = new FormData();
    formData.append("nombre", audio);  // Nombre del audio
    if (archivo) {
      formData.append("audio", archivo);  // Archivo de audio (si se modificó)
    }

    // Realizar la solicitud PUT para actualizar el audio en el servidor
    axios
      .put(`http://localhost:5000/audios/${id}`, formData)
      .then((response) => {
        console.log("Audio actualizado: ", response.data);
        history.push("/Proyecto");  // Redirigir después de actualizar
      })
      .catch((error) => {
        console.error("Error al actualizar el audio:", error);
      });

    // Limpiar los campos después de actualizar
    setAudio("");
    setArchivo(null);
  };

  return (
    <div className="page-background-Crear">
      <Container className="crear-audio-container-Crear">
        <div className="form-header-Crear">
          <h2>Convertidor de Audio a Texto</h2>
          <p>Modificación da datos</p>
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
                Subir archivo nuevo
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
              Guardar Cambios
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
