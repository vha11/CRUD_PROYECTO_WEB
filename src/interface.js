import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, ProgressBar } from "react-bootstrap";

const EditarAudio = () => {
  const { audioId } = useParams(); // ID del audio desde la URL
  const history = useHistory();

  const [audioData, setAudioData] = useState({ id_audio: "", nombre: "", audio: "" });
  const [newFile, setNewFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Lista de audios para simulación
  const audios = [
    { id_audio: 1, nombre: "Audio 1", audio: "audio1.mp4" },
    { id_audio: 2, nombre: "Audio 2", audio: "audio2.mp4" },
    { id_audio: 3, nombre: "Audio 3", audio: "audio3.mp4" },
  ];

  useEffect(() => {
    // Simulación: Buscar datos del audio según el ID proporcionado en la URL
    const audio = audios.find((item) => item.id_audio === parseInt(audioId));
    if (audio) {
      setAudioData(audio);
    } else {
      setAlert({ message: "El audio no fue encontrado", type: "danger" });
    }
  }, [audioId, audios]);

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

    // Simulación de progreso
    let simulatedProgress = 0;
    const interval = setInterval(() => {
      simulatedProgress += 10;
      setProgress(simulatedProgress);
      if (simulatedProgress >= 100) {
        clearInterval(interval);
        setLoading(false);
        setAlert({ message: "Datos guardados correctamente (simulación)", type: "success" });
        console.log("Datos editados simulados:");
        console.log({
          id_audio: audioData.id_audio,
          nombre: audioData.nombre,
          audio: newFile ? newFile.name : audioData.audio,
        });

        // Redirigir después de guardar
        setTimeout(() => {
          history.push("/Proyecto/Interface");
        }, 2000);
      }
    }, 200);
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
                : `Archivo actual: ${audioData.audio}`}
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
              value={audioData.nombre}
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
