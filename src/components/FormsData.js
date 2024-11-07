import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import './FormsData.css';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardActions, Button, TextField, Grid, Box } from '@mui/material';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const FormsData = () => {
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterProcessType, setFilterProcessType] = useState('');

  useEffect(() => {
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

  const handleFilter = async () => {
    try {
      let queryRef = collection(db, 'formSubmissions');
      // Filtering logic goes here...
    } catch (error) {
      console.error('Error filtering data: ', error);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [filterDate, filterMonth, filterYear, filterProcessType]);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id],
    );
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedRows) {
        await deleteDoc(doc(db, 'formSubmissions', id));
      }
      setFormSubmissions(formSubmissions.filter(submission => !selectedRows.includes(submission.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting rows: ', error);
    }
  };

  const updateProcessType = async (id, processType) => {
    try {
      const submissionDoc = doc(db, 'formSubmissions', id);
      await updateDoc(submissionDoc, { processType });
      setFormSubmissions(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, processType } : sub)),
      );
    } catch (error) {
      console.error('Error updating process type: ', error);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-GB');
    }
    return 'N/A';
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterMonth('');
    setFilterYear('');
    setFilterProcessType('');
  };

  // Export to CSV
  const exportToCSV = () => {
    const selectedData = formSubmissions.filter(submission => selectedRows.includes(submission.id));
    const csvData = selectedData.map((data) => [
      data.name,
      data.email,
      data.age,
      data.countryCode,
      data.deliveryTime,
      data.investment,
      data.location,
      data.monthlyIncome,
      data.occupation,
      data.purpose,
      data.processType || 'N/A',
      formatDate(data.submissionDate),
    ]);

    const headers = ['Name', 'Email', 'Age', 'Country Code', 'Delivery Time', 'Investment', 'Location', 'Monthly Income', 'Occupation', 'Purpose', 'Process Type', 'Submission Date'];

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'form_submissions.csv';
    link.click();
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const selectedData = formSubmissions.filter(submission => selectedRows.includes(submission.id));

    const headers = ['Name', 'Email', 'Age', 'Country Code', 'Delivery Time', 'Investment', 'Location', 'Monthly Income', 'Occupation', 'Purpose', 'Process Type', 'Submission Date'];

    const rows = selectedData.map((data) => [
      data.name,
      data.email,
      data.age,
      data.countryCode,
      data.deliveryTime,
      data.investment,
      data.location,
      data.monthlyIncome,
      data.occupation,
      data.purpose,
      data.processType || 'N/A',
      formatDate(data.submissionDate),
    ]);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save('form_submissions.pdf');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="process-analysis">
      <h1>Forms Data</h1>
      <div className="card-container">
        {/* Filter Card */}
        <div className="card filter-card">
          <Card sx={{ padding: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                label="Month"
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                label="Year"
                type="number"
                placeholder="e.g. 2023"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                size="small"
              />
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
              <Button variant="outlined" color="primary" onClick={clearFilters} size="small">
                Clear
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
                disabled={selectedRows.length === 0}
                size="small"
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </div>

        <div className="card export-card">
          <h2>Export Data</h2>
          <button className="export-btn" onClick={exportToCSV}>Export to CSV</button>
          <div></div>
          <button className="export-btn" onClick={exportToPDF}>Export to PDF</button>
        </div>
      </div>

      {/* Table for form submissions */}
      {formSubmissions.length > 0 ? (
        <table className="custom-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === formSubmissions.length}
                  onChange={(e) => {
                    setSelectedRows(e.target.checked ? formSubmissions.map((submission) => submission.id) : []);
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
                <td>
                  <select
                    value={submission.processType || ''}
                    onChange={(e) => updateProcessType(submission.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="progressing">Progressing</option>
                    <option value="accept">Accept</option>
                    <option value="reject">Reject</option>
                    <option value="hold">Hold</option>
                    <option value="complete">Complete</option>
                  </select>
                </td>
                <td>{formatDate(submission.submissionDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No form submissions found.</p>
      )}
    </div>
  );
};

export default FormsData;
