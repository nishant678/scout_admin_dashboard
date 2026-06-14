import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { Loader, Plus, Pencil, Trash2, X } from "lucide-react";
import { Section, getSections, createSection, updateSection, deleteSection } from "../../services/sectionService";

const SectionsPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSections = async () => {
    try {
      setSections(await getSections());
    } catch {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const resetForm = () => {
    setFormName("");
    setFormDesc("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateSection(editingId, { name: formName.trim(), description: formDesc.trim() || undefined });
        toast.success("Section updated");
      } else {
        await createSection({ name: formName.trim(), description: formDesc.trim() || undefined });
        toast.success("Section created");
      }
      resetForm();
      await fetchSections();
    } catch {
      toast.error(editingId ? "Failed to update section" : "Failed to create section");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: Section) => {
    setFormName(s.name);
    setFormDesc(s.description || "");
    setEditingId(s.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deactivate this section?")) return;
    try {
      await deleteSection(id);
      toast.success("Section deactivated");
      await fetchSections();
    } catch {
      toast.error("Failed to deactivate section");
    }
  };

  const activeSections = sections.filter((s) => s.active);

  return (
    <DashboardLayout title="Sections">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
        <p className="text-gray-500 mt-1">Manage scout sections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Section" : "Add Section"}</h3>
              {editingId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="e.g. Beavers" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="Optional description" />
              </div>
              <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleSubmit} disabled={!formName.trim() || saving} isLoading={saving}>
                <Plus size={18} />{editingId ? "Update Section" : "Create Section"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            {loading ? (
              <div className="flex justify-center py-12"><Loader className="animate-spin text-gray-400" size={32} /></div>
            ) : activeSections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No active sections yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Description</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSections.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium text-gray-900">{s.name}</td>
                        <td className="py-3 text-gray-600">{s.description || "-"}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SectionsPage;