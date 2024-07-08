import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from '../src/Components/TaskList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
      </Routes>
    </Router>
  );
}

export default App;
