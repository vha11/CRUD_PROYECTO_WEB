import React, { useState } from "react";
import { Button, Form, Container, ProgressBar, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const CrearAudio = () => {
  const [audio, setAudio] = useState(""); 
  const [archivo, setArchivo] = useState(null); 
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [progress, setProgress] = useState(0); 
  const [error, setError] = useState(null);  

  const handleInputChange = (e) => {
    setAudio(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null); 
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setArchivo(selectedFile);
    } else {
      setError('Por favor selecciona un archivo de audio válido.');
    }
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
    const droppedFile = e.dataTransfer.files[0];
    setError(null); 
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setArchivo(droppedFile);
    } else {
      setError('Por favor selecciona un archivo de audio válido.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!archivo) {
      setError("Por favor, selecciona un archivo de audio.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("audio", audio);

    setLoading(true);  
    setProgress(0);  

    axios
      .post("http://localhost:5000/audios", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent); 
        },
      })
      .then((response) => {
        console.log("Audio creado:", response.data);
        setAudio("");  
        setArchivo(null);  
        setLoading(false);  
        navigate("/");  
      })
      .catch((error) => {
        console.error("Error al crear el audio:", error);
        setError("Hubo un problema al cargar el archivo. Inténtalo de nuevo.");
        setLoading(false);  
      });
  };

  return (
    <div className="page-background-Crear">
      <Container className="crear-audio-container-Crear">
        <div className="form-header-Crear">
          <h2>Convertidor de Audio a Texto</h2>
          <p>Sube un archivo de audio.</p>
        </div>

        {/* para mostrar el erro */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

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

          {loading && (
            <div className="progress-container">
              <ProgressBar now={progress} label={`${progress}%`} />
            </div>
          )}

          {loading && !progress && (
            <div className="spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          <Button variant="primary" type="submit" className="submit-button-Crear">
            Guardar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CrearAudio;
