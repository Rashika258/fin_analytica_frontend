
import { PrismaClient } from "@prisma/client"
import {hash} from "bcrypt"
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where:{
            username:"rashika",
            
        },
        update:{},
        create:{
            username:"rashika",
            password: await hash("password", 10),
            preferences:{
                create:{
                    classificationModel: "gpt-3.5-turbo",
                    extractionModel: "gpt-3.5-turbo",
                    analysisModel: "gpt-3.5-turbo",
                }
            }
        }
    })
    
}

main()
.then(async() =>{
    await prisma.$disconnect()
}).catch(async(e)=>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})