// Composant Modal
import { useState } from 'react';

const Modal = ({ event, onClose, onUpdate }) => {
  const [date, setDate] = useState(event.startStr);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      setError('Veuillez sélectionner une date valide.');
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      setError('La date sélectionnée ne peut pas être dans le passé.');
      return;
    }

    const updatedEvent = {
      ...event,
      start: selectedDate,
      extendedProps: event.extendedProps, 
    };

    onUpdate(updatedEvent);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 id="modal-title" className="text-2xl font-semibold mb-4">
          Modifier l'événement
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
