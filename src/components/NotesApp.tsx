import React, { Component } from 'react';
import axios from 'axios';
import { FiRefreshCw } from 'react-icons/fi';
import { IoCloseCircleSharp } from 'react-icons/io5';
import styles from './styles.module.css';

interface Note {
    id: number;
    content: string;
}

interface NotesAppState {
    notes: Note[];
    newNoteContent: string;
    errorMessage: string;
    URL: string;
    loading: boolean;
}

class NotesApp extends Component<object, NotesAppState> {
    constructor(props: object) {
        super(props);
        this.state = {
            notes: [],
            newNoteContent: '',
            errorMessage: '',
            URL: 'https://crud-backend-3njh.onrender.com',
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchNotes();
    }

    fetchNotes = async () => {
        this.setState({ loading: true });
        try {
            const response = await axios.get(`${this.state.URL}/notes`);
            this.setState({ notes: response.data, errorMessage: '', loading: false });
        } catch (error) {
            this.setState({ errorMessage: 'Error fetching notes', loading: false });
            console.error(error);
        }
    };

    handleAddNote = async () => {
        const { newNoteContent } = this.state;
        if (!newNoteContent.trim()) {
            this.setState({ errorMessage: 'Note content cannot be empty' });
            return;
        }
        try {
            const response = await axios.post(`${this.state.URL}/notes`, {
                id: 0,
                content: newNoteContent,
            });
            const newNote = { id: response.data.id, content: newNoteContent };
            this.setState((prevState) => ({
                notes: [...prevState.notes, newNote],
                newNoteContent: '',
                errorMessage: '',
            }));
        } catch (error) {
            this.setState({ errorMessage: 'Error adding note' });
            console.error(error);
        }
    };

    handleDeleteNote = async (id: number) => {
        try {
            await axios.delete(`${this.state.URL}/notes/${id}`);
            this.setState((prevState) => ({
                notes: prevState.notes.filter(note => note.id !== id),
                errorMessage: '',
            }));
        } catch (error) {
            this.setState({ errorMessage: 'Error deleting note' });
            console.error(error);
        }
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newNoteContent: event.target.value });
    };

    render() {
        const { notes, newNoteContent, errorMessage, loading } = this.state;

        return (
            <div className={styles.notesApp}>
                {loading && (
                    <div className={styles.loaderOverlay}>
                        <div className={styles.loader}>Loading...</div>
                    </div>
                )}
                <header className={styles.notesHeader}>
                    <h1 className={styles.title}>Notes</h1>
                    <FiRefreshCw onClick={this.fetchNotes} className={styles.refreshIcon} />
                </header>
                <p className={styles.signature}>Refresh to see the current list of notes</p>
                <div className={styles.notesForm}>
                    <label htmlFor="enter" className={styles.labelInput}>New Note</label>
                    <input
                        id="enter"
                        type="text"
                        value={newNoteContent}
                        onChange={this.handleInputChange}
                        placeholder="Enter note content"
                        className={styles.input}
                    />
                    <button onClick={this.handleAddNote} className={styles.submitButton}>
                        Add
                    </button>
                </div>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <div className={styles.notesList}>
                    <h2 className={styles.notesTitle}>Notes List</h2>
                    {notes.map((note) => (
                        <div key={note.id} className={styles.card}>
                            <p className={styles.noteContent}>{note.content}</p>
                            <button onClick={() => this.handleDeleteNote(note.id)} className={styles.deleteButton}>
                                <IoCloseCircleSharp size={30} className={styles.deleteIcon} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default NotesApp;