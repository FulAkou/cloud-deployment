import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import AppNavbar from "./components/Navbar";

const App = () => {
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/notes");
        setNotesList(response.data);
        setLoading(false);
      } catch (error) {
        setError("Une erreur est survenue lors de la récupération des données");
        setLoading(false);
        console.error("Erreur lors de la récupération des notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleShow = (note = null) => {
    setSelectedNote(note);
    setIsEditing(!!note);
    setUpdatedNote(
      note
        ? { title: note.title, content: note.content, tags: note.tags }
        : { title: "", content: "", tags: "" }
    );
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedNote(null);
  };

  const handleShowDelete = (note) => {
    setSelectedNote(note);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedNote(null);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        const response = await axios.put(
          `
          http://localhost:5000/note/${selectedNote._id}`,
          updatedNote
        );
        setNotesList((prevNotes) =>
          prevNotes.map((note) =>
            note._id === selectedNote._id ? response.data : note
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:5000/note",
          updatedNote
        );
        setNotesList((prevNotes) => [...prevNotes, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la note:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    try {
      await axios.delete(`http://localhost:5000/note/${selectedNote._id}`);
      setNotesList((prevNotes) =>
        prevNotes.filter((note) => note._id !== selectedNote._id)
      );
      handleCloseDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
    }
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto flex flex-col items-center py-8 relative">
      <AppNavbar onAddNote={() => handleShow()} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {notesList.map((note) => (
          <div
            key={note._id}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition transform hover:scale-105"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              {note.title}
            </h2>
            <p className="text-gray-600 mb-2">{note.content}</p>
            <p className="text-gray-500 text-sm mb-2">{note.tags}</p>
            <p className="text-gray-400 text-xs mb-4">{note.createdOn}</p>

            <div className="flex flex-row gap-2">
              <button
                className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                onClick={() => handleShow(note)}
              >
                <Pencil size={20} />
              </button>
              <button
                className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                onClick={() => handleShowDelete(note)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton fixe pour ajouter une note */}
      <button
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded shadow-lg hover:bg-blue-600 transition"
        onClick={() => handleShow()}
      >
        +
      </button>

      {/* Modal d'ajout/modification */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdropClassName="blur-background"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Modifier la note" : "Ajouter une note"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={updatedNote.title}
                onChange={(e) =>
                  setUpdatedNote({ ...updatedNote, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedNote.content}
                onChange={(e) =>
                  setUpdatedNote({ ...updatedNote, content: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                value={updatedNote.tags}
                onChange={(e) =>
                  setUpdatedNote({ ...updatedNote, tags: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? "Enregistrer" : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        show={showDelete}
        onHide={handleCloseDelete}
        centered
        backdropClassName="blur-background"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Êtes-vous sûr de vouloir supprimer cette note ? Cette action est
            irréversible.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .modal-backdrop.blur-background {
          backdrop-filter: blur(5px);
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
