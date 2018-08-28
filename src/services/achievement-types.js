class Types {
    account = {
        id: 'account',
        name: "Accounts",
        actionText: "got an account!"
    };

    customerService = {
        id: 'customerService',
        name: "Good Customer Service",
        actionText: "served them good!"
    };

    get all() {
        return Object.keys(this).map(k => this[k]);
    }
}

export default new Types();