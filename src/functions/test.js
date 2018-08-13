import fetch from 'node-fetch';
const idenityEndpoint = `https://team-achievement-tracker.netlify.com/.netlify/identity`;
exports.handler = async function (event, context, callback) {

    if (!context.clientContext) {

        return callback(null, JSON.stringify([
            { name: "test" },
            { name: "test 2" }
        ]));
    } else {

        const { identity, user } = context.clientContext;

        const response = await fetch(identity.url + "/admin/users", {
            headers: {
                Authorization: "Bearer " + identity.token
            }
        }).then(res => res.json());
        callback(null, JSON.stringify(response));
    }
}


//c1f9859b7054823ee42592eb1b4175d64d94cdec1a42aea369622bb726706d08