import { LinksFunction, json, redirect } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNotes";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";
export const links: LinksFunction = () => [
  ...newNoteLinks(),
  ...noteListLinks(),
];

export function meta() {
  return [
    {
      title: "New Note",
      description: "Create new notes",
    },
  ];
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes." },
      {
        status: 400,
        statusText: "Not Found",
      }
    );
  }
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title - must be at least 5 characters long." };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  await new Promise((resolve, reject) =>
    setTimeout(() => resolve("done"), 2000)
  );
  return redirect("/notes");
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <NewNote />
        <div>
          <p className="info-message">{error.data.message}</p>
        </div>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <main className="error">
        <h1>An error related to your notes occurred!</h1>
        <p>{error.message}</p>
        <p>
          Back to <Link to="/">safety</Link>
        </p>
      </main>
    );
  }
}

export default function NotesPage() {
  const notes = useLoaderData<typeof loader>();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}
