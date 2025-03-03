import React, { useEffect, useState } from 'react';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';
import { getUsersInfo } from '../../utils/betsService';

const ParticipantsList = ({ bet }) => {
  const [participants, setParticipants] = useState([]);
  
  useEffect(() => {
    if (bet && bet.participants) {
      // Get user details for all participants
      const userIds = bet.participants.map(p => p.userId);
      const users = getUsersInfo(userIds);
      
      // Combine user info with points data
      const participantsWithInfo = bet.participants.map(participant => {
        const user = users.find(u => u.id === participant.userId);
        return {
          ...participant,
          name: user ? user.name : 'Unknown User',
          username: user ? user.username : 'unknown'
        };
      });
      
      // Sort by points (highest first)
      const sortedParticipants = participantsWithInfo.sort((a, b) => b.points - a.points);
      setParticipants(sortedParticipants);
    }
  }, [bet]);
  
  if (!bet || bet.participants.length === 0) {
    return (
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Participants Ranking</CardTitle>
          <p className="text-muted">No participants have joined this bet yet.</p>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle tag="h5">Participants Ranking</CardTitle>
        
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={participant.userId}>
                <td>{index + 1}</td>
                <td>{participant.name}</td>
                <td>{participant.points}</td>
                <td>
                  {index === 0 && participants.length > 1 ? 
                    <span className="text-success">Leading</span> : 
                    (index === participants.length - 1 && participants.length > 1 ? 
                      <span className="text-danger">Last Place</span> : 
                      <span className="text-muted">Participating</span>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ParticipantsList;