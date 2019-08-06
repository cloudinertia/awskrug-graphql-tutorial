const {ApolloServer, gql} = require("apollo-server");
const {buildFederatedSchema} = require("@apollo/federation");

// account 서비스
//
const typeDefs = gql`
    extend type Query {
        myAccount: Account
        getAccount(address: String!): Account
    }
    type Account @key(fields: "address"){
        address: String!
        name: String
        blockchain: String
    }
`

const resolvers = {
    Query: {
        myAccount() {
            return accounts[0];
        },
        getAccount(parent, {address}) {
            return accounts.find(account => account.address === address);
        }
    },
    Account: {
        __resolveReference(object) {
            return accounts.find(account => account.address === object.address);
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
        blockchain: "eth",
        name:"awskrug"
    },
    {
        address: "0x222",
        blockchain: "eth",
        name:"graphql"
    }
]