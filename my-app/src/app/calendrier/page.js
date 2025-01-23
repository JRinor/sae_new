'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import Event from '@/components/Calendars/Event';
import Modal from '@/components/Modal';
import Select from 'react-select';
import { isSameDay, isSameWeek, isValidDeliveryDate, getNextValidDate } from '@/app/utils/dateUtils';
import Header from '@/components/Header'; // Ensure Header is imported

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [openWeeks, setOpenWeeks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);

  const frequencyOptions = [
    { value: 7, label: 'Hebdomadaire' },
    { value: 14, label: 'Bi-hebdomadaire' },
    { value: 30, label: 'Mensuel' }
  ];

  useEffect(() => {
    fetchOpenWeeksAndHolidays();
    fetchTournees();
  }, []);

  const fetchOpenWeeksAndHolidays = async () => {
    setLoading(true);
    try {
      const [openWeeksRes, holidaysRes] = await Promise.all([
        fetch('/api/openweeks'),
        fetch('/api/holidays')
      ]);
      
      const openWeeksData = await openWeeksRes.json();
      const holidaysData = await holidaysRes.json();
      
      setOpenWeeks(openWeeksData);
      setHolidays(holidaysData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTournees = async () => {
    try {
      const response = await fetch('/api/tournees/dates');
      if (!response.ok) throw new Error('Erreur lors du chargement des tournées');
      const data = await response.json();

      const formattedEvents = data.flatMap((tournee) => [
        {
          id: tournee.id_tournee,
          title: `Préparation - Tournée ${tournee.id_tournee}`,
          start: tournee.jour_preparation,
          color: '#FFD700',
          extendedProps: { type: 'preparation' },
        },
        {
          id: tournee.id_tournee,
          title: `Livraison - Tournée ${tournee.id_tournee}`,
          start: tournee.jour_livraison,
          color: '#1E90FF',
          extendedProps: { type: 'livraison' },
        },
      ]);

      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateProposedDates = () => {
    if (!selectedTournee || !frequency) {
      setError('Veuillez sélectionner une tournée et une fréquence.');
      return;
    }

    const dates = [];
    let currentDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    while (currentDate < endDate) {
      if (isValidDeliveryDate(currentDate, holidays, openWeeks)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + frequency.value);
    }

    setProposedDates(dates);
    setError(null);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  const handleEventUpdate = async (updatedEvent) => {
    try {
      const tourneeId = updatedEvent.id; 
      const response = await fetch(`/api/tournees/${tourneeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jour_preparation:
            updatedEvent.extendedProps.type === 'preparation'
              ? updatedEvent.start
              : null,
          jour_livraison:
            updatedEvent.extendedProps.type === 'livraison'
              ? updatedEvent.start
              : null,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour de la tournée');

      fetchTournees();
      handleModalClose();
    } catch (err) {
      console.error('Erreur :', err);
      setError('Impossible de mettre à jour la tournée.');
    }
  };

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="calendar-container pt-20" role="main">
      <Header /> {/* Ensure Header is used */}
      <div className="space-y-6 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Planification des livraisons
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Sélectionner une tournée
            </label>
            <Select
              options={[
                { value: 1, label: 'Tournée 1' },
                { value: 2, label: 'Tournée 2' }
              ]}
              value={selectedTournee}
              onChange={setSelectedTournee}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Fréquence de livraison
            </label>
            <Select
              options={frequencyOptions}
              value={frequency}
              onChange={setFrequency}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <button
          onClick={generateProposedDates}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 
          to-purple-500 rounded-lg transition-all duration-300 
          hover:shadow-purple-500/25 hover:scale-[1.02] 
          active:scale-[0.98] shadow-lg mt-6 text-white"
        >
          Générer les dates proposées
        </button>

        {error && <div className="error-message">{error}</div>}

        {proposedDates.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Dates proposées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proposedDates.map((date, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="text-gray-200">
                    {date.toLocaleDateString('fr-FR')}
                  </span>
                  <button
                    onClick={() => {/* Toggle date selection */}}
                    className="text-sm px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Sélectionner
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 text-white">
            Aucune date proposée. Veuillez vérifier vos sélections.
          </div>
        )}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        locale={frLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        height="auto"
        eventClick={handleEventClick}
      />
      {selectedEvent && (
        <Modal
          event={selectedEvent}
          onClose={handleModalClose}
          onUpdate={handleEventUpdate}
        />
      )}
    </div>
  );
};

const renderEventContent = (eventInfo) => {
  return <Event event={eventInfo.event} />;
};

export default Calendar;