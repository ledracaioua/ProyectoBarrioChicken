import React, { useState } from 'react';
import { X } from 'lucide-react';
import { InventoryMovement, MovementReason, Product } from '../types';
import { addMovement } from '../api/movements';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const reasonOptions: { [key in 'IN' | 'OUT']: MovementReason[] } = {
  IN: ['Compra', 'Devolucion', 'Ajuste'],
  OUT: ['Venta', 'Perdida', 'Robo', 'Vencimiento', 'Dano', 'Ajuste'],
};

// Função auxiliar para converter Date para datetime-local formatado
const formatDateTimeLocal = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
};

const MovementModal: React.FC<MovementModalProps> = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState<Partial<InventoryMovement>>({
    type: 'IN',
    quantity: 1,
    reason: 'Compra',
    date: formatDateTimeLocal(new Date()),
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product._id) return;

    try {
      const isoDate = new Date(formData.date || '').toISOString();

      await addMovement({
        productId: product._id,
        type: formData.type as 'IN' | 'OUT',
        quantity: formData.quantity || 0,
        reason: formData.reason as MovementReason,
        date: isoDate,
        notes: formData.notes || '',
      });

      onClose();
    } catch (error) {
      console.error('Erro ao registrar movimento:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registrar Movimiento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto</label>
            <input
              type="text"
              value={product.name}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'IN' | 'OUT' })}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Motivo</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value as MovementReason })}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              {reasonOptions[formData.type || 'IN'].map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
            <input
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;
