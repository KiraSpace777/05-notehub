import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import noteService from "../../services/noteService";
import type { Note, CreateNoteData } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is a required field"),
  content: Yup.string().max(500, "Maximum 500 characters"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Invalid tag selection",
    )
    .required("Tag is a required field"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const api = noteService();

  const initialValues: CreateNoteData = {
    title: "",
    content: "",
    tag: "Work",
  };

  // ВИПРАВЛЕНО: Мутація створення та інвалідація запитів перенесені СУВОРО всередину компонента форми
  const createMutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: (newNote: CreateNoteData) => api.createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleFormikSubmit = (values: CreateNoteData): void => {
    createMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteValidationSchema}
      onSubmit={handleFormikSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <FormikError name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <FormikError name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <FormikError name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}

// ==========================================================
// import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
// import * as Yup from "yup";
// import type { CreateNoteData } from "../../types/note";
// import css from "./NoteForm.module.css";

// interface NoteFormProps {
//   onSubmit: (data: CreateNoteData) => void;
//   onClose: () => void;
//   isPending: boolean;
// }

// const NoteValidationSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Minimum 3 characters")
//     .max(50, "Maximum 50 characters")
//     .required("Title is a required field"),
//   content: Yup.string().max(500, "Maximum 500 characters"),
//   tag: Yup.string()
//     .oneOf(
//       ["Todo", "Work", "Personal", "Meeting", "Shopping"],
//       "Invalid tag selection",
//     )
//     .required("Tag is a required field"),
// });

// export default function NoteForm({
//   onSubmit,
//   onClose,
//   isPending,
// }: NoteFormProps) {
//   const initialValues: CreateNoteData = {
//     title: "",
//     content: "",
//     tag: "Work",
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={NoteValidationSchema}
//       onSubmit={onSubmit}
//     >
//       <Form className={css.form}>
//         <div className={css.formGroup}>
//           <label htmlFor="title">Title</label>
//           <Field id="title" type="text" name="title" className={css.input} />
//           <FormikError name="title" component="span" className={css.error} />
//         </div>

//         <div className={css.formGroup}>
//           <label htmlFor="content">Content</label>
//           <Field
//             id="content"
//             as="textarea"
//             name="content"
//             rows={8}
//             className={css.textarea}
//           />
//           <FormikError name="content" component="span" className={css.error} />
//         </div>

//         <div className={css.formGroup}>
//           <label htmlFor="tag">Tag</label>
//           <Field id="tag" as="select" name="tag" className={css.select}>
//             <option value="Todo">Todo</option>
//             <option value="Work">Work</option>
//             <option value="Personal">Personal</option>
//             <option value="Meeting">Meeting</option>
//             <option value="Shopping">Shopping</option>
//           </Field>
//           <FormikError name="tag" component="span" className={css.error} />
//         </div>

//         <div className={css.actions}>
//           <button type="button" className={css.cancelButton} onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className={css.submitButton}
//             disabled={isPending}
//           >
//             {isPending ? "Saving..." : "Create note"}
//           </button>
//         </div>
//       </Form>
//     </Formik>
//   );
// }
