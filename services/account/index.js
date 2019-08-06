const {ApolloServer, gql} = require("apollo-server");
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = gql`
    extend type Query {
        me: Account
        getAccount(address: String!): Account
    }
    type Account @key(fields: "address"){
        address: String!
        user: User
    }
    extend type User @key(fields: "address") {
        address: String! @external
    }
`

const resolvers = {
    Query: {
        me() {
            console.log('touched account')
            return accounts[0];
        },
        getAccount(parent, {address}) {
            console.log("addr", address)
            return accounts.find(account => account.address === address);
        }
    },
    Account: {
        __resolveReference(object) {
            return address.find(account => account.address === object.address);
        },
        user(object) {
            return {__typename: "User", address: object.address}
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

server.listen({port: 4001}).then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});

const accounts = [
    {
        address: "0x111",
    },
    {
        address: "0x222",
    }
]