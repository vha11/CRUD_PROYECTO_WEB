import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const ReadAudio = ({ audioId }) => {
  const [audioData, setAudioData] = useState({ id_audio: "", nombre: "", audio: "" });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (audioId) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/audios/${audioId}`)
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

  return (
    <div className="page-background-Crear">
      <Container className="crear-audio-container-Crear">
        <div className="form-header-Crear">
          <h2>Ver Audio</h2>
          <p>Visualiza los detalles del archivo de audio.</p>
        </div>

        {alert && (
          <Alert variant={alert.type} className="mb-3">
            {alert.message}
          </Alert>
        )}

        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form className="crear-audio-form-Crear">
            <div className="upload-area-Crear">
              <Form.Label htmlFor="fileInput" className="upload-label-Crear">
                {audioData.audio ? `Archivo actual: ${audioData.audio}` : "No hay archivo de audio"}
              </Form.Label>
            </div>

            <Form.Group controlId="formAudio" className="input-group-Crear">
              <Form.Label>ID del Audio:</Form.Label>
              <Form.Control type="text" value={audioData.id_audio} readOnly />
            </Form.Group>

            <Form.Group controlId="formNombre" className="input-group-Crear">
              <Form.Label>Nombre del Audio:</Form.Label>
              <Form.Control
                type="text"
                value={audioData.nombre}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formAudioFile" className="input-group-Crear">
              <Form.Label>Archivo de Audio:</Form.Label>
              <Form.Control
                type="text"
                value={audioData.audio}
                readOnly
              />
            </Form.Group>

            <Button variant="secondary" onClick={() => window.history.back()} className="submit-button-Crear">
              Regresar
            </Button>
          </Form>
        )}
      </Container>
    </div>
  );
};

export default ReadAudio;
