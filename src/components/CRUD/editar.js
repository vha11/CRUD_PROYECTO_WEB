import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, ProgressBar } from "react-bootstrap";
import axios from "axios";

const EditarAudio = ({ audioId }) => {
  const history = useHistory();

  const [audioData, setAudioData] = useState({ id_audio: "", nombre: "", audio: "" });
  const [newFile, setNewFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioId) {
      setLoading(true);
      axios
        .get(`/api/audios/${audioId}`)
        .then((response) => {
          const { id_audio, nombre, audio } = response.data;
          setAudioData({ id_audio, nombre, audio });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching audio data:", error);
          setAlert({ message: "Error al cargar los datos del audio", type: "danger" });
          setLoading(false);
        });
    }
  }, [audioId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setNewFile(file);
      setAlert({ message: "Archivo cargado correctamente", type: "success" });
    } else {
      setAlert({ message: "Por favor, sube un archivo de audio válido", type: "danger" });
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setNewFile(file);
      setAlert({ message: "Archivo cargado correctamente", type: "success" });
    } else {
      setAlert({ message: "Por favor, sube un archivo de audio válido", type: "danger" });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nombre", audioData.nombre);
    if (newFile) {
      formData.append("audio", newFile); 
    }

    axios
      .put(`/api/audios/${audioData.id_audio}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      })
      .then((response) => {
        setAlert({ message: "Audio actualizado correctamente", type: "success" });
        setLoading(false);
        setTimeout(() => {
          history.push("/Proyecto/aministrador"); 
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating audio:", error);
        setAlert({ message: "Error al actualizar el audio", type: "danger" });
        setLoading(false);
      });
  };

  return (
    <div className="page-background-Crear">
      <Container className="crear-audio-container-Crear">
        <div className="form-header-Crear">
          <h2>Editar Audio</h2>
          <p>Actualiza los datos del archivo de audio.</p>
        </div>

        {/* Mostrar alertas */}
        {alert && (
          <Alert variant={alert.type} className="mb-3">
            {alert.message}
          </Alert>
        )}

        <Form onSubmit={handleSave} className="crear-audio-form-Crear">
          <div
            className={`upload-area-Crear ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Form.Label htmlFor="fileInput" className="upload-label-Crear">
              {newFile
                ? `Archivo cargado: ${newFile.name}`
                : `Archivo actual: ${audioData.archivoMultimedia}`}
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
            <Form.Label>ID del Audio:</Form.Label>
            <Form.Control type="text" value={audioData.id_audio} readOnly />
          </Form.Group>

          <Form.Group controlId="formNombre" className="input-group-Crear">
            <Form.Label>Nombre del Audio:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese un nombre descriptivo"
              value={audioData.nombreAudio}
              onChange={(e) => setAudioData({ ...audioData, nombre: e.target.value })}
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
            Guardar Cambios
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditarAudio;
