import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { adminSidebarItems } from "../adminSidebarItems.js";
import { useFetch } from "../../../hooks/useFetch";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Loader from "../../../components/common/Loader";
import PlanCard from "./PlanCard.jsx";
import PlanForm from "./PlanForm.jsx";
import { Plus } from "lucide-react";

export default function PlanList() {
  const { data: plans, loading, refetch } = useFetch("/plans");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const openCreate = () => { setEditingPlan(null); setModalOpen(true); };
  const openEdit = (plan) => { setEditingPlan(plan); setModalOpen(true); };
  const handleSaved = () => { setModalOpen(false); refetch(); };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} pageTitle="Plans">
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}><Plus size={16} /> New Plan</Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onEdit={openEdit} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPlan ? "Edit Plan" : "New Plan"}>
        <PlanForm existingPlan={editingPlan} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>
    </DashboardLayout>
  );
}