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
import Header from '@/components/Header';

const Calendar = () => {
  // États de base
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les sélections
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [tourneeOptions, setTourneeOptions] = useState([]);
  
  // États pour le calendrier
  const [openWeeks, setOpenWeeks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [specialDays, setSpecialDays] = useState([]);
  
  // États pour la planification
  const [proposedDates, setProposedDates] = useState([]);
  const [plannedDates, setPlannedDates] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ajouter l'état manquant pour selectedEvent
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Ajout de l'état manquant
  const [selectedDates, setSelectedDates] = useState([]);

  const frequencyOptions = [
    { value: 7, label: 'Hebdomadaire' },
    { value: 14, label: 'Bi-hebdomadaire' },
    { value: 30, label: 'Mensuel' }
  ];

  useEffect(() => {
    fetchOpenWeeksAndHolidays();
    fetchTournees();
  }, []);

  useEffect(() => {
    if (selectedTournee && frequency) {
      generateProposedDates();
    }
  }, [selectedTournee, frequency, events.length, holidays.length, openWeeks.length]);

  const fetchOpenWeeksAndHolidays = async () => {
    setLoading(true);
    try {
      const [openWeeksRes, holidaysRes] = await Promise.all([
        fetch('/api/openweeks'),
        fetch('/api/holidays')
      ]);
      
      if (!openWeeksRes.ok || !holidaysRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const openWeeksData = await openWeeksRes.json();
      const holidaysData = await holidaysRes.json();
      
      // S'assurer que les dates sont valides
      const validOpenWeeks = openWeeksData.filter(date => {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
      });
      
      const validHolidays = holidaysData.filter(date => {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
      });
      
      setOpenWeeks(validOpenWeeks);
      setHolidays(validHolidays);

      const specialEvents = [
        ...validHolidays.map(date => ({
          title: 'Jour férié',
          start: date,
          allDay: true,
          display: 'background',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          classNames: ['holiday-event']
        })),
        ...validOpenWeeks.map(date => ({
          title: 'Semaine ouverte',
          start: date,
          allDay: true,
          display: 'background',
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          classNames: ['openweek-event']
        }))
      ];

      setSpecialDays(specialEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données du calendrier.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTournees = async () => {
    try {
      const response = await fetch('/api/tournees/dates');
      if (!response.ok) throw new Error('Erreur lors du chargement des tournées');
      const data = await response.json();

      // Créer les options pour le select
      const options = data.map(tournee => ({
        value: tournee.id_tournee,
        label: `Tournée ${tournee.id_tournee} (${new Date(tournee.jour_livraison).toLocaleDateString('fr-FR')})`
      }));
      setTourneeOptions(options);

      // Formater les événements pour le calendrier
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

  const canUseDateForDelivery = (dateToCheck) => {
    const dateStr = dateToCheck.toISOString().split('T')[0];
    return (
      isValidDeliveryDate(dateToCheck, holidays, openWeeks) &&
      !plannedDates.has(dateStr) &&
      !events.some(event => event.start === dateStr)
    );
  };

  const generateProposedDates = () => {
    if (!selectedTournee || !frequency) return;

    try {
      const dates = [];
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const endDate = new Date(currentDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      let consecutiveFailures = 0;
      const maxFailures = 10; // Limite de tentatives consécutives

      while (currentDate < endDate && dates.length < 52 && consecutiveFailures < maxFailures) {
        if (canUseDateForDelivery(currentDate)) {
          dates.push(new Date(currentDate));
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
        }
        
        // Avancer à la prochaine date potentielle
        currentDate.setDate(currentDate.getDate() + frequency.value);
      }

      if (dates.length === 0) {
        setError('Aucune date disponible pour la fréquence sélectionnée');
      } else {
        setProposedDates(dates);
        setError(null);
      }
    } catch (error) {
      console.error('Erreur lors de la génération des dates:', error);
      setError('Erreur lors de la génération des dates');
    }
  };

  const handleDateSelection = async (date) => {
    setIsSubmitting(true);
    try {
      const prepDate = new Date(date);
      prepDate.setDate(prepDate.getDate() - 1);
      
      if (!isValidDeliveryDate(prepDate, holidays, openWeeks)) {
        throw new Error('La date de préparation tombe sur un jour non valide');
      }

      const response = await fetch(`/api/tournees/${selectedTournee.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jour_livraison: date.toISOString().split('T')[0],
          jour_preparation: prepDate.toISOString().split('T')[0],
          statut_tournee: 'planifiée'
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      const dateStr = date.toISOString().split('T')[0];
      setPlannedDates(prev => new Set([...prev, dateStr]));
      setSelectedDates(prev => [...prev, dateStr]);
      
      setProposedDates(prev => prev.filter(d => 
        d.toISOString().split('T')[0] !== dateStr
      ));

      await fetchTournees();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modifier la fonction handleEventClick pour utiliser l'événement correctement
  const handleEventClick = (clickInfo) => {
    if (!clickInfo || !clickInfo.event) return;
    
    const event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      extendedProps: clickInfo.event.extendedProps
    };
    
    setSelectedEvent(event);
  };

  // Modifier la fonction handleEventUpdate pour mieux gérer les erreurs
  const handleEventUpdate = async (updatedEvent) => {
    if (!updatedEvent || !updatedEvent.id) {
      console.error('Événement invalide');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tournees/${updatedEvent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jour_preparation: updatedEvent.extendedProps?.type === 'preparation' 
            ? updatedEvent.start 
            : null,
          jour_livraison: updatedEvent.extendedProps?.type === 'livraison' 
            ? updatedEvent.start 
            : null,
          statut_tournee: 'modifiée'
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      await fetchTournees();
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Impossible de mettre à jour la tournée.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction de fermeture du modal
  const handleModalClose = () => {
    setSelectedEvent(null);
    setError(null);
  };

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="calendar-container pt-20" role="main">
      <Header />
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
              options={tourneeOptions}
              value={selectedTournee}
              onChange={setSelectedTournee}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Sélectionnez une tournée"
              isSearchable
              isClearable
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
              placeholder="Sélectionnez une fréquence"
              isSearchable
              isClearable
            />
          </div>
        </div>

        <button
          onClick={generateProposedDates}
          disabled={!selectedTournee || !frequency}
          className={`w-full py-3 px-6 rounded-lg transition-all duration-300 
            ${(!selectedTournee || !frequency) 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]'} 
            shadow-lg mt-6 text-white`}
        >
          Générer les dates proposées
        </button>

        {error && <div className="error-message">{error}</div>}

        {proposedDates.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Dates proposées ({proposedDates.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proposedDates.map((date, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="text-gray-200">
                    {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <button
                    onClick={() => handleDateSelection(new Date(date))}
                    disabled={isSubmitting || selectedDates.includes(date)}
                    className={`text-sm px-3 py-1 rounded-md ${
                      isSubmitting ? 'bg-gray-400 cursor-wait' :
                      selectedDates.includes(date) ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    {isSubmitting ? 'En cours...' : 
                     selectedDates.includes(date) ? 'Sélectionné' : 'Sélectionner'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          error ? (
            <div className="mt-6 text-red-500 bg-red-900/20 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="mt-6 text-white">
              Sélectionnez une tournée et une fréquence pour générer des dates.
            </div>
          )
        )}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[...events, ...specialDays]}
        eventContent={renderEventContent}
        locale={frLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        height="auto"
        eventClick={handleEventClick}
        dayCellClassNames={(arg) => {
          const classes = [];
          if (holidays.some(date => isSameDay(new Date(date), arg.date))) {
            classes.push('holiday-cell');
          }
          if (openWeeks.some(date => isSameDay(new Date(date), arg.date))) {
            classes.push('openweek-cell');
          }
          return classes;
        }}
      />
      {selectedEvent && (
        <Modal
          event={selectedEvent}
          onClose={handleModalClose}
          onUpdate={handleEventUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

const renderEventContent = (eventInfo) => {
  return <Event event={eventInfo.event} />;
};

export default Calendar;