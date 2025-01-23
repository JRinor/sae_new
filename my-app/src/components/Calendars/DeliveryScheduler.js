'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { isSameDay, isSameWeek, isValidDeliveryDate, getNextValidDate } from '../../app/utils/dateUtils';

const DeliveryScheduler = () => {
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [openWeeks, setOpenWeeks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  const frequencyOptions = [
    { value: 7, label: 'Hebdomadaire' },
    { value: 14, label: 'Bi-hebdomadaire' },
    { value: 30, label: 'Mensuel' }
  ];

  useEffect(() => {
    fetchOpenWeeksAndHolidays();
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

  const generateProposedDates = () => {
    if (!selectedTournee || !frequency) return;
    
    // Logique de génération des dates
    const dates = [];
    let currentDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    while (currentDate < endDate) {
      if (isValidDeliveryDate(currentDate)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + frequency.value);
    }

    setProposedDates(dates);
  };

  const isValidDeliveryDate = (date) => {
    // Vérifier si la date est dans une semaine d'ouverture
    const isOpenWeek = openWeeks.some(week => {
      const weekDate = new Date(week);
      return isSameWeek(date, weekDate);
    });

    // Vérifier si ce n'est pas un jour férié
    const isHoliday = holidays.some(holiday => {
      const holidayDate = new Date(holiday);
      return isSameDay(date, holidayDate);
    });

    return isOpenWeek && !isHoliday;
  };

  return (
    <div className="space-y-6 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
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

      {/* Propositions de dates */}
      {proposedDates.length > 0 && (
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
      )}
    </div>
  );
};
export default DeliveryScheduler;