const {ApolloServer} = require("apollo-server");
const {ApolloGateway} = require("@apollo/gateway");

const gateway = new ApolloGateway({
    serviceList: [
        {name: "account", url: "http://localhost:4001/graphql"},
        {name: "transaction", url: "http://localhost:4002/graphql"},
        {name: "user", url: "http://localhost:4003/graphql"}
    ]
});

(async () => {
    const {schema, executor} = await gateway.load();

    const server = new ApolloServer({schema, executor});

    server.listen().then(({url}) => {
        console.log(`🚀 Server ready at ${url}`);
    });
})();
