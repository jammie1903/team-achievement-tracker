const devMode = process.env.NODE_ENV === 'development'

export default {
    achievementTrackerApi: devMode ? 'http://localhost:3001' : 'https://team-achievement-tracker-api.herokuapp.com',
    identityApi: "https://team-achievement-tracker.netlify.com/.netlify/identity",
}