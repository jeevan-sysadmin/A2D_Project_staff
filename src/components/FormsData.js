import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import './FormsData.css'; 
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

const FormsData = () => {
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterId, setFilterId] = useState(''); // Added for document ID filtering

  useEffect(() => {
    // Fetch data from Firestore on initial load
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'formSubmissions'));
        const submissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormSubmissions(submissions);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data by filterDate and filterId whenever they change
    const handleFilter = async () => {
      try {
        let queryRef = collection(db, 'formSubmissions');
        
        if (filterDate) {
          const date = new Date(filterDate);
          queryRef = query(queryRef, where('submissionDate', '>=', Timestamp.fromDate(date)), where('submissionDate', '<', Timestamp.fromDate(new Date(date.setDate(date.getDate() + 1))))); 
        }

        if (filterId) {
          queryRef = query(queryRef, where('__name__', '==', filterId)); // Filter by document ID
        }

        const querySnapshot = await getDocs(queryRef);
        const filteredSubmissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFormSubmissions(filteredSubmissions);
      } catch (error) {
        console.error('Error filtering data: ', error);
      }
    };

    handleFilter();
  }, [filterDate, filterId]); // Trigger filtering when either filterDate or filterId changes

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = async () => {
    try {
      // Delete selected rows from Firestore
      for (const id of selectedRows) {
        await deleteDoc(doc(db, 'formSubmissions', id));
      }
      setFormSubmissions(formSubmissions.filter(submission => !selectedRows.includes(submission.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting rows: ', error);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-GB');  // Format as DD/MM/YYYY
    }
    return 'N/A';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Forms Data</h1>

      {/* Filter Form */}
      <div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Filter by Document ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />
      </div>

      {/* Delete Button */}
      <button onClick={handleDelete} disabled={selectedRows.length === 0}>
        Delete Selected
      </button>

      {formSubmissions.length === 0 ? (
        <p>No submissions available.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(formSubmissions.map((submission) => submission.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Country Code</th>
              <th>Delivery Time</th>
              <th>Investment</th>
              <th>Location</th>
              <th>Monthly Income</th>
              <th>Occupation</th>
              <th>Purpose</th>
              <th>Suggestions</th>
              <th>WhatsApp</th>
              <th>Process Type</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {formSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(submission.id)}
                    onChange={() => handleCheckboxChange(submission.id)}
                  />
                </td>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.age}</td>
                <td>{submission.countryCode}</td>
                <td>{submission.deliveryTime}</td>
                <td>{submission.investment}</td>
                <td>{submission.location}</td>
                <td>{submission.monthlyIncome}</td>
                <td>{submission.occupation}</td>
                <td>{submission.purpose}</td>
                <td>{submission.suggestions}</td>
                <td>{submission.whatsapp}</td>
                <td>{submission.processType}</td>
                <td>{formatDate(submission.submissionDate)}</td> {/* Use the formatted submissionDate */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FormsData;
