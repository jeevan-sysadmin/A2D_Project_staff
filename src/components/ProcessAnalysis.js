import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './ProcessAnalysis.css'; // Make sure to create and import the CSS file

const ProcessAnalysis = () => {
  const [processType, setProcessType] = useState(''); // Selected process type for filtering
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [totals, setTotals] = useState({
    pending: 0,
    progressing: 0,
    accept: 0,
    reject: 0,
    hold: 0,
    complete: 0
  });

  const processTypes = ['pending', 'progressing', 'accept', 'reject', 'hold', 'complete'];

  // Fetch total counts for each process type on component mount
  useEffect(() => {
    const fetchTotals = async () => {
      const submissionsRef = collection(db, 'formSubmissions');
      const processCount = { pending: 0, progressing: 0, accept: 0, reject: 0, hold: 0, complete: 0 };

      try {
        const querySnapshot = await getDocs(submissionsRef);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const type = data.processType;
          if (processCount[type] !== undefined) {
            processCount[type] += 1;
          }
        });
        setTotals(processCount);
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };

    fetchTotals();
  }, []);

  // Fetch filtered submissions based on selected process type
  useEffect(() => {
    const fetchFilteredData = async () => {
      const submissionsRef = collection(db, 'formSubmissions');
      let queryRef;

      if (processType && processType !== 'All') {
        queryRef = query(
          submissionsRef,
          where('processType', '==', processType)
        );
      } else {
        queryRef = query(submissionsRef);
      }

      try {
        const querySnapshot = await getDocs(queryRef);
        const submissions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredSubmissions(submissions);
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    };

    fetchFilteredData();
  }, [processType]);

  // Helper function to safely handle submissionDate
  const formatSubmissionDate = (date) => {
    if (date && date.toDate) {
      return new Date(date.toDate()).toLocaleDateString();
    } else {
      return 'N/A';
    }
  };

  return (
    <div className="process-analysis">
      <div className="card">
        <h1>Process Analysis</h1>

        {/* Process Type Filter */}
        <div className="filter">
          <label>Select Process Type:</label>
          <select value={processType} onChange={(e) => setProcessType(e.target.value)}>
            <option value="All">All</option>
            {processTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Process Totals */}
        <div className="totals">
          <h2>Process Totals</h2>
          <ul>
            {processTypes.map((type) => (
              <li key={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}: {totals[type]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filtered Submissions Table */}
      <div className="filtered-submissions">
        <h2>Filtered Submissions ({processType ? processType : 'All'})</h2>
        {filteredSubmissions.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
          <table className="submission-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Process Type</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.name || 'N/A'}</td>
                  <td>{submission.email || 'N/A'}</td>
                  <td>{submission.processType || 'N/A'}</td>
                  <td>{formatSubmissionDate(submission.submissionDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProcessAnalysis;
