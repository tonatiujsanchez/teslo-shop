import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database";




export default NextAuth({
    // Configure one or more authentication providers
    providers: [

        
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@email.com' },
                password: { label: 'Password:', type: 'password', placeholder: 'Contraseña' },
            },
            async authorize(credentials){
                // console.log({ credentials });
                return await dbUsers.checkEmailPassword( credentials!.email, credentials!.password )
            }

        }),

        // ...add more providers here
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

    ],
    
    // custom pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },

    // Callbacks
    jwt: {
        // secret: process.env.JWT_SECRET_SEED, //Deprecated
    },
    session: {
        maxAge: 2592000, //cada 30d
        strategy: 'jwt',
        updateAge: 86400 //Cada dia
    },
    callbacks: {
        async jwt({ token, account, user }){
            // console.log({ token, account, user });
            
            if(account) {
                token.accessToken = account.access_token

                switch (account.type) {

                    case 'oauth':
                        token.user = await dbUsers.oAuthToDBUser( user?.email || '', user?.name || '' ) 
                        break;
                
                    case 'credentials':
                        token.user = user
                        break;
                    default:
                        break;
                }
            }

            return token
        },
        async session({ session, token, user }){
            // console.log({ session, token, user });

            // session.accessToken = token.access_token
            session.accessToken = token.accessToken
            session.user = token.user as any

            return session
        }

    }
})