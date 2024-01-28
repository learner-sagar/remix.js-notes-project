import { Link, json, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";
import styles from "~/styles/note-details.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function meta({ data }) {
  return [
    {
      title: data.title,
      description: "Notes description page",
    },
  ];
}

export async function loader({ params }) {
  const notes = await getStoredNotes();
  console.log(params.noteId);
  const selectedNote = notes.find((note) => note.id === params.noteId);

  if (!selectedNote) {
    throw json(
      { message: "Could not find node for id " + noteId },
      { status: 404 }
    );
  }

  return selectedNote;
}

export default function NoteDetailsPage() {
  const note = useLoaderData();
  console.log(note);
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}
