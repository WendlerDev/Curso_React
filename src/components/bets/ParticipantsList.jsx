import React, { useEffect, useState } from 'react';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';
import { getUsersInfo } from '../../utils/betsService';

const ParticipantsList = ({ bet }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (bet && bet.participants) {
      // Get usuario para todas as apostas
      const userIds = bet.participants.map(p => p.userId);
      const users = getUsersInfo(userIds);

      // Usuarios e data
      const participantsWithInfo = bet.participants.map(participant => {
        const user = users.find(u => u.id === participant.userId);
        return {
          ...participant,
          name: user ? user.name : 'Usuario desconhecido',
          username: user ? user.username : 'desconhecido'
        };
      });

      // Sort por pontos
      const sortedParticipants = participantsWithInfo.sort((a, b) => b.points - a.points);
      setParticipants(sortedParticipants);
    }
  }, [bet]);

  if (!bet || bet.participants.length === 0) {
    return (
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Ranking dos participantes</CardTitle>
          <p className="text-muted">Nenhum participante entrou nessa aposta.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle tag="h5">Ranking dos participantes</CardTitle>

        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Pontos</th>
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
                    <span className="text-success">Líder</span> :
                    (index === participants.length - 1 && participants.length > 1 ?
                      <span className="text-danger">Último lugar</span> :
                      <span className="text-muted">Participante</span>
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