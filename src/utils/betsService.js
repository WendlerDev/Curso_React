import betsData from '../data/bets.json';
import users from '../data/users.json';

// Mock database - in a real app this would be an API call
let bets = [...betsData];
let nextBetId = bets.length > 0 ? Math.max(...bets.map(bet => bet.id)) + 1 : 1;

// Get all bets
export const getAllBets = () => {
  return bets;
};

// Get bet by ID
export const getBetById = (id) => {
  return bets.find(bet => bet.id === parseInt(id)) || null;
};

// Create a new bet
export const createBet = (betData) => {
  const newBet = {
    id: nextBetId++,
    ...betData,
    participants: [],
    tasks: {
      positive: [
        { id: "gym", name: "Went to the gym", points: 1 },
        { id: "water", name: "Drank 2 liters of water", points: 1 },
        { id: "meditation", name: "Meditated for 10 minutes", points: 1 }
      ],
      negative: [
        { id: "junkFood", name: "Ate junk food", points: -1 },
        { id: "lateNight", name: "Stayed up past midnight", points: -1 }
      ]
    }
  };
  
  bets.push(newBet);
  return newBet;
};

// Add participant to a bet
export const addParticipantToBet = (betId, userId) => {
  const bet = getBetById(betId);
  if (!bet) return { success: false, message: 'Bet not found' };
  
  // Check if user already exists in the bet
  if (bet.participants.some(p => p.userId === userId)) {
    return { success: false, message: 'User is already participating in this bet' };
  }
  
  // Add participant
  bet.participants.push({
    userId,
    dailyActivities: [],
    points: 0
  });
  
  return { success: true, bet };
};

// Get user info for participant display
export const getUsersInfo = (userIds) => {
  return users.filter(user => userIds.includes(user.id))
             .map(({ id, name, username }) => ({ id, name, username }));
};

// Log daily activities for a participant
export const logDailyActivity = (betId, userId, date, completedTasks, forbiddenTasks) => {
  const bet = getBetById(betId);
  if (!bet) return { success: false, message: 'Bet not found' };
  
  // Find participant
  const participantIndex = bet.participants.findIndex(p => p.userId === userId);
  if (participantIndex === -1) return { success: false, message: 'User is not a participant' };
  
  // Check if activity for this date already exists
  const activityIndex = bet.participants[participantIndex].dailyActivities.findIndex(
    a => a.date === date
  );
  
  if (activityIndex !== -1) {
    // Update existing activity
    bet.participants[participantIndex].dailyActivities[activityIndex] = {
      date,
      completedTasks,
      forbiddenTasks
    };
  } else {
    // Add new activity
    bet.participants[participantIndex].dailyActivities.push({
      date,
      completedTasks,
      forbiddenTasks
    });
  }
  
  // Recalculate points
  bet.participants[participantIndex].points = calculatePoints(
    bet.participants[participantIndex].dailyActivities,
    bet.tasks
  );
  
  return { success: true, bet };
};

// Calculate points for a participant
const calculatePoints = (activities, tasks) => {
  let totalPoints = 0;
  
  activities.forEach(activity => {
    // Add points for positive tasks
    activity.completedTasks.forEach(taskId => {
      const task = tasks.positive.find(t => t.id === taskId);
      if (task) totalPoints += task.points;
    });
    
    // Subtract points for negative tasks
    activity.forbiddenTasks.forEach(taskId => {
      const task = tasks.negative.find(t => t.id === taskId);
      if (task) totalPoints += task.points; // task.points is already negative
    });
  });
  
  return totalPoints;
};