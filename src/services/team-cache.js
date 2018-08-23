import AuthService from '../services/auth-service';
import endpoints from '../services/endpoints';

class TeamCache {
    constructor() {
        this.initialised = false;
        this.initPromise = null
    }

    async initialise() {
        if (!AuthService.currentUser) {
            throw new Error("Not authenticated");
        }
        if (!this.initPromise) {
            this.initPromise = AuthService.makeAuthenticatedRequest(endpoints.achievementTrackerApi + "/users/team")
            .then(team => {
                this.initialised = true;
                this.userCache = team.data.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                return this;
            });
        }
        return this.initPromise;
    }

    async loadUser(userId) {
        await this.initialise();
        return {};
    }

    getUser(userId) {
        if(!this.initialised) {
            throw new Error("Service not initialised");
        }
        return userId ? this.userCache[userId] || null : null;
    }
}

export default new TeamCache();
