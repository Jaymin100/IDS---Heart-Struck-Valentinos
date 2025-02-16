import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css'; // Make sure to import the CSS file where you define custom styles


const RHSSidebar = ({ selectedHotspot, onDescriptionUpdate, onDeleteHotspot }) => {
  const [editableDescription, setEditableDescription] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  // Reset editableDescription and isDeleted when selectedHotspot changes
  useEffect(() => {
    if (selectedHotspot) {
      setEditableDescription(selectedHotspot.description || ''); // Reset to the new hotspot's description
      setIsDeleted(false); // Reset isDeleted when a new hotspot is selected
    } else {
      setEditableDescription(''); // Clear the text box if no hotspot is selected
    }
  }, [selectedHotspot]);

  // Handle changes in the editable description text box
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setEditableDescription(newDescription);

    // Pass the updated description back to the parent component
    if (selectedHotspot && !isDeleted) {
      onDescriptionUpdate(selectedHotspot.id, newDescription);
    }
  };

  // Handle the delete button click
  const handleDeleteClick = () => {
    if (selectedHotspot) {
      onDeleteHotspot(selectedHotspot.id);
      setIsDeleted(true); // Set the deleted state to true
    }
  };

  return (
    <div className='RHSSidebar p-4 bg-light border rounded shadow-sm'>
      <h3 className='mb-4 text-primary'>Selected Hotspot Information</h3>
      {selectedHotspot && !isDeleted ? (
        <div>
          <div className='mb-3'>
            <label className='form-label fw-bold'>Hotspot Details</label>
            <textarea
              readOnly
              rows="4"
              className='form-control bg-light'
              value={`ID: ${selectedHotspot.id}\nATH: ${selectedHotspot.ath}\nATV: ${selectedHotspot.atv}`}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label fw-bold'>Description</label>
            <textarea
              rows="4"
              className='form-control'
              value={editableDescription}
              onChange={handleDescriptionChange}
              placeholder="Edit the hotspot description..."
            />
          </div>
          <button
            className='btn btn-danger w-100'
            onClick={handleDeleteClick}
          >
            Delete Hotspot
          </button>
        </div>
      ) : (
        <p className='text-muted text-center'>{isDeleted ? "Deleted" : "No hotspot selected."}</p>
      )}
    </div>
  );
};

export default RHSSidebar;