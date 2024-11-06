import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import './FormsData.css';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardActions, Button, TextField, Grid, Box } from '@mui/material';
import { CSVLink } from 'react-csv'; // Importing CSV export library
import { jsPDF } from 'jspdf'; // Importing PDF export library
import 'jspdf-autotable'; // Import the jsPDF autotable plugin

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

      if (filterDate) {
        const date = new Date(filterDate);
        queryRef = query(
          queryRef,
          where('submissionDate', '>=', Timestamp.fromDate(date)),
          where('submissionDate', '<', Timestamp.fromDate(new Date(date.setDate(date.getDate() + 1)))),
        );
      }

      if (filterMonth) {
        const startOfMonth = new Date(filterMonth + '-01');
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        queryRef = query(
          queryRef,
          where('submissionDate', '>=', Timestamp.fromDate(startOfMonth)),
          where('submissionDate', '<=', Timestamp.fromDate(endOfMonth)),
        );
      }

      if (filterYear) {
        const startOfYear = new Date(filterYear, 0, 1);
        const endOfYear = new Date(filterYear, 11, 31, 23, 59, 59);
        queryRef = query(
          queryRef,
          where('submissionDate', '>=', Timestamp.fromDate(startOfYear)),
          where('submissionDate', '<=', Timestamp.fromDate(endOfYear)),
        );
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

  // Function to export selected rows to PDF in landscape orientation
  const exportToPDF = () => {
    const doc = new jsPDF('landscape'); // Set landscape orientation
    const selectedData = formSubmissions.filter(submission => selectedRows.includes(submission.id));

    // Set title
    doc.setFontSize(16);
    doc.text('Form Submissions', 10, 10);

    // Table header
    const headers = ['Name', 'Email', 'Age', 'Country Code', 'Delivery Time', 'Investment', 'Location', 'Monthly Income', 'Occupation', 'Purpose', 'Process Type', 'Submission Date'];

    // Table rows
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

    // Use autoTable to add table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20, // Start Y position for the table
    });

    doc.save('form_submissions.pdf');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Forms Data</h1>

      {/* Grid Layout for Old and New Cards */}
      <Grid container spacing={2}>
        {/* Old Card: Filter and Actions */}
        <Grid item xs={12} sm={6}>
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
        </Grid>

        {/* New Card: Export Buttons */}
        <Grid item xs={12} sm={3} style={{ marginLeft: 6 }}>
          <Card sx={{ padding: 1 }}>
            <CardContent>
              <div style={{ marginBottom: '10px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <CSVLink
                    data={selectedRows.length > 0 ? formSubmissions.filter(submission => selectedRows.includes(submission.id)) : formSubmissions} // Export all if no rows selected
                    filename={'form_submissions.csv'}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={selectedRows.length === 0}
                      sx={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#45a049',
                        },
                      }}
                    >
                      Export to CSV
                    </Button>
                  </CSVLink>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={exportToPDF}
                    disabled={selectedRows.length === 0}
                    sx={{
                      backgroundColor: '#2196f3',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                      },
                    }}
                  >
                    Export to PDF
                  </Button>
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

     {/* Table for displaying form submissions */}
     {formSubmissions.length > 0 ? (
        <table className="table table-bordered" style={{ width: '100%' }}>
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
                    <option value="">Select Process Type</option>
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
