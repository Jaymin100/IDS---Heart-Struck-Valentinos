import React, { useState, useEffect } from 'react';

const RHSSidebar = ({ selectedHotspot, onDescriptionUpdate }) => {
  const [editableDescription, setEditableDescription] = useState('');

  // Update the editable description when the selected hotspot changes
  useEffect(() => {
    if (selectedHotspot) {
      setEditableDescription(selectedHotspot.description);
    } else {
      setEditableDescription(''); // Clear the text box if no hotspot is selected
    }
  }, [selectedHotspot]);

  // Handle changes in the editable description text box
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setEditableDescription(newDescription);

    // Pass the updated description back to the parent component
    if (selectedHotspot) {
      onDescriptionUpdate(selectedHotspot.id, newDescription);
    }
  };

  return (
    <div className='RHSSidebar'>
      <h3>Selected Hotspot Information</h3>
      {selectedHotspot ? (
        <div>
          {/* Read-only text box for hotspot details */}
          <textarea
            readOnly
            rows="5"
            cols="30"
            value={`ID: ${selectedHotspot.id}\nATH: ${selectedHotspot.ath}\nATV: ${selectedHotspot.atv}`}
            style={{ marginBottom: '10px' }}
          />
          {/* Editable text box for description */}
          <textarea
            rows="5"
            cols="30"
            value={editableDescription}
            onChange={handleDescriptionChange}
            placeholder="Edit the hotspot description..."
          />
        </div>
      ) : (
        <p>No hotspot selected.</p>
      )}
    </div>
  );
};

export default RHSSidebar;