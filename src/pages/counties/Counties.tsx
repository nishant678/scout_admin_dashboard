import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { Loader, Plus, Pencil, Trash2, X } from "lucide-react";
import { County, getCounties, createCounty, updateCounty, deleteCounty } from "../../services/sectionService";

const CountiesPage: React.FC = () => {
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCounties = async () => {
    try {
      setCounties(await getCounties());
    } catch {
      toast.error("Failed to load counties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounties();
  }, []);

  const resetForm = () => {
    setFormName("");
    setFormCode("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !formCode.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateCounty(editingId, { name: formName.trim(), code: formCode.trim() });
        toast.success("County updated");
      } else {
        await createCounty({ name: formName.trim(), code: formCode.trim() });
        toast.success("County created");
      }
      resetForm();
      await fetchCounties();
    } catch {
      toast.error(editingId ? "Failed to update county" : "Failed to create county");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: County) => {
    setFormName(c.name);
    setFormCode(c.code);
    setEditingId(c.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deactivate this county?")) return;
    try {
      await deleteCounty(id);
      toast.success("County deactivated");
      await fetchCounties();
    } catch {
      toast.error("Failed to deactivate county");
    }
  };

  const activeCounties = counties.filter((c) => c.active);

  return (
    <DashboardLayout title="Counties">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Counties</h2>
        <p className="text-gray-500 mt-1">Manage Kenyan counties</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit County" : "Add County"}</h3>
              {editingId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="e.g. Nairobi" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Code *</label>
                <input value={formCode} onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="e.g. NRB" />
              </div>
              <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleSubmit} disabled={!formName.trim() || !formCode.trim() || saving} isLoading={saving}>
                <Plus size={18} />{editingId ? "Update County" : "Create County"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            {loading ? (
              <div className="flex justify-center py-12"><Loader className="animate-spin text-gray-400" size={32} /></div>
            ) : activeCounties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No active counties yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Code</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCounties.map((c) => (
                      <tr key={c.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium text-gray-900">{c.name}</td>
                        <td className="py-3 text-gray-600">{c.code}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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

export default CountiesPage;