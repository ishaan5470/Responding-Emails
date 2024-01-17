
async function createLabel(gmail, labelName) {
    try {
       
        const res = await gmail.users.labels.create({
            userId: "me",
            requestBody: {
                name: labelName,
                labelListVisibility: "labelShow",
                messageListVisibility: "show",
            }
        });
       
        return res.data.id;
    } catch (error) {
        if (error.code === 409) { 
            const res = await gmail.users.labels.list({ userId: "me" });
            const label = res.data.labels.find((l) => l.name === labelName); 
            return label.id;
        } else {
            throw error;
        }
    }
}

module.exports = createLabel;