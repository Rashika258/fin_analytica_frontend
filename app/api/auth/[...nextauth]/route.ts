import { compare } from "bcrypt";
import { DefaultSession, NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session extends DefaultSession{
        user:{
            id: string,
            username: string
        }
    }
}

export const authOptions : NextAuthOptions ={
    providers:[
        CredentialsProvider({
            credentials:{
                username:{
                    label:"Username",
                    type: "text"
                },
                password:{
                    label:"Password",
                    type:"password"
                }
            },
            async  authorize(credentials) {
                const { username, password} = credentials ?? {}
                if(!username || !password) {
                    throw new Error("Missing username or password")
                }

                const user = await prisma.user.findUnique({
                    where:{
                        username
                    }
                });

                // if user doesn't exist or password doesn't match

                if(!user || (!(await compare(password, user.password)))) {
                    throw new Error("Invalid username or password");
                }
                return user;
            }
        })
    ],
    callbacks:{
        async jwt({token}) {
            if(token.sub) {
                const dbUser = await prisma.user.findFirst({
                    where:{
                        id: token.sub
                    }
                });
                token.name = dbUser?.username;
                return token
            }
            throw new Error("Invalid token")
        },

        async session({session, token}) {
           if(session.user && token.sub && token.name) {
            session.user.id = token.sub;
            session.user.username = token.name
           } 
           return session
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST}