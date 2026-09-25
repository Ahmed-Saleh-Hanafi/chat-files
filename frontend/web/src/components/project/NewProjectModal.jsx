import { useState } from "react";
import Modal from "../common/Modal.jsx";
import Field from "../common/Field.jsx";
import Button from "../common/Button.jsx";
import useToast from "../../hooks/useToast";
import { normalizeError } from "../../api/client";

const EMPTY = { name: "", goal: "", aiInstructions: "" };

export default function NewProjectModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Project name is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onCreate(form);
      setForm(EMPTY);
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't create the project.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create a new project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Project name"
          placeholder="Machine Learning Research"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          autoFocus
        />
        <div>
          <label className="field-label">Project goal</label>
          <textarea
            className="field-input min-h-[72px] resize-none"
            placeholder="Understand and analyze machine learning research papers."
            value={form.goal}
            onChange={update("goal")}
          />
        </div>
        <div>
          <label className="field-label">AI instructions</label>
          <textarea
            className="field-input min-h-[72px] resize-none"
            placeholder="Explain technical concepts clearly and cite the source whenever possible."
            value={form.aiInstructions}
            onChange={update("aiInstructions")}
          />
          <p className="mt-1.5 text-xs text-base-400">
            Optional — tell the AI how it should respond within this project.
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
