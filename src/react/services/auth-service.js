import GoTrue from "gotrue-js";

class AuthService {
    constructor() {
        this.auth = new GoTrue({
            APIUrl: "https://team-achievement-tracker.netlify.com/.netlify/identity",
            setCookie: true
        });
    }

    get currentUser() {
        return this.auth.currentUser();
    }

    login(email, password) {
        return this.auth.login(email, password, true);
    }

    logout() {
        if (this.currentUser) {
            return this.currentUser.logout();
        }
        return Promise.reject("User is not logged in");
    }

    signUp(data) {
        return this.auth.signup(data.email, data.password, { full_name: data.firstName + " " + data.lastName, firstName: data.firstName, lastName: data.lastName })
            .then(response => {
                console.log(response);
                if (response.confirmed_at) {
                    return this.login(data.email, data.password);
                }
            });
    }

    refresh() {
        
    }

    async makeAuthenticatedRequest(url, options) {
        return fetch(url, Object.assign({}, options, { headers: { Authorization: "Bearer " + (await this.currentUser.jwt()) } }));
    }
}

export default new AuthService();