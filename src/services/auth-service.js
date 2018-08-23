import GoTrue from "gotrue-js";
import endpoints from "./endpoints";

class AuthService {
    constructor() {
        this.auth = new GoTrue({
            APIUrl: endpoints.identityApi,
            setCookie: true
        });
        this._userData = null;
        if (this.currentUser) {
            this.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/user`)
                .then(user => {
                    this._userData = user.data;
                    this.onUserDataChanged();
                }).catch(async err => {
                    await this.logout();
                    throw err;
                });
        }
        this.onUserDataChanged = () => { };
    }

    get currentUser() {
        return this.auth.currentUser();
    }

    get user() {
        return this._userData || {};
    }

    login(email, password) {
        return this.auth.login(email, password, true)
            .then(() => this.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/user`))
            .then(user => {
                this._userData = user.data;
                this.onUserDataChanged();
            });
    }

    logout() {
        if (this.currentUser) {
            return this.currentUser.logout();
        }
        return Promise.reject("User is not logged in");
    }

    signUp(data) {
        return this.auth.signup(data.email, data.password, {
            full_name: data.firstName + " " + data.lastName,
            firstName: data.firstName,
            lastName: data.lastName,
            isTeamLead: data.isTeamLead,
        })
            .then(response => {
                if (response.confirmed_at) {
                    return this.auth.login(data.email, data.password, true)
                        .then(() => this.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/user`, { method: "post" }))
                        .then(user => {
                            this._userData = user.data;
                            this.onUserDataChanged();
                        });
                }
            });
    }

    updateUser(fields) {
        return this.makeAuthenticatedRequest(`${endpoints.achievementTrackerApi}/user`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "put",
            body: JSON.stringify(fields),
        }).then(user => {
            this._userData = user.data;
            this.onUserDataChanged();
        });
    }

    async makeAuthenticatedRequest(url, options) {
        const parsedOptions = Object.assign({ headers: {} }, options);
        parsedOptions.headers.Authorization = "Bearer " + (await this.currentUser.jwt());
        return fetch(url, parsedOptions).then((res) => {
            if (!res.ok) {
                return res.json().then(json => { throw json });
            }
            return res.json();
        });
    }
}

export default new AuthService();