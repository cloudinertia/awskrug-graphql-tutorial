const {ApolloServer, gql} = require("apollo-server");
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = gql`
    extend type Query {
        myUser: User
    }
    type User @key(fields: "address") {
        address: String!
        name: String
    }
`

const resolvers = {
    User: {
        __resolveReference({address}) {
            return users.find(user => user.address === address);
        }
    }
}


const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

server.listen({port: 4003}).then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});

const users = [
    {address: "0x111", name: "graphql"},
    {address: "0x222", name: "awskrug"}
   ]
