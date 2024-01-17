const createLabel = require("./createlabel");
const getUnreadEmails = require("./getunreadmsg");

async function main(auth,labelName,google,res){
    
    const gmail = google.gmail({version:"v1",auth})
    console.log(gmail)
 
    const labelId = await createLabel(gmail,labelName)
    console.log(labelId)

    setInterval(async()=>{
        const msg = await getUnreadEmails(gmail); 
        if(msg && msg.length > 0) { 
            for(const m of msg){
             
                const message = await gmail.users.messages.get({
                    auth,
                    userId:"me",
                    id:m.id,
                })
                console.log(message)
               
                const email = message.data;
                console.log(email)
           
                const replied = email.payload.headers.some((h)=> h.name === "In-Reply-To"); 

                if(!replied){
                    const replyMsg={
                        userId:"me",
                        resource:{
                            raw:Buffer.from(
                                `To:${email.payload.headers.find((h)=>h.name==="From").value}\r\n` +  
                                `Subject: Regarding: ${email.payload.headers.find((h)=>h.name==="Subject").value}\r\n` + 
                                `Content-Type: text/plain; charset="UTF-8"\r\n` +  //
                                `Content-Transfer-Encoding: 7bit\r\n\r\n` + 
                                `Thank You For Sending Me Your Email.\n\n I am Currently Unavailable and will revert back to you very Soon.\n\n This is My Bot Replying.I will get in touch soon.\n\n\n\n Thank You.` //body of email
                            ).toString("base64"), 
                        }
                    }
                    
                    await gmail.users.messages.send(replyMsg);
                    
                    await gmail.users.messages.modify({ 
                        auth,
                        userId:"me",
                        id:m.id,
                        resource:{
                            addLabelIds:[labelId],
                        }
                    })
                }
            }
        }
    }, Math.floor(Math.random()*(120-45+1)+45)*1000) 
}

module.exports=main;