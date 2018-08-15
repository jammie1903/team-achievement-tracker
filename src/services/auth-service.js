import GoTrue from "gotrue-js";

class AuthService {
    constructor() {
        this.auth = new GoTrue({
            APIUrl: "https://team-achievement-tracker.netlify.com/.netlify/identity",
            setCookie: true
        });
        this._userData = null;
        if (this.currentUser) {
            this.makeAuthenticatedRequest("http://localhost:3001/user")
                .then(res => {
                    if (!res.ok) {
                        this.logout().then(() =>
                            res.json()
                                .then(json => { throw json })
                        );
                    }
                    return res.json();
                })
                .then(user => {
                    this._userData = user.data;
                    this.onUserDataChanged();
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
            .then(() => this.makeAuthenticatedRequest("http://localhost:3001/user"))
            .then(res => res.json())
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
                        .then(() => this.makeAuthenticatedRequest("http://localhost:3001/user", { method: "post" }))
                        .then(res => res.json())
                        .then(user => {
                            this._userData = user.data;
                            this.onUserDataChanged();
                        });
                }
            });
    }

    updateUser(fields) {
        return this.makeAuthenticatedRequest("http://localhost:3001/user", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "put",
            body: JSON.stringify(fields),
        }
        ).then(res => res.json())
            .then(user => {
                this._userData = user.data;
                this.onUserDataChanged();
            });
    }

    async makeAuthenticatedRequest(url, options) {
        const parsedOptions = Object.assign({ headers: {} }, options);
        parsedOptions.headers.Authorization = "Bearer " + (await this.currentUser.jwt());
        return fetch(url, parsedOptions);
    }
}

export default new AuthService();