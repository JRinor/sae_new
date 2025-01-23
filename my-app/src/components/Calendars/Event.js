const Event = ({ event }) => {
  const isPreparation = event.extendedProps.type === 'preparation';
  
  return (
    <div className={`p-1 rounded ${
      isPreparation ? 'bg-red-600' : 'bg-green-600'
    }`}>
      {event.title}
    </div>
  );
};

export default Event;