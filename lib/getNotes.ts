import { createClient } from "./supabaseServer";
import { verifySession } from "./dal";
import type { NoteWithBook } from "./types";

export const getNotes = async (): Promise<NoteWithBook[] | undefined> => {
  const { id } = await verifySession();

  if (!id) return;

  const supabaseClient = await createClient();

  const { data, error } = await supabaseClient
    .from("notes")
    .select(
      "id,book_id,chapter_index,paragraph_index,title,description,books(title,author)",
    )
    .eq("user_id", id)
    .order("chapter_index")
    .order("paragraph_index")
    .overrideTypes<NoteWithBook[], { merge: false }>();

  if (error) {
    console.error(error);
    return;
  }

  return data;
};
