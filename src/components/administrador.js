import React, { Component } from "react";
import { Button, Container, Table, Alert, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

class Administrador extends Component {
  state = {
    audios: [], 
    showAlert: false, 
    alertText: "",
    showDeleteModal: false, 
    audioToDelete: null, 
  };

  componentDidMount() {
    this.fetchAudios();
  }

  fetchAudios = () => {
    this.setState({ isLoading: true }); 
    axios
      .get("http://localhost:5000/audios") 
      .then((response) => {
        this.setState({ audios: response.data, isLoading: false });
        this.showAlertMessage("Datos cargados correctamente.");
      })
      .catch((error) => {
        console.error("Error al cargar audios:", error);
        this.setState({
          showAlert: true,
          alertText: "Error en la obtención de datos.",
          isLoading: false,
        });
      });
  };

  showAlertMessage = (message) => {
    this.setState({
      showAlert: true,
      alertText: message,
    });
    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 2000); 
  };

  handleDeleteModalShow = (id) => {
    this.setState({
      audioToDelete: id,
      showDeleteModal: true,
    });
  };

  handleDelete = async () => {
    const { audioToDelete } = this.state;
    if (!audioToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/audios/${audioToDelete}`); 
      this.fetchAudios(); 
      this.setState({ showDeleteModal: false, audioToDelete: null });
      this.showAlertMessage("Audio eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el audio:", error);
      this.showAlertMessage("Error al eliminar el audio.");
    }
  };

  handleDeleteCancel = () => {
    this.setState({
      showDeleteModal: false,
      audioToDelete: null,
    });
  };

  handleEdit = (id) => {
    this.props.history.push(`/Proyecto/Editar/${id}`);
  };

  render() {
    const {
      audios,
      showAlert,
      alertText,
      showDeleteModal,
    } = this.state;

    return (
      <div>
        <header className="admin-header">
          <span className="admin-welcome">Bienvenido Administrador</span>
          <Button variant="primary" className="logout-button">
            <Link to="/" className="CustomLink">
              Salir
            </Link>
          </Button>
        </header>

        <Container className="admin-container">
          <h1 className="admin-title">CREAR, ALTAS, BAJAS Y CAMBIOS</h1>
          <hr />
          {showAlert && <Alert variant="success">{alertText}</Alert>}

          <Button variant="success" style={{ marginBottom: "12px", width: "100px" }}>
            <Link to="/Proyecto/CrearAudio" className="CustomLink">
              <span className="material-icons ButtonIcon">add</span>
              Agregar Ejercicio
            </Link>
          </Button>

            <Table striped bordered className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {audios.length > 0 ? (
                  audios.map((audio) => (
                    <tr key={audio.id_audio}>
                      <td>{audio.id_audio}</td>
                      <td>{audio.nombre}</td>
                      <td className="AlignCenter">
                        <Link
                          to={`/Proyecto/verAudio/${audio.id_audio}`}
                          className="CustomLink"
                        >
                          <Button variant="success" className="ButtonView">
                            <span className="material-icons ButtonIcon">visibility</span>
                            Ver audio
                          </Button>
                        </Link>
                        <Button
                          variant="warning"
                          className="ButtonEdit"
                          onClick={() => this.handleEdit(audio.id_audio)}
                        >
                          <span className="material-icons ButtonIcon">edit</span>
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          className="ButtonDelete"
                          onClick={() => this.handleDeleteModalShow(audio.id_audio)}
                        >
                          <span className="material-icons ButtonIcon">delete</span>
                          Eliminar
                        </Button>
                        <Link
                          to={`/Proyecto/probarAudio/${audio.id_audio}`}
                          className="CustomLink"
                        >
                          <Button variant="success" className="ButtonProbar">
                            <span className="material-icons ButtonIcon">tab</span>
                            Probar audio
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" align="center">
                      No hay audios disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

          <Modal show={showDeleteModal} onHide={this.handleDeleteCancel}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que quieres eliminar este audio?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleDeleteCancel}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={this.handleDelete}
              >
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
  }
}

export default Administrador;
